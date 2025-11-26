import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';
import { uploadToIPFS } from '../utils/ipfs.js';
import { generateEvolutionMetadata } from '../utils/metadata.js';
import { signEvolveRequest } from '../utils/signer.js';

/**
 * Evolution Engine - Core logic for NFT evolution
 */
export class EvolutionEngine {
    constructor(contractAddress, provider, aiSignerWallet) {
        this.contractAddress = contractAddress;
        this.provider = provider;
        this.aiSigner = aiSignerWallet;

        // Contract ABI (minimal for our needs)
        const abi = [
            "function requestEvolve(uint256 tokenId, string calldata newURI, uint256 deadline, bytes calldata signature) external",
            "function getEvolutionInfo(uint256 tokenId) external view returns (uint256, uint256, uint256, uint256)",
            "function canEvolve(uint256 tokenId) external view returns (bool)",
            "function tokenURI(uint256 tokenId) external view returns (string)",
            "function version(uint256 tokenId) external view returns (uint256)",
            "event Evolved(uint256 indexed tokenId, string oldURI, string newURI, uint256 version, uint256 timestamp)"
        ];

        this.contract = new ethers.Contract(contractAddress, abi, provider);
    }

    /**
     * Check if token is eligible for evolution
     */
    async checkEligibility(tokenId, signals) {
        try {
            // Check on-chain eligibility
            const canEvolve = await this.contract.canEvolve(tokenId);
            if (!canEvolve) {
                return { eligible: false, reason: 'Cooldown not passed' };
            }

            // Check signals threshold
            const score = this.calculateEvolutionScore(signals);
            if (score < 50) {
                return { eligible: false, reason: 'Insufficient activity score', score };
            }

            return { eligible: true, score };
        } catch (error) {
            logger.error(`Error checking eligibility for token ${tokenId}:`, error);
            return { eligible: false, reason: error.message };
        }
    }

    /**
     * Calculate evolution score based on signals
     */
    calculateEvolutionScore(signals) {
        let score = 0;

        // On-chain signals
        if (signals.transactionCount) score += Math.min(signals.transactionCount * 2, 30);
        if (signals.stakingDays) score += Math.min(signals.stakingDays * 3, 30);
        if (signals.tradingVolume) score += Math.min(signals.tradingVolume / 100, 20);

        // Off-chain signals
        if (signals.discordActivity) score += Math.min(signals.discordActivity, 10);
        if (signals.twitterMentions) score += Math.min(signals.twitterMentions, 10);

        return Math.min(score, 100);
    }

    /**
     * Determine evolution type based on signals
     */
    determineEvolutionType(currentVersion, signals) {
        const score = this.calculateEvolutionScore(signals);

        if (score >= 90) return 'legendary';
        if (score >= 70) return 'epic';
        if (score >= 50) return 'rare';
        return 'common';
    }

    /**
     * Generate new evolution metadata
     */
    async generateNewMetadata(tokenId, currentMetadata, signals) {
        try {
            const currentVersion = currentMetadata.version || 1;
            const evolutionType = this.determineEvolutionType(currentVersion, signals);

            // Generate new metadata
            const newMetadata = await generateEvolutionMetadata({
                tokenId,
                currentMetadata,
                evolutionType,
                signals,
                newVersion: currentVersion + 1
            });

            return newMetadata;
        } catch (error) {
            logger.error(`Error generating metadata for token ${tokenId}:`, error);
            throw error;
        }
    }

    /**
     * Execute evolution on-chain
     */
    async executeEvolution(tokenId, newMetadataURI) {
        try {
            logger.info(`Executing evolution for token ${tokenId}`);

            // Get current nonce
            const [, , , nonce] = await this.contract.getEvolutionInfo(tokenId);

            // Set deadline (1 hour from now)
            const deadline = Math.floor(Date.now() / 1000) + 3600;

            // Sign the evolution request
            const signature = await signEvolveRequest(
                this.aiSigner,
                this.contractAddress,
                tokenId,
                newMetadataURI,
                nonce,
                deadline
            );

            // Send transaction
            const contractWithSigner = this.contract.connect(this.aiSigner);
            const tx = await contractWithSigner.requestEvolve(
                tokenId,
                newMetadataURI,
                deadline,
                signature
            );

            logger.info(`Evolution transaction sent: ${tx.hash}`);

            // Wait for confirmation
            const receipt = await tx.wait();
            logger.info(`Evolution confirmed in block ${receipt.blockNumber}`);

            return {
                success: true,
                txHash: tx.hash,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            logger.error(`Error executing evolution for token ${tokenId}:`, error);
            throw error;
        }
    }

    /**
     * Full evolution process
     */
    async evolveToken(tokenId, signals) {
        try {
            logger.info(`Starting evolution process for token ${tokenId}`);

            // 1. Check eligibility
            const eligibility = await this.checkEligibility(tokenId, signals);
            if (!eligibility.eligible) {
                return {
                    success: false,
                    reason: eligibility.reason,
                    score: eligibility.score
                };
            }

            // 2. Get current metadata
            const currentURI = await this.contract.tokenURI(tokenId);
            const currentMetadata = await this.fetchMetadata(currentURI);

            // 3. Generate new metadata
            const newMetadata = await this.generateNewMetadata(
                tokenId,
                currentMetadata,
                signals
            );

            // 4. Upload to IPFS
            const newMetadataURI = await uploadToIPFS(newMetadata);
            logger.info(`New metadata uploaded: ${newMetadataURI}`);

            // 5. Execute on-chain evolution
            const result = await this.executeEvolution(tokenId, newMetadataURI);

            return {
                success: true,
                ...result,
                newMetadataURI,
                evolutionType: this.determineEvolutionType(currentMetadata.version, signals),
                score: eligibility.score
            };
        } catch (error) {
            logger.error(`Evolution failed for token ${tokenId}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch metadata from URI
     */
    async fetchMetadata(uri) {
        try {
            // Handle IPFS URIs
            if (uri.startsWith('ipfs://')) {
                const cid = uri.replace('ipfs://', '');
                const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
                return await response.json();
            }

            // Handle HTTP URIs
            const response = await fetch(uri);
            return await response.json();
        } catch (error) {
            logger.error(`Error fetching metadata from ${uri}:`, error);
            throw error;
        }
    }

    /**
     * Batch evolution for multiple tokens
     */
    async batchEvolve(tokenIds, signalsMap) {
        const results = [];

        for (const tokenId of tokenIds) {
            const signals = signalsMap[tokenId] || {};
            const result = await this.evolveToken(tokenId, signals);
            results.push({ tokenId, ...result });

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return results;
    }
}
