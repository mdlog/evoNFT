import { motion } from 'framer-motion'

export default function Staking() {
    const poolStats = [
        { value: '5,432', label: 'Total Staked' },
        { value: '2,156', label: 'Unique Stakers' },
        { value: '50 XP', label: 'Daily Base Rate' },
        { value: '125%', label: 'Current APY' }
    ]

    const userStats = [
        { value: '3', label: 'NFTs Staked' },
        { value: '150 XP', label: 'Per Day' },
        { value: '450 XP', label: 'Earned' },
        { value: '0.15', label: 'Rewards (MATIC)' }
    ]

    const stakedNFTs = [
        { id: 1, name: 'EvoNFT #1234', level: 12, image: 'https://via.placeholder.com/100/8B5CF6/FFFFFF?text=1234', stakedDays: 15, earning: 50, rewards: { xp: 750, matic: 0.05 } },
        { id: 2, name: 'EvoNFT #5678', level: 25, image: 'https://via.placeholder.com/100/10B981/FFFFFF?text=5678', stakedDays: 30, earning: 75, rewards: { xp: 2250, matic: 0.15 } },
    ]

    const tiers = [
        { name: 'Bronze', days: '1-7', rate: '50 XP/day', icon: '🥉' },
        { name: 'Silver', days: '8-30', rate: '60 XP/day (+20%)', icon: '🥈' },
        { name: 'Gold', days: '31-90', rate: '75 XP/day (+50%)', icon: '🥇' },
        { name: 'Diamond', days: '90+', rate: '100 XP/day (+100%)', icon: '💎' }
    ]

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">🔒 Staking Pool</h1>
                <p className="text-slate-400 mb-8">Stake your EvoNFTs to earn passive XP and rewards</p>

                {/* Pool Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {poolStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface rounded-lg border border-slate-700 p-6 text-center"
                        >
                            <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* User Staking Summary */}
                <div className="bg-surface rounded-lg border border-slate-700 p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Staking Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {userStats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-secondary-500">{stat.value}</div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-secondary-500 hover:bg-secondary-600 rounded-lg font-semibold transition">
                        Claim All Rewards
                    </button>
                </div>

                {/* Staked NFTs */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Staked NFTs</h2>
                        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                            Stake New
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stakedNFTs.map((nft, i) => (
                            <motion.div
                                key={nft.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface rounded-lg border border-slate-700 p-6"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <img
                                        src={nft.image}
                                        alt={nft.name}
                                        className="w-24 h-24 rounded-lg"
                                    />

                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{nft.name}</h3>
                                            <p className="text-slate-400 text-sm">Level {nft.level}</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <div className="text-slate-400">Staked</div>
                                                <div className="font-semibold">{nft.stakedDays} days ago</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400">Earning</div>
                                                <div className="font-semibold text-secondary-500">{nft.earning} XP/day</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400">XP Rewards</div>
                                                <div className="font-semibold">{nft.rewards.xp} XP</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-400">MATIC Rewards</div>
                                                <div className="font-semibold">{nft.rewards.matic} MATIC</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 rounded-lg text-sm font-semibold transition">
                                                Claim
                                            </button>
                                            <button className="px-4 py-2 bg-surface border border-slate-600 hover:border-slate-500 rounded-lg text-sm transition">
                                                Unstake
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Staking Tiers */}
                <div className="bg-surface rounded-lg border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold mb-6">Staking Tiers & Bonuses</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-800 rounded-lg p-4 text-center"
                            >
                                <div className="text-4xl mb-2">{tier.icon}</div>
                                <div className="font-semibold mb-1">{tier.name}</div>
                                <div className="text-sm text-slate-400 mb-2">{tier.days} days</div>
                                <div className="text-sm text-secondary-500">{tier.rate}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Additional Bonuses:</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Stake 5+ NFTs: +10% XP</li>
                            <li>• Stake Rare/Epic: +25% XP</li>
                            <li>• Stake Legendary: +50% XP</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
