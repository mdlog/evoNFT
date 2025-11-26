import cron from 'node-cron';
import { EvolutionEngine } from './evolutionEngine.js';
import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

let evolutionEngine;
let isRunning = false;

/**
 * Initialize evolution engine
 */
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
 * Scan for eligible tokens and auto-evolve
 */
async function scanAndEvolve() {
    if (isRunning) {
        logger.info('Scan already running, skipping...');
        return;
    }

    isRunning = true;
    logger.info('Starting evolution scan...');

    try {
        const engine = getEvolutionEngine();

        // Get total minted tokens
        const totalMinted = await engine.contract.totalMinted();
        logger.info(`Total minted tokens: ${totalMinted}`);

        const eligibleTokens = [];

        // Check each token
        for (let tokenId = 0; tokenId < totalMinted; tokenId++) {
            try {
                const canEvolve = await engine.contract.canEvolve(tokenId);
                if (canEvolve) {
                    eligibleTokens.push(tokenId);
                }
            } catch (error) {
                // Token might not exist or other error
                continue;
            }
        }

        logger.info(`Found ${eligibleTokens.length} eligible tokens`);

        // Process eligible tokens (with default signals)
        if (eligibleTokens.length > 0) {
            const batchSize = parseInt(process.env.BATCH_SIZE) || 10;
            const batch = eligibleTokens.slice(0, batchSize);

            logger.info(`Processing batch of ${batch.length} tokens`);

            for (const tokenId of batch) {
                try {
                    // Use default signals for auto-evolution
                    const signals = {
                        transactionCount: 25,
                        stakingDays: 15,
                        tradingVolume: 500
                    };

                    const result = await engine.evolveToken(tokenId, signals);

                    if (result.success) {
                        logger.info(`✅ Token ${tokenId} evolved successfully`);
                    } else {
                        logger.warn(`⚠️ Token ${tokenId} evolution failed: ${result.reason || result.error}`);
                    }

                    // Delay between evolutions
                    await new Promise(resolve => setTimeout(resolve, 5000));

                } catch (error) {
                    logger.error(`Error evolving token ${tokenId}:`, error);
                }
            }
        }

    } catch (error) {
        logger.error('Scan error:', error);
    } finally {
        isRunning = false;
        logger.info('Evolution scan completed');
    }
}

/**
 * Start evolution scheduler
 */
export function startEvolutionScheduler() {
    const interval = process.env.EVOLUTION_CHECK_INTERVAL || 3600000; // 1 hour default
    const intervalMinutes = Math.floor(interval / 60000);

    logger.info(`🕐 Evolution scheduler started (checking every ${intervalMinutes} minutes)`);

    // Run every hour (or configured interval)
    // Cron format: minute hour day month weekday
    // For every hour: '0 * * * *'
    // For every 6 hours: '0 */6 * * *'

    const cronExpression = intervalMinutes >= 60
        ? `0 */${Math.floor(intervalMinutes / 60)} * * *`  // Every N hours
        : `*/${intervalMinutes} * * * *`;  // Every N minutes

    cron.schedule(cronExpression, () => {
        logger.info('⏰ Scheduled evolution scan triggered');
        scanAndEvolve();
    });

    // Also run once on startup (after 30 seconds)
    setTimeout(() => {
        logger.info('🚀 Running initial evolution scan');
        scanAndEvolve();
    }, 30000);
}

/**
 * Manual trigger for testing
 */
export async function triggerManualScan() {
    logger.info('🔧 Manual scan triggered');
    await scanAndEvolve();
}
