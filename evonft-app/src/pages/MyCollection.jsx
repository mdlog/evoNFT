import { useState } from 'react'
import { Link } from 'react-router-dom'
import NFTCard from '../components/NFTCard'
import { motion } from 'framer-motion'

export default function MyCollection() {
    const [activeTab, setActiveTab] = useState('all')

    const mockNFTs = [
        { id: 1, name: 'EvoNFT #1234', level: 5, rarity: 'rare', price: 2.5, image: 'https://via.placeholder.com/300/8B5CF6/FFFFFF?text=NFT+1234', currentXP: 2450, maxXP: 5000, traits: ['🔥', '⚡', '🛡️'], status: 'owned' },
        { id: 2, name: 'EvoNFT #5678', level: 12, rarity: 'epic', price: 8.9, image: 'https://via.placeholder.com/300/10B981/FFFFFF?text=NFT+5678', currentXP: 3500, maxXP: 10000, traits: ['💧', '🌟', '🗡️'], status: 'staked' },
        { id: 3, name: 'EvoNFT #9012', level: 3, rarity: 'uncommon', price: 1.2, image: 'https://via.placeholder.com/300/F59E0B/FFFFFF?text=NFT+9012', currentXP: 800, maxXP: 1000, traits: ['🌍', '💪'], status: 'owned' },
    ]

    const stats = [
        { value: mockNFTs.length, label: 'NFTs Owned' },
        { value: '8.5', label: 'Avg Level' },
        { value: '12,450', label: 'Total XP' },
        { value: '28.5', label: 'Est Value (MATIC)' }
    ]

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Collection</h1>

                {/* Portfolio Overview */}
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
                <div className="flex gap-4 mb-6 border-b border-slate-700">
                    {['all', 'staked', 'listed', 'breeding'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium transition ${activeTab === tab
                                    ? 'text-primary-400 border-b-2 border-primary-400'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} NFTs
                        </button>
                    ))}
                </div>

                {/* View Options */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-500 rounded-lg">
                            Grid 🔲
                        </button>
                        <button className="px-4 py-2 bg-surface border border-slate-700 rounded-lg hover:border-slate-600">
                            List ☰
                        </button>
                    </div>
                    <select className="px-4 py-2 bg-surface border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none">
                        <option>Level: High to Low</option>
                        <option>Level: Low to High</option>
                        <option>Recently Acquired</option>
                        <option>XP Progress</option>
                    </select>
                </div>

                {/* NFT Grid */}
                {mockNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockNFTs.map((nft, i) => (
                            <motion.div
                                key={nft.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <NFTCard nft={nft} variant="collection" />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                        <p className="text-slate-400 mb-6">Start your collection today!</p>
                        <Link
                            to="/explore"
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                )}

                {/* Breeding Lab CTA */}
                <div className="mt-12 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg border border-primary-500/30 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">🧬 Breeding Lab</h3>
                            <p className="text-slate-300">
                                Create new generation EvoNFTs by breeding two compatible NFTs from your collection
                            </p>
                        </div>
                        <Link
                            to="/breeding"
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition whitespace-nowrap"
                        >
                            Go to Lab →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
