import express from 'express';
import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

export const monitorRouter = express.Router();

/**
 * GET /api/monitor/health
 * Detailed health check
 */
monitorRouter.get('/health', async (req, res) => {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

        // Check RPC connection
        const blockNumber = await provider.getBlockNumber();

        // Check AI signer balance
        const aiSigner = new ethers.Wallet(process.env.AI_SIGNER_PRIVATE_KEY, provider);
        const balance = await provider.getBalance(aiSigner.address);

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            blockchain: {
                connected: true,
                blockNumber,
                network: await provider.getNetwork().then(n => n.name)
            },
            aiSigner: {
                address: aiSigner.address,
                balance: ethers.formatEther(balance),
                hasBalance: balance > 0n
            },
            config: {
                contractAddress: process.env.CONTRACT_ADDRESS,
                ipfsConfigured: !!process.env.PINATA_API_KEY || !!process.env.IPFS_API_URL,
                openaiConfigured: !!process.env.OPENAI_API_KEY
            }
        });

    } catch (error) {
        logger.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

/**
 * GET /api/monitor/stats
 * Get evolution statistics
 */
monitorRouter.get('/stats', async (req, res) => {
    try {
        // TODO: Implement stats tracking
        // For now, return mock data
        res.json({
            totalEvolutions: 0,
            successRate: 100,
            averageProcessingTime: 0,
            lastEvolution: null
        });

    } catch (error) {
        logger.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/monitor/config
 * Get current configuration (sanitized)
 */
monitorRouter.get('/config', (req, res) => {
    res.json({
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
        contractAddress: process.env.CONTRACT_ADDRESS,
        chainId: process.env.CHAIN_ID,
        ipfsConfigured: !!process.env.PINATA_API_KEY || !!process.env.IPFS_API_URL,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        evolutionCheckInterval: process.env.EVOLUTION_CHECK_INTERVAL,
        minEvolutionScore: process.env.MIN_EVOLUTION_SCORE
    });
});
