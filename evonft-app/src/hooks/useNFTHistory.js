import { useState, useEffect } from 'react';
import { useNFTExtended } from './useExtendedContract';

/**
 * Hook to fetch NFT activity history from blockchain events
 */
export function useNFTHistory(tokenId) {
    const { contract } = useNFTExtended();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) {
            console.log('⏸️ useNFTHistory: Waiting for contract or tokenId');
            return;
        }

        async function loadHistory() {
            try {
                console.log(`📜 Loading history for NFT #${tokenId}...`);
                setLoading(true);

                const activities = [];

                // Get Fed events
                try {
                    const fedFilter = contract.filters.Fed(tokenId);
                    const fedEvents = await contract.queryFilter(fedFilter);

                    console.log(`   Found ${fedEvents.length} feed events`);

                    for (const event of fedEvents) {
                        const block = await event.getBlock();
                        const foodTypes = ['Basic Food', 'Premium Food', 'Legendary Food'];

                        activities.push({
                            type: 'feed',
                            icon: '🍖',
                            title: `Fed ${foodTypes[event.args.foodType]}`,
                            description: `Gained ${event.args.xpGained} XP`,
                            xp: Number(event.args.xpGained),
                            totalXP: Number(event.args.totalXP),
                            timestamp: block.timestamp,
                            txHash: event.transactionHash,
                            blockNumber: event.blockNumber
                        });
                    }
                } catch (err) {
                    console.warn('   ⚠️ Could not load feed events:', err.message);
                }

                // Get Trained events
                try {
                    const trainedFilter = contract.filters.Trained(tokenId);
                    const trainedEvents = await contract.queryFilter(trainedFilter);

                    console.log(`   Found ${trainedEvents.length} train events`);

                    for (const event of trainedEvents) {
                        const block = await event.getBlock();
                        const statNames = ['Strength', 'Intelligence', 'Speed', 'Endurance', 'Luck'];

                        activities.push({
                            type: 'train',
                            icon: '💪',
                            title: `Trained ${statNames[event.args.statType]}`,
                            description: `${statNames[event.args.statType]} increased to ${event.args.newValue}`,
                            stat: statNames[event.args.statType],
                            newValue: Number(event.args.newValue),
                            xp: Number(event.args.xpGained),
                            timestamp: block.timestamp,
                            txHash: event.transactionHash,
                            blockNumber: event.blockNumber
                        });
                    }
                } catch (err) {
                    console.warn('   ⚠️ Could not load train events:', err.message);
                }

                // Get LevelUp events
                try {
                    const levelUpFilter = contract.filters.LevelUp(tokenId);
                    const levelUpEvents = await contract.queryFilter(levelUpFilter);

                    console.log(`   Found ${levelUpEvents.length} level up events`);

                    for (const event of levelUpEvents) {
                        const block = await event.getBlock();

                        activities.push({
                            type: 'levelup',
                            icon: '⭐',
                            title: `Level Up!`,
                            description: `Reached Level ${event.args.newLevel}`,
                            level: Number(event.args.newLevel),
                            totalXP: Number(event.args.totalXP),
                            timestamp: block.timestamp,
                            txHash: event.transactionHash,
                            blockNumber: event.blockNumber
                        });
                    }
                } catch (err) {
                    console.warn('   ⚠️ Could not load level up events:', err.message);
                }

                // Sort by timestamp (newest first)
                activities.sort((a, b) => b.timestamp - a.timestamp);

                console.log(`   ✅ Loaded ${activities.length} total activities`);
                setHistory(activities);
                setLoading(false);

            } catch (error) {
                console.error('❌ Error loading history:', error);
                setLoading(false);
            }
        }

        loadHistory();
    }, [contract, tokenId]);

    return { history, loading };
}
