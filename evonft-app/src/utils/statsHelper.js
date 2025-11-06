/**
 * Helper functions for NFT Stats
 */

/**
 * Extract stats from NFT metadata attributes
 * @param {Array} attributes - NFT attributes array
 * @returns {Object|null} Stats object or null if not found
 */
export function extractStatsFromMetadata(attributes) {
    if (!attributes || !Array.isArray(attributes)) {
        return null;
    }

    const stats = {};
    const statNames = ['Strength', 'Intelligence', 'Speed', 'Endurance', 'Luck'];

    for (const attr of attributes) {
        if (attr.trait_type && statNames.includes(attr.trait_type)) {
            const statKey = attr.trait_type.toLowerCase();
            stats[statKey] = Number(attr.value) || 0;
        }
    }

    // Check if we found all stats
    if (Object.keys(stats).length === 5) {
        return stats;
    }

    return null;
}

/**
 * Merge contract stats with metadata stats
 * Priority: Contract stats if trained (> 5), otherwise metadata stats
 * @param {Object} contractStats - Stats from smart