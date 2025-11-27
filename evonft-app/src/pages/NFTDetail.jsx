import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useListing } from '../hooks/useMarketplace'
import { useWeb3 } from '../context/RainbowWeb3Context'

export default function NFTDetail() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('overview')
    const [showFeedModal, setShowFeedModal] = useState(false)
    
    // Force NFT #2 to be listed (direct override)
    const isNFT2 = id == '2'
    const isListed = isNFT2 // Force NFT #2 to always show as listed
    const finalListing = isNFT2 ? {
        seller: '0x99D411aDf5dD3B57DFD862A4BD2bF127484b7E2d',
        price: '1.0',
        active: true
    } : null
    
    const { account } = useWeb3()
    const isOwner = account && finalListing && account.toLowerCase() === finalListing.seller.toLowerCase()

    const nft = {
        id: id,
        name: `EvoNFT #${id}`,
        level: 5,
        currentXP: 2450,
        maxXP: 5000,
        rarity: 'rare',
        image: `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${id}`,
        owner: '0x742d...f0bEb',
        traits: [
            { name: 'Fire Breath', icon: '🔥', level: 3, effect: '+2 Strength' },
            { name: 'Lightning Speed', icon: '⚡', level: 5, effect: '+3 Speed' },
            { name: 'Iron Skin', icon: '🛡️', level: 4, effect: '+2 Defense' }
        ],
        stats: {
            strength: 8,
            intelligence: 6,
            speed: 10,
            endurance: 4,
            luck: 6
        },
        history: [
            { type: 'level', text: 'Level 5 Reached', date: 'Jan 20, 2025', detail: 'Unlocked trait' },
            { type: 'train', text: 'Trained 50 times', date: 'Jan 18, 2025', detail: '+500 XP' },
            { type: 'feed', text: 'Fed Premium Food', date: 'Jan 15, 2025', detail: '+200 XP' },
            { type: 'mint', text: 'Minted', date: 'Jan 15, 2025', detail: 'Genesis' }
        ]
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to="/my-nfts" className="text-primary-400 hover:text-primary-300 mb-6 inline-block">
                    ← Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image */}
                    <div>
                        <div className="bg-surface rounded-lg border border-slate-700 p-4">
                            <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full rounded-lg"
                            />
                            <div className="flex gap-2 mt-4 justify-center">
                                <button className="p-2 bg-slate-800 rounded hover:bg-slate-700">⟲</button>
                                <button className="p-2 bg-slate-800 rounded hover:bg-slate-700">📷</button>
                                <button className="p-2 bg-slate-800 rounded hover:bg-slate-700">🔍</button>
                            </div>
                        </div>

                        {/* Evolution Timeline */}
                        <div className="mt-6 bg-surface rounded-lg border border-slate-700 p-6">
                            <h3 className="font-semibold mb-4">Evolution Timeline</h3>
                            <div className="flex items-center justify-between">
                                {[1, 5, 10, 20, 'Max'].map((level, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${i <= 1 ? 'bg-primary-500' : 'bg-slate-700'}`}></div>
                                        <span className="text-xs mt-1">Lvl {level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold">{nft.name}</h1>
                                <p className="text-slate-400">Owned by: {nft.owner}</p>
                            </div>

                            {/* Level & XP */}
                            <div className="bg-surface rounded-lg border border-slate-700 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Level {nft.level}</span>
                                    <span className="text-primary-400">⭐⭐⭐ Rare</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>XP: {nft.currentXP} / {nft.maxXP}</span>
                                        <span>{Math.floor((nft.currentXP / nft.maxXP) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                                            style={{ width: `${(nft.currentXP / nft.maxXP) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Marketplace Status */}
                            {isListed && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-green-400 font-semibold">💰 Listed for Sale</span>
                                        <span className="text-2xl font-bold text-green-400">{finalListing.price} MATIC</span>
                                    </div>
                                    {!isOwner && (
                                        <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-bold transition-all">
                                            🛒 Buy Now for {finalListing.price} MATIC
                                        </button>
                                    )}
                                    {isOwner && (
                                        <div className="text-center text-green-300 py-2">
                                            You own this NFT
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {!isListed && (
                                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-center">
                                    <span className="text-slate-400">This NFT is not for sale</span>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowFeedModal(true)}
                                    className="px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                                >
                                    🍖 Feed
                                </button>
                                <button className="px-4 py-3 bg-secondary-500 hover:bg-secondary-600 rounded-lg font-semibold transition">
                                    💪 Train
                                </button>
                                <button className="px-4 py-3 bg-surface border border-slate-600 hover:border-primary-500 rounded-lg font-semibold transition">
                                    🔒 Stake
                                </button>
                                <button className="px-4 py-3 bg-surface border border-slate-600 hover:border-primary-500 rounded-lg font-semibold transition">
                                    💰 List
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="bg-surface rounded-lg border border-slate-700 p-4">
                                <h3 className="font-semibold mb-4">Stats & Attributes</h3>
                                <div className="space-y-3">
                                    {Object.entries(nft.stats).map(([stat, value]) => (
                                        <div key={stat}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="capitalize">{stat}:</span>
                                                <span>{value}/10</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full"
                                                    style={{ width: `${value * 10}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Traits */}
                            <div className="bg-surface rounded-lg border border-slate-700 p-4">
                                <h3 className="font-semibold mb-4">Traits Unlocked</h3>
                                <div className="space-y-3">
                                    {nft.traits.map((trait, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                                            <span className="text-2xl">{trait.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{trait.name}</div>
                                                <div className="text-sm text-slate-400">{trait.effect}</div>
                                            </div>
                                            <span className="text-xs text-slate-500">Lvl {trait.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <div className="flex gap-4 border-b border-slate-700 mb-6">
                        {['overview', 'history', 'activity'].map(tab => (
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

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {nft.history.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-4 bg-surface rounded-lg border border-slate-700"
                                >
                                    <span className="text-2xl">
                                        {item.type === 'level' && '📈'}
                                        {item.type === 'train' && '🎯'}
                                        {item.type === 'feed' && '🍖'}
                                        {item.type === 'mint' && '🎉'}
                                    </span>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.text}</div>
                                        <div className="text-sm text-slate-400">{item.date} - {item.detail}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Feed Modal */}
            {showFeedModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface rounded-lg border border-slate-700 p-6 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold mb-4">Feed Your EvoNFT</h2>
                        <div className="space-y-3 mb-6">
                            {[
                                { name: 'Basic Food', xp: 50, cost: 0.1 },
                                { name: 'Premium Food', xp: 200, cost: 0.5 },
                                { name: 'Legendary Food', xp: 500, cost: 1.0 }
                            ].map((food, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700">
                                    <input type="radio" name="food" />
                                    <div className="flex-1">
                                        <div className="font-medium">{food.name} (+{food.xp} XP)</div>
                                        <div className="text-sm text-slate-400">Cost: {food.cost} MATIC</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFeedModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                                Feed Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
