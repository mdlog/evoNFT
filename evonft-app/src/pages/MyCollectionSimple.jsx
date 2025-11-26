import { useState } from 'react'
import { Link } from 'react-router-dom'
import NFTCard from '../components/NFTCard'
import { motion } from 'framer-motion'
import { useMyNFTs } from '../hooks/useContract'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useNFTVisuals } from '../hooks/useNFTVisuals'

export default function MyCollectionSimple() {
    const [activeTab, setActiveTab] = useState('all')
    const { account } = useWeb3()
    const { nfts, loading, error } = useMyNFTs()

    // Generate visual data for NFTs
    const { visualNFTs } = useNFTVisuals(nfts || [])

    // Use visualNFTs if available, otherwise empty array
    const displayNFTs = visualNFTs || []

    // Calculate stats
    const stats = [
        { value: displayNFTs.length, label: 'NFTs Owned', icon: '🎨' },
        {
            value: displayNFTs.length > 0
                ? (displayNFTs.reduce((sum, nft) => sum + (nft.level || 1), 0) / displayNFTs.length).toFixed(1)
                : '0',
            label: 'Avg Level',
            icon: '📊'
        },
        {
            value: displayNFTs.reduce((sum, nft) => {
                const level = nft.level || 1
                return sum + (level * 1000)
            }, 0).toLocaleString(),
            label: 'Total XP',
            icon: '⚡'
        },
        {
            value: (displayNFTs.length * 0.5).toFixed(1),
            label: 'Est Value (MATIC)',
            icon: '💰'
        }
    ]

    if (!account) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-slate-400 mb-6">Please connect your wallet to view your collection</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Collection</h1>

                {/* Portfolio Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                            <div className="text-slate-400">{stat.label}</div>
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

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading your NFTs...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold mb-2">Error Loading NFTs</h3>
                        <p className="text-slate-400 mb-6">{error}</p>
                        <button
                            onClick={() => globalThis.location.reload()}
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* NFT Grid - Simple Version */}
                {!loading && !error && displayNFTs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayNFTs.map((nft) => (
                            <motion.div
                                key={nft.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <NFTCard nft={nft} variant="collection" />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && displayNFTs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                        <p className="text-slate-400 mb-6">Start your collection today!</p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/mint"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg font-semibold transition"
                            >
                                Mint Your First NFT
                            </Link>
                            <Link
                                to="/explore"
                                className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
                            >
                                Explore Marketplace
                            </Link>
                        </div>
                    </div>
                )}

                {/* Breeding Lab CTA */}
                {displayNFTs.length >= 2 && (
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
                )}
            </div>
        </div>
    )
}
