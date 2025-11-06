import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useMyNFTs } from '../hooks/useContract'
import { ethers } from 'ethers'
import NetworkSwitcher from '../components/NetworkSwitcher'

export default function Profile() {
    const { account, provider, disconnectWallet } = useWeb3()
    const { nfts, loading } = useMyNFTs()
    const [activeTab, setActiveTab] = useState('activity')
    const [currentChainId, setCurrentChainId] = useState(null)
    const [balance, setBalance] = useState('0')

    // Get current chain ID
    useEffect(() => {
        if (provider) {
            provider.getNetwork().then(network => {
                setCurrentChainId(Number(network.chainId))
            }).catch(err => {
                console.error('Error getting network:', err)
            })
        }
    }, [provider])

    // Get wallet balance
    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then(bal => {
                setBalance(ethers.formatEther(bal))
            }).catch(err => {
                console.error('Error getting balance:', err)
            })
        }
    }, [provider, account])

    // Helper functions
    const formatAddress = (addr) => {
        if (!addr) return '0x0000...0000'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getMemberSince = () => {
        if (nfts.length > 0 && nfts[0].lastEvolved) {
            const date = new Date(nfts[0].lastEvolved * 1000)
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }
        return 'Recently'
    }

    // Calculate real stats from NFTs
    const stats = [
        {
            value: loading ? '...' : nfts.length.toString(),
            label: 'NFTs Owned',
            icon: '🎨'
        },
        {
            value: loading ? '...' : nfts.reduce((sum, nft) => {
                const level = nft.level || 1
                return sum + (level * 1000)
            }, 0).toLocaleString(),
            label: 'Total XP',
            icon: '⚡'
        },
        {
            value: loading ? '...' : nfts.length > 0
                ? (nfts.reduce((sum, nft) => sum + (nft.level || 1), 0) / nfts.length).toFixed(1)
                : '0',
            label: 'Avg Level',
            icon: '📊'
        },
        {
            value: parseFloat(balance).toFixed(4),
            label: 'Balance (MATIC)',
            icon: '💰'
        }
    ]

    // Generate activities from NFTs
    const activities = nfts.length > 0 ? nfts.map((nft, index) => {
        const timeAgo = nft.lastEvolved
            ? new Date(nft.lastEvolved * 1000).toLocaleDateString()
            : 'Recently'

        return {
            icon: '🎨',
            text: `Minted ${nft.name || `EvoNFT #${nft.id}`}`,
            time: timeAgo
        }
    }) : [
        { icon: '📦', text: 'No activity yet', time: 'Start by minting your first NFT!' }
    ]

    // Calculate achievements based on real data
    const unlockedAchievements = []
    const lockedAchievements = []

    // First Mint achievement
    if (nfts.length > 0) {
        unlockedAchievements.push({
            icon: '🏆',
            name: 'First Mint',
            date: getMemberSince()
        })
    }

    // Collector achievements
    if (nfts.length >= 5) {
        unlockedAchievements.push({
            icon: '⭐',
            name: 'Collector',
            date: 'Unlocked'
        })
    } else {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Collector',
            desc: 'Own 5 NFTs',
            progress: (nfts.length / 5) * 100
        })
    }

    // Level achievements
    const maxLevel = nfts.length > 0 ? Math.max(...nfts.map(nft => nft.level || 1)) : 0
    if (maxLevel >= 10) {
        unlockedAchievements.push({
            icon: '🎯',
            name: 'Level 10',
            date: 'Unlocked'
        })
    } else {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Level 10',
            desc: 'Reach Level 10',
            progress: (maxLevel / 10) * 100
        })
    }

    // Whale achievement
    lockedAchievements.push({
        icon: '🔒',
        name: 'Whale',
        desc: 'Own 50 NFTs',
        progress: (nfts.length / 50) * 100
    })

    // Legendary achievement
    const hasLegendary = nfts.some(nft => nft.rarity === 'Legendary')
    if (hasLegendary) {
        unlockedAchievements.push({
            icon: '💎',
            name: 'Legendary',
            date: 'Unlocked'
        })
    } else {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Legendary',
            desc: 'Own Legendary NFT',
            progress: 0
        })
    }

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Network Switcher */}
            <NetworkSwitcher
                currentChainId={currentChainId}
                onSwitch={() => window.location.reload()}
            />

            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="glass-strong rounded-2xl border border-slate-700/50 p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-4xl animate-float">
                            {nfts.length > 0 ? '🎮' : '👤'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold mb-1">
                                {account ? `Trainer ${formatAddress(account)}` : 'Not Connected'}
                            </h1>
                            <p className="text-slate-400 font-mono text-sm mb-2">
                                {account || 'Please connect your wallet'}
                            </p>
                            <div className="flex items-center gap-4 justify-center md:justify-start text-sm">
                                <span className="text-slate-400">
                                    Member since: {getMemberSince()}
                                </span>
                                {currentChainId && (
                                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">
                                        Chain ID: {currentChainId}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTab('settings')}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                            >
                                Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                            <div className="text-slate-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-700 mb-6">
                    {['activity', 'achievements', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium transition ${activeTab === tab
                                ? 'text-primary-400 border-b-2 border-primary-400'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                    <div className="space-y-4">
                        {activities.map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-slate-700"
                            >
                                <span className="text-2xl">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="text-slate-200">{activity.text}</p>
                                    <p className="text-sm text-slate-500">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Unlocked ({unlockedAchievements.length})</h2>
                        {unlockedAchievements.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                                {unlockedAchievements.map((achievement, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-strong rounded-xl border border-primary-500/30 p-4 text-center"
                                    >
                                        <div className="text-4xl mb-2">{achievement.icon}</div>
                                        <div className="font-medium text-sm mb-1">{achievement.name}</div>
                                        <div className="text-xs text-slate-500">{achievement.date}</div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 mb-8">
                                <p className="text-slate-400">No achievements unlocked yet. Start minting NFTs!</p>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mb-4">Locked Achievements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {lockedAchievements.map((achievement, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-surface rounded-lg border border-slate-700 p-4"
                                >
                                    <div className="text-4xl mb-2 opacity-50">{achievement.icon}</div>
                                    <div className="font-medium mb-1">{achievement.name}</div>
                                    <div className="text-sm text-slate-400 mb-3">{achievement.desc}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span>{achievement.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-primary-500 h-2 rounded-full"
                                                style={{ width: `${achievement.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-surface rounded-lg border border-slate-700 p-6">
                            <h3 className="font-semibold mb-4">Profile Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Username</label>
                                    <input
                                        type="text"
                                        defaultValue="CryptoTrainer123"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Bio</label>
                                    <textarea
                                        rows="3"
                                        defaultValue="Passionate NFT collector and trainer"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none"
                                    />
                                </div>
                                <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface rounded-lg border border-slate-700 p-6">
                            <h3 className="font-semibold mb-4">Notification Settings</h3>
                            <div className="space-y-3">
                                {[
                                    'NFT Evolution Notifications',
                                    'Breeding Complete Notifications',
                                    'Staking Rewards Available',
                                    'Marketplace Activity'
                                ].map((setting, i) => (
                                    <label key={i} className="flex items-center gap-3">
                                        <input type="checkbox" defaultChecked className="rounded" />
                                        <span className="text-sm">{setting}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Connected Wallet</h3>
                            {account ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">🦊 MetaMask</p>
                                            <p className="text-sm text-slate-400 font-mono">{account}</p>
                                        </div>
                                        <button
                                            onClick={disconnectWallet}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                    <div className="pt-4 border-t border-slate-700">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Balance:</span>
                                            <span className="font-mono">{parseFloat(balance).toFixed(4)} MATIC</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Network:</span>
                                            <span>Polygon Amoy (Chain ID: {currentChainId})</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">NFTs Owned:</span>
                                            <span>{nfts.length}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-400 mb-4">No wallet connected</p>
                                    <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                                        Connect Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
