import express from 'express';
import { EvolutionEngine } from '../services/evolutionEngine.js';
import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

export const evolutionRouter = express.Router();

// Initialize evolution engine
let evolutionEngine;

function getEvolutionEngine() {
    if (!evolutionEngine) {
        const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
        const aiSigner = new ethers.Wallet(process.env.AI_SIGNER_PRIVATE_KEY, provider);
        evolutionEngine = new EvolutionEngine(
            process.env.CONTRACT_ADDRESS,
            provider,
            aiSigner
        );
    }
    return evolutionEngine;
}

/**
 * POST /api/evolution/request
 * Request evolution signature for a token
 */
evolutionRouter.post('/request', async (req, res) => {
    try {
        const { tokenId, signals = {} } = req.body;

        if (!tokenId) {
            return res.status(400).json({ error: 'tokenId is required' });
        }

        logger.info(`Evolution request for token ${tokenId}`);

        const engine = getEvolutionEngine();

        // Check eligibility
        const eligibility = await engine.checkEligibility(tokenId, signals);
        if (!eligibility.eligible) {
            return res.status(400).json({
                error: 'Not eligible for evolution',
                reason: eligibility.reason,
                score: eligibility.score
            });
        }

        // Get current metadata
        const currentURI = await engine.contract.tokenURI(tokenId);
        const currentMetadata = await engine.fetchMetadata(currentURI);

        // Generate new metadata
        const newMetadata = await engine.generateNewMetadata(
            tokenId,
            currentMetadata,
            signals
        );

        // Upload to IPFS
        const { uploadToIPFS } = await import('../utils/ipfs.js');
        const newMetadataURI = await uploadToIPFS(newMetadata);

        // Get nonce and create signature
        const [, , , nonce] = await engine.contract.getEvolutionInfo(tokenId);
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

        const { signEvolveRequest } = await import('../utils/signer.js');
        const signature = await signEvolveRequest(
            engine.aiSigner,
            engine.contractAddress,
            tokenId,
            newMetadataURI,
            nonce,
            deadline
        );

        logger.info(`Evolution signature generated for token ${tokenId}`);

        res.json({
            success: true,
            tokenId,
            newMetadataURI,
            signature,
            deadline,
            nonce: nonce.toString(),
            evolutionType: engine.determineEvolutionType(currentMetadata.version, signals),
            score: eligibility.score,
            newMetadata
        });

    } catch (error) {
        logger.error('Evolution request error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/evolution/trigger
 * Trigger full evolution (backend executes transaction)
 */
evolutionRouter.post('/trigger', async (req, res) => {
    try {
        const { tokenId, signals = {} } = req.body;

        if (!tokenId && tokenId !== 0) {
            return res.status(400).json({ error: 'tokenId is required' });
        }

        logger.info(`Evolution trigger for token ${tokenId}`);

        const engine = getEvolutionEngine();
        const result = await engine.evolveToken(tokenId, signals);

        res.json(result);

    } catch (error) {
        logger.error('Evolution trigger error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/evolution/owner-evolve
 * Owner evolve (bypass cooldown for testing)
 */
evolutionRouter.post('/owner-evolve', async (req, res) => {
    try {
        const { tokenId } = req.body;

        if (tokenId === undefined) {
            return res.status(400).json({ error: 'tokenId is required' });
        }

        logger.info(`Owner evolve for token ${tokenId}`);

        const engine = getEvolutionEngine();

        // Generate new metadata
        const currentURI = await engine.contract.tokenURI(tokenId);
        const currentMetadata = await engine.fetchMetadata(currentURI);
        const signals = { transactionCount: 30, stakingDays: 20, tradingVolume: 600 };
        const newMetadata = await engine.generateNewMetadata(tokenId, currentMetadata, signals);

        // Upload to IPFS
        const { uploadToIPFS } = await import('../utils/ipfs.js');
        const newMetadataURI = await uploadToIPFS(newMetadata);

        // Call ownerEvolve (bypass cooldown)
        const contractABI = [
            "function ownerEvolve(uint256 tokenId, string calldata newURI) external"
        ];
        const contract = new ethers.Contract(
            engine.contractAddress,
            contractABI,
            engine.aiSigner
        );

        logger.info(`Calling ownerEvolve for token ${tokenId}`);
        const tx = await contract.ownerEvolve(tokenId, newMetadataURI);
        logger.info(`Transaction sent: ${tx.hash}`);

        await tx.wait();
        logger.info(`Evolution confirmed!`);

        res.json({
            success: true,
            tokenId,
            txHash: tx.hash,
            newMetadataURI,
            evolutionType: engine.determineEvolutionType(currentMetadata.version, signals),
            message: 'Owner evolution successful (cooldown bypassed)'
        });

    } catch (error) {
        logger.error('Owner evolve error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/evolution/status/:tokenId
 * Get evolution status for a token
 */
evolutionRouter.get('/status/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;

        const engine = getEvolutionEngine();

        const [version, lastEvolved, nextEvolveTime, nonce] =
            await engine.contract.getEvolutionInfo(tokenId);

        const canEvolve = await engine.contract.canEvolve(tokenId);

        res.json({
            tokenId,
            version: version.toString(),
            lastEvolved: lastEvolved.toString(),
            nextEvolveTime: nextEvolveTime.toString(),
            nonce: nonce.toString(),
            canEvolve,
            cooldownRemaining: canEvolve ? 0 : Number(nextEvolveTime) - Math.floor(Date.now() / 1000)
        });

    } catch (error) {
        logger.error('Status check error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/evolution/check/:tokenId
 * Check if token can evolve (with score calculation)
 */
evolutionRouter.get('/check/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;
        const signals = req.query; // Get signals from query params

        const engine = getEvolutionEngine();
        const eligibility = await engine.checkEligibility(tokenId, signals);

        res.json({
            tokenId,
            ...eligibility
        });

    } catch (error) {
        logger.error('Eligibility check error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/evolution/batch
 * Batch evolution for multiple tokens
 */
evolutionRouter.post('/batch', async (req, res) => {
    try {
        const { tokenIds, signalsMap = {} } = req.body;

        if (!tokenIds || !Array.isArray(tokenIds)) {
            return res.status(400).json({ error: 'tokenIds array is required' });
        }

        logger.info(`Batch evolution for ${tokenIds.length} tokens`);

        const engine = getEvolutionEngine();
        const results = await engine.batchEvolve(tokenIds, signalsMap);

        res.json({
            success: true,
            results
        });

    } catch (error) {
        logger.error('Batch evolution error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/evolution/history/:tokenId
 * Get evolution history for a token
 */
evolutionRouter.get('/history/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;

        const engine = getEvolutionEngine();
        const currentURI = await engine.contract.tokenURI(tokenId);
        const metadata = await engine.fetchMetadata(currentURI);

        res.json({
            tokenId,
            currentVersion: metadata.version || 1,
            history: metadata.evolutionHistory || []
        });

    } catch (error) {
        logger.error('History fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/evolution/test-image
 * Test AI image generation
 */
evolutionRouter.post('/test-image', async (req, res) => {
    try {
        const { testImageGeneration } = await import('../utils/imageGenerator.js');

        logger.info('Testing AI image generation...');
        const imageUri = await testImageGeneration();

        res.json({
            success: true,
            imageUri,
            message: 'AI image generated successfully'
        });

    } catch (error) {
        logger.error('Test image error:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * POST /api/evolution/generate-mint-metadata
 * Generate metadata with AI image for minting
 */
evolutionRouter.post('/generate-mint-metadata', async (req, res) => {
    try {
        const { creatureType = 'Cat', rarity = 'common' } = req.body;

        logger.info(`Generating mint metadata for ${creatureType} (${rarity})`);

        const { generateEvolutionImage } = await import('../utils/imageGenerator.js');

        // Generate metadata
        const tokenId = Math.floor(Math.random() * 10000);
        const metadata = {
            name: `EvoNFT #${tokenId}`,
            attributes: [
                { trait_type: 'Creature Type', value: creatureType },
                { trait_type: 'Rarity', value: rarity },
                { trait_type: 'Level', value: 1 }
            ]
        };

        // Generate AI image
        logger.info('Generating AI image...');
        const imageUri = await generateEvolutionImage(
            tokenId,
            rarity,
            1,
            metadata
        );

        // Complete metadata
        const fullMetadata = {
            name: metadata.name,
            description: `A ${rarity} ${creatureType} ready to evolve and grow stronger!`,
            image: imageUri,
            attributes: [
                ...metadata.attributes,
                { trait_type: 'Strength', value: 5 },
                { trait_type: 'Intelligence', value: 5 },
                { trait_type: 'Speed', value: 5 },
                { trait_type: 'Endurance', value: 5 },
                { trait_type: 'Luck', value: 5 }
            ],
            version: 1
        };

        // Upload to IPFS
        const { uploadToIPFS } = await import('../utils/ipfs.js');
        const metadataUri = await uploadToIPFS(fullMetadata);

        logger.info(`Metadata generated: ${metadataUri}`);

        res.json({
            success: true,
            metadataUri,
            metadata: fullMetadata,
            imageUri
        });

    } catch (error) {
        logger.error('Generate mint metadata error:', error);
        res.status(500).json({ error: error.message });
    }
});
