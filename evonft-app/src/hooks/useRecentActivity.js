import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { NFT_CONTRACT } from '../config/contractsExtended'
import { CONTRACT_ABI } from '../config/contracts'

export function useRecentActivity(limit = 10) {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecentActivity() {
            try {
                setLoading(true)

                const provider = new ethers.JsonRpcProvider(
                    import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology'
                )

                const contract = new ethers.Contract(NFT_CONTRACT, CONTRACT_ABI, provider)

                // Get current block
                const currentBlock = await provider.getBlockNumber()
                const fromBlock = Math.max(0, currentBlock - 10000) // Last ~10k blocks

                const activities = []

                // Fetch Transfer events (Mints and Transfers)
                try {
                    const transferFilter = contract.filters.Transfer()
                    const transferEvents = await contract.queryFilter(transferFilter, fromBlock, currentBlock)

                    for (const event of transferEvents.slice(-limit)) {
                        const block = await event.getBlock()
                        const tokenId = event.args.tokenId.toString()
                        const from = event.args.from
                        const to = event.args.to

                        // Check if it's a mint (from zero address)
                        const isMint = from === ethers.ZeroAddress

                        activities.push({
                            type: isMint ? 'mint' : 'transfer',
                            icon: isMint ? '🎨' : '🔄',
                            text: isMint
                                ? `EvoNFT #${tokenId} was minted!`
                                : `EvoNFT #${tokenId} was transferred`,
                            tokenId,
                            from,
                            to,
                            timestamp: block.timestamp,
                            time: getTimeAgo(block.timestamp),
                            color: isMint ? 'from-primary-500/20 to-transparent' : 'from-blue-500/20 to-transparent',
                            txHash: event.transactionHash
                        })
                    }
                } catch (error) {
                    console.error('Error fetching Transfer events:', error)
                }

                // Fetch LevelUp events
                try {
                    const levelUpFilter = contract.filters.LevelUp?.()
                    if (levelUpFilter) {
                        const levelUpEvents = await contract.queryFilter(levelUpFilter, fromBlock, currentBlock)

                        for (const event of levelUpEvents.slice(-limit)) {
                            const block = await event.getBlock()
                            const tokenId = event.args.tokenId.toString()
                            const newLevel = event.args.newLevel.toString()

                            activities.push({
                                type: 'levelup',
                                icon: '📈',
                                text: `EvoNFT #${tokenId} reached Level ${newLevel}!`,
                                tokenId,
                                level: newLevel,
                                timestamp: block.timestamp,
                                time: getTimeAgo(block.timestamp),
                                color: 'from-secondary-500/20 to-transparent',
                                txHash: event.transactionHash
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error fetching LevelUp events:', error)
                }

                // Fetch StatIncreased events (Feed/Train)
                try {
                    const statFilter = contract.filters.StatIncreased?.()
                    if (statFilter) {
                        const statEvents = await contract.queryFilter(statFilter, fromBlock, currentBlock)

                        for (const event of statEvents.slice(-limit)) {
                            const block = await event.getBlock()
                            const tokenId = event.args.tokenId.toString()
                            const statType = event.args.statType

                            const action = statType === 'health' ? 'fed' : 'trained'

                            activities.push({
                                type: 'stat',
                                icon: statType === 'health' ? '🍖' : '💪',
                                text: `EvoNFT #${tokenId} was ${action}`,
                                tokenId,
                                statType,
                                timestamp: block.timestamp,
                                time: getTimeAgo(block.timestamp),
                                color: 'from-accent-500/20 to-transparent',
                                txHash: event.transactionHash
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error fetching StatIncreased events:', error)
                }

                // Sort by timestamp (newest first) and limit
                activities.sort((a, b) => b.timestamp - a.timestamp)
                setActivities(activities.slice(0, limit))

            } catch (error) {
                console.error('Error fetching recent activity:', error)
                // Set fallback mock data
                setActivities(getMockActivities())
            } finally {
                setLoading(false)
            }
        }

        fetchRecentActivity()

        // Refresh every 30 seconds
        const interval = setInterval(fetchRecentActivity, 30000)
        return () => clearInterval(interval)
    }, [limit])

    return { activities, loading }
}

function getTimeAgo(timestamp) {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
}

function getMockActivities() {
    return [
        {
            icon: '🎨',
            text: 'EvoNFT #1234 was minted!',
            time: '2 min ago',
            color: 'from-primary-500/20 to-transparent',
            type: 'mint'
        },
        {
            icon: '📈',
            text: 'EvoNFT #5678 reached Level 10!',
            time: '15 min ago',
            color: 'from-secondary-500/20 to-transparent',
            type: 'levelup'
        },
        {
            icon: '💪',
            text: 'EvoNFT #9012 was trained',
            time: '1 hour ago',
            color: 'from-accent-500/20 to-transparent',
            type: 'stat'
        }
    ]
}
