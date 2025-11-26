/**
 * Evolution Service - Frontend integration with AI Backend
 */

const BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:3001';

/**
 * Request evolution signature from AI backend
 * @param {number} tokenId - Token ID to evolve
 * @param {object} signals - Activity signals for evolution scoring
 * @returns {Promise<object>} Evolution data with signature
 */
export async function requestEvolution(tokenId, signals = {}) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/evolution/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenId,
                signals: {
                    transactionCount: signals.transactionCount || 25,
                    stakingDays: signals.stakingDays || 15,
                    tradingVolume: signals.tradingVolume || 500,
                    discordActivity: signals.discordActivity || 5,
                    twitterMentions: signals.twitterMentions || 3
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Evolution request failed');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Evolution request error:', error);
        throw error;
    }
}

/**
 * Check evolution status for a token
 * @param {number} tokenId - Token ID
 * @returns {Promise<object>} Evolution status
 */
export async function checkEvolutionStatus(tokenId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/evolution/status/${tokenId}`);

        if (!response.ok) {
            throw new Error('Failed to check evolution status');
        }

        return await response.json();

    } catch (error) {
        console.error('Status check error:', error);
        throw error;
    }
}

/**
 * Check if token is eligible for evolution
 * @param {number} tokenId - Token ID
 * @param {object} signals - Activity signals
 * @returns {Promise<object>} Eligibility info
 */
export async function checkEligibility(tokenId, signals = {}) {
    try {
        const params = new URLSearchParams(signals);
        const response = await fetch(`${BACKEND_URL}/api/evolution/check/${tokenId}?${params}`);

        if (!response.ok) {
            throw new Error('Failed to check eligibility');
        }

        return await response.json();

    } catch (error) {
        console.error('Eligibility check error:', error);
        throw error;
    }
}

/**
 * Get evolution history for a token
 * @param {number} tokenId - Token ID
 * @returns {Promise<object>} Evolution history
 */
export async function getEvolutionHistory(tokenId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/evolution/history/${tokenId}`);

        if (!response.ok) {
            throw new Error('Failed to get evolution history');
        }

        return await response.json();

    } catch (error) {
        console.error('History fetch error:', error);
        throw error;
    }
}

/**
 * Check backend health
 * @returns {Promise<object>} Health status
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/monitor/health`);

        if (!response.ok) {
            return { status: 'unhealthy', connected: false };
        }

        const data = await response.json();
        return { ...data, connected: true };

    } catch (error) {
        console.error('Backend health check error:', error);
        return { status: 'unhealthy', connected: false, error: error.message };
    }
}

/**
 * Calculate default signals based on NFT data
 * @param {object} nft - NFT data
 * @returns {object} Calculated signals
 */
export function calculateSignals(nft) {
    const signals = {
        transactionCount: 0,
        stakingDays: 0,
        tradingVolume: 0,
        discordActivity: 5,
        twitterMentions: 3
    };

    // Calculate from NFT stats/history if available
    if (nft.stats) {
        // Higher stats = more activity
        const avgStat = Object.values(nft.stats).reduce((a, b) => a + b, 0) / Object.keys(nft.stats).length;
        signals.transactionCount = Math.floor(avgStat * 2);
    }

    if (nft.level) {
        // Higher level = more staking/activity
        signals.stakingDays = nft.level * 5;
        signals.tradingVolume = nft.level * 100;
    }

    return signals;
}
