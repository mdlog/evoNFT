import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWeb3 } from '../context/Web3Context'

export default function Profile() {
    const { account } = useWeb3()
    const [activeTab, setActiveTab] = useState('activity')

    const stats = [
        { value: '12', label: 'NFTs Owned' },
        { value: '45,230', label: 'Total XP' },
        { value: '8', label: 'Avg Level' },
        { value: '28.5', label: 'Portfolio (MATIC)' }
    ]

    const activities = [
        { icon: '🎉', text: 'EvoNFT #1234 reached Level 10', time: '2 hours ago' },
        { icon: '💰', text: 'Sold EvoNFT #5678 for 8.9 MATIC', time: '5 hours ago' },
        { icon: '🍖', text: 'Fed EvoNFT #9012 Premium Food', time: '1 day ago' },
        { icon: '🔒', text: 'Staked EvoNFT #3456', time: '2 days ago' },
        { icon: '🧬', text: 'Bred EvoNFT #7890 + #2345 → #12345', time: '3 days ago' },
    ]

    const achievements = [
        { icon: '🏆', name: 'First Mint', unlocked: true, date: 'Jan 15, 2025' },
        { icon: '🎯', name: 'Level 10', unlocked: true, date: 'Jan 20, 2025' },
        { icon: '⭐', name: 'Collector', unlocked: true, date: 'Jan 18, 2025' },
        { icon: '🧬', name: 'First Breed', unlocked: true, date: 'Jan 22, 2025' },
        { icon: '💎', name: 'Staking Pro', unlocked: true, date: 'Jan 25, 2025' },
        { icon: '🔥', name: 'Trait Master', unlocked: true, date: 'Jan 28, 2025' },
    ]

    const lockedAchievements = [
        { icon: '🔒', name: 'Level 50', desc: 'Reach Level 50', progress: 20 },
        { icon: '🔒', name: 'Legendary', desc: 'Own Legendary NFT', progress: 0 },
        { icon: '🔒', name: 'Whale', desc: 'Own 50 NFTs', progress: 24 },
    ]

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-surface rounded-lg border border-slate-700 p-6 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-4xl">
                            👤
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">CryptoTrainer123</h1>
                            <p className="text-slate-400 font-mono text-sm mb-2">
                                {account || '0x742d...f0bEb'}
                            </p>
                            <p className="text-slate-400 text-sm">Member since: Jan 2025</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition">
                                Edit Profile
                            </button>
                            <button className="px-4 py-2 bg-surface border border-slate-600 hover:border-slate-500 rounded-lg transition">
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
                            className="bg-surface rounded-lg border border-slate-700 p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-primary-400">{stat.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
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
                        <h2 className="text-xl font-semibold mb-4">Unlocked ({achievements.length}/50)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {achievements.map((achievement, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-surface rounded-lg border border-slate-700 p-4 text-center"
                                >
                                    <div className="text-4xl mb-2">{achievement.icon}</div>
                                    <div className="font-medium text-sm mb-1">{achievement.name}</div>
                                    <div className="text-xs text-slate-500">{achievement.date}</div>
                                </motion.div>
                            ))}
                        </div>

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

                        <div className="bg-surface rounded-lg border border-slate-700 p-6">
                            <h3 className="font-semibold mb-4">Connected Wallet</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">🦊 MetaMask</p>
                                    <p className="text-sm text-slate-400 font-mono">{account || '0x742d...f0bEb'}</p>
                                </div>
                                <button className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
