import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNFT } from '../hooks/useContract'
import { useNFTStats } from '../hooks/useExtendedContract'
import FeedModal from '../components/FeedModal'
import TrainModal from '../components/TrainModal'

export default function NFTDetail() {
    const { id } = useParams()
    const { nft, loading: nftLoading } = useNFT(id)
    const { stats, progress, loading: statsLoading } = useNFTStats(id)
    const [activeTab, setActiveTab] = useState('overview')
    const [showFeedModal, setShowFeedModal] = useState(false)
    const [showTrainModal, setShowTrainModal] = useState(false)

    const loading = nftLoading || statsLoading

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading NFT...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!nft) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold mb-2">NFT Not Found</h3>
                        <p className="text-slate-400 mb-6">This NFT doesn't exist or hasn't been minted yet.</p>
                        <Link
                            to="/my-nfts"
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                        >
                            Back to Collection
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Get level from attributes or progress
    const level = progress?.currentLevel || nft.attributes?.find(a => a.trait_type === 'level')?.value || 1
    const rarity = nft.attributes?.find(a => a.trait_type === 'rarity')?.value || 'common'

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to="/my-nfts" className="text-primary-400 hover:text-primary-300 mb-6 inline-block">
                    ← Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image */}
                    <div>
                        <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full rounded-xl"
                            />
                            <div className="flex gap-2 mt-4 justify-center">
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">⟲</button>
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">📷</button>
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">🔍</button>
                            </div>
                        </div>

                        {/* Evolution Timeline */}
                        <div className="mt-6 glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Evolution Timeline</h3>
                            <div className="flex items-center justify-between">
                                {[1, 5, 10, 20, 'Max'].map((levelMark, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${level >= levelMark ? 'bg-primary-500' : 'bg-slate-700'
                                            }`}></div>
                                        <span className="text-xs mt-1">Lvl {levelMark}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
                                <p className="text-slate-400">Owned by: You</p>
                            </div>

                            {/* Level & XP */}
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold">Level {level}</span>
                                    <span className="text-primary-400 text-lg">⭐⭐⭐ {rarity}</span>
                                </div>

                                {progress && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span>XP: {progress.currentXP} / {progress.xpForNextLevel}</span>
                                            <span>{progress.xpProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all"
                                                style={{ width: `${progress.xpProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowFeedModal(true)}
                                    className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-semibold transition-all hover:scale-105"
                                >
                                    🍖 Feed
                                </button>
                                <button
                                    onClick={() => setShowTrainModal(true)}
                                    className="px-6 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 rounded-xl font-semibold transition-all hover:scale-105"
                                >
                                    💪 Train
                                </button>
                                <button className="px-6 py-4 glass-strong hover:glass rounded-xl font-semibold transition-all hover:scale-105 border border-slate-600 hover:border-primary-500">
                                    🔒 Stake
                                </button>
                                <button className="px-6 py-4 glass-strong hover:glass rounded-xl font-semibold transition-all hover:scale-105 border border-slate-600 hover:border-primary-500">
                                    💰 List
                                </button>
                            </div>

                            {/* Stats */}
                            {stats && (
                                <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                    <h3 className="font-semibold mb-4">Stats & Attributes</h3>
                                    <div className="space-y-4">
                                        {Object.entries(stats).map(([statName, value]) => (
                                            <div key={statName}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="capitalize">{statName}:</span>
                                                    <span className="font-bold">{value}/100</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${value}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Traits */}
                            {nft.traits && nft.traits.length > 0 && (
                                <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                    <h3 className="font-semibold mb-4">Traits Unlocked</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {nft.traits.map((trait, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-2 glass rounded-lg text-2xl hover:scale-110 transition-transform cursor-pointer"
                                                title={`Trait ${i + 1}`}
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evolution Status */}
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <h3 className="font-semibold mb-4">Evolution Status</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Can Evolve:</span>
                                        <span className={nft.canEvolve ? 'text-secondary-500' : 'text-slate-500'}>
                                            {nft.canEvolve ? '✅ Ready' : '⏳ Cooldown'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Version:</span>
                                        <span className="font-semibold">{nft.version}</span>
                                    </div>
                                    {nft.nextEvolveTime && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Next Evolution:</span>
                                            <span className="text-sm">
                                                {new Date(nft.nextEvolveTime * 1000).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
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

                    {activeTab === 'overview' && (
                        <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Description</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {nft.description || 'This EvoNFT is a unique digital companion that grows and evolves based on your interactions. Feed it, train it, and watch it transform into something amazing!'}
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Token ID:</span>
                                    <span className="ml-2 font-mono">{nft.id}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Generation:</span>
                                    <span className="ml-2">1</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Rarity:</span>
                                    <span className="ml-2 capitalize">{rarity}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Level:</span>
                                    <span className="ml-2">{level}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">🎉</span>
                                    <div>
                                        <div className="font-medium">Minted</div>
                                        <div className="text-sm text-slate-400">Genesis creation</div>
                                        <div className="text-xs text-slate-500 mt-1">Just now</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <FeedModal
                isOpen={showFeedModal}
                onClose={() => setShowFeedModal(false)}
                tokenId={id}
                nftName={nft.name}
            />

            <TrainModal
                isOpen={showTrainModal}
                onClose={() => setShowTrainModal(false)}
                tokenId={id}
                nftName={nft.name}
            />
        </div>
    )
}