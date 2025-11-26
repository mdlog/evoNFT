import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMyNFTs } from '../hooks/useContract'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useNFTVisuals } from '../hooks/useNFTVisuals'
import { useNFTStats } from '../hooks/useExtendedContract'
import { useMyListings } from '../hooks/useMyListings'
import { NFTGallery } from '../components/NFTGallery'
import NFTCard from '../components/NFTCard'
import NetworkSwitcher from '../components/NetworkSwitcher'
import { NFTVisual } from '../components/NFTVisual'
import ListingBadge from '../components/ListingBadge'
import { rarityLevels } from '../assets/nft-visuals'

// NFT Card with Stats Component
function NFTCardWithStats({ nft }) {
    const { stats, progress } = useNFTStats(nft.id)
    const [showStats, setShowStats] = useState(false)

    // Normalize rarity
    let rarity = nft.rarity || 'common'
    const validRarities = ['common', 'rare', 'epic', 'legendary']
    if (!validRarities.includes(rarity)) {
        const rarityMap = {
            'uncommon': 'rare',
            'normal': 'common',
            'mythic': 'legendary',
            'mythical': 'legendary'
        }
        rarity = rarityMap[rarity] || 'common'
    }

    const rarityData = rarityLevels[rarity] || rarityLevels.common
    const level = progress?.currentLevel || nft.level || 1

    const rarityColors = {
        common: 'from-slate-400 to-slate-500',
        rare: 'from-blue-500 to-blue-600',
        epic: 'from-primary-500 to-primary-600',
        legendary: 'from-accent-500 to-accent-600'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl overflow-hidden border border-slate-700/50 hover:border-primary-500/50 transition-all"
        >
            {/* NFT Visual */}
            <Link to={`/nft/${nft.id}`}>
                <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center group cursor-pointer">
                    <NFTVisual
                        tokenId={nft.id}
                        level={level}
                        creatureType={nft.creatureType}
                        rarity={rarity}
                        size={280}
                        showLevel={false}
                        showRarity={false}
                        animated={true}
                        className="group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                        <div className={`px-3 py-1.5 bg-gradient-to-r ${rarityColors[rarity]} rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
                            LVL {level}
                        </div>
                    </div>

                    {/* Rarity Badge */}
                    <div className="absolute top-3 left-3">
                        <div
                            className="px-3 py-1.5 glass-strong rounded-full text-xs font-semibold"
                            style={{ backgroundColor: rarityData.color + '20', color: rarityData.color }}
                        >
                            {rarityData.name}
                        </div>
                    </div>

                    {/* For Sale Badge */}
                    <div className="absolute bottom-3 right-3">
                        <ListingBadge tokenId={nft.id} variant="compact" />
                    </div>

                    {/* Hover View Details */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-6 py-3 glass-strong rounded-xl font-semibold border border-white/20">
                            View Details →
                        </div>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Name & Info */}
                <div>
                    <h3 className="font-bold text-lg mb-1">
                        {nft.name || `EvoNFT #${nft.id}`}
                    </h3>
                    {nft.creatureType && (
                        <p className="text-sm text-slate-400">
                            {nft.creatureType}
                        </p>
                    )}
                </div>

                {/* XP Progress */}
                {progress && (
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>XP Progress</span>
                            <span className="font-semibold">{progress.xpProgress}%</span>
                        </div>
                        <div className="relative w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rarityColors[rarity]} rounded-full transition-all duration-500`}
                                style={{ width: `${progress.xpProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{progress.currentXP} XP</span>
                            <span>{progress.xpForNextLevel} XP</span>
                        </div>
                    </div>
                )}

                {/* Toggle Stats Button */}
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="w-full px-4 py-2 glass hover:glass-strong rounded-lg text-sm font-medium transition-all flex items-center justify-between"
                >
                    <span>{showStats ? '📊 Hide Stats' : '📊 Show Stats'}</span>
                    <span className="text-xs">{showStats ? '▲' : '▼'}</span>
                </button>

                {/* Stats & Attributes - Collapsible */}
                {showStats && stats && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 border-t border-slate-700/50"
                    >
                        <h4 className="text-sm font-semibold text-slate-300">Stats & Attributes</h4>
                        {Object.entries(stats).map(([statName, value]) => (
                            <div key={statName}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="capitalize text-slate-400">{statName}:</span>
                                    <span className="font-bold text-white">{value}/100</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5">
                                    <div
                                        className={`bg-gradient-to-r ${rarityColors[rarity]} h-1.5 rounded-full transition-all`}
                                        style={{ width: `${value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Traits */}
                {nft.traits && nft.traits.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Traits</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {nft.traits.slice(0, 6).map((trait, i) => {
                                const traitDisplay = typeof trait === 'string' ? trait : trait.value || trait.trait_type
                                return (
                                    <span
                                        key={`trait-${nft.id}-${i}`}
                                        className="text-xl hover:scale-125 transition-transform cursor-pointer"
                                        title={typeof trait === 'object' ? `${trait.trait_type}: ${trait.value}` : trait}
                                    >
                                        {traitDisplay}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                        to={`/nft/${nft.id}`}
                        className="px-3 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-xs font-semibold text-center transition-all"
                    >
                        View Details
                    </Link>
                    <button className="px-3 py-2 glass hover:glass-strong rounded-lg text-xs font-semibold transition-all">
                        Quick Actions
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default function MyCollection() {
    const [activeTab, setActiveTab] = useState('all')
    const [viewMode, setViewMode] = useState('gallery') // 'gallery' or 'detailed'
    const [currentChainId, setCurrentChainId] = useState(null)
    const { account, provider } = useWeb3()
    const { nfts, loading, error } = useMyNFTs()

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

    // Generate visual data for NFTs only if we have NFTs
    const { visualNFTs, loading: visualLoading } = useNFTVisuals(nfts || [])

    // Use visualNFTs if available, otherwise use empty array
    const displayNFTs = visualNFTs && visualNFTs.length > 0 ? visualNFTs : []

    // Get listings data
    const { listedCount, isListed } = useMyListings(displayNFTs)

    // Debug logging
    useEffect(() => {
        console.log('MyCollection Debug:', {
            account,
            nftsCount: nfts?.length || 0,
            visualNFTsCount: visualNFTs?.length || 0,
            loading,
            visualLoading,
            error
        })
    }, [account, nfts, visualNFTs, loading, visualLoading, error])

    // Calculate stats from NFTs
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
            value: listedCount || 0,
            label: 'For Sale',
            icon: '💰'
        }
    ]

    // Get listing data for all NFTs
    const [listingsData, setListingsData] = useState({})

    useEffect(() => {
        // Fetch listing status for all NFTs
        const fetchListings = async () => {
            if (!displayNFTs || displayNFTs.length === 0) return

            const { useMarketplace } = await import('../hooks/useMarketplace')
            // This will be handled by individual ListingBadge components
        }
        fetchListings()
    }, [displayNFTs])

    // Filter NFTs based on active tab
    const filteredNFTs = displayNFTs.filter((nft) => {
        if (activeTab === 'all') return true
        if (activeTab === 'listed') return isListed(nft.id)
        return true
    })

    // Check if we're still loading
    const isLoading = loading || visualLoading

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
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Network Switcher */}
            <NetworkSwitcher
                currentChainId={currentChainId}
                onSwitch={() => window.location.reload()}
            />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Collection</h1>

                {/* Portfolio Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stats.indexOf(stat) * 0.1 }}
                            className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                            <div className="text-slate-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs & View Mode */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-700">
                    {/* Tabs */}
                    <div className="flex gap-4">
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

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('gallery')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'gallery'
                                ? 'bg-primary-500 text-white'
                                : 'glass hover:glass-strong text-slate-300'
                                }`}
                        >
                            🖼️ Gallery
                        </button>
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'detailed'
                                ? 'bg-primary-500 text-white'
                                : 'glass hover:glass-strong text-slate-300'
                                }`}
                        >
                            📊 Detailed
                        </button>
                    </div>
                </div>



                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading your NFTs...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold mb-2">Error Loading NFTs</h3>
                        <div className="max-w-2xl mx-auto mb-6">
                            <p className="text-slate-300 mb-4 whitespace-pre-line">{error}</p>

                            {/* Network Check */}
                            {currentChainId && currentChainId !== 80002 && (
                                <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg mb-4">
                                    <p className="text-yellow-200 text-sm">
                                        <strong>⚠️ Wrong Network Detected</strong>
                                    </p>
                                    <p className="text-yellow-200 text-xs mt-2">
                                        Current: Chain ID {currentChainId}<br />
                                        Required: Polygon Amoy (Chain ID 80002)
                                    </p>
                                </div>
                            )}

                            {/* Troubleshooting Tips */}
                            <div className="p-4 bg-slate-800/50 rounded-lg text-left text-sm text-slate-300">
                                <p className="font-semibold mb-2">Troubleshooting:</p>
                                <ul className="space-y-1 ml-4">
                                    <li>• Switch to Polygon Amoy network in MetaMask</li>
                                    <li>• Check if RPC endpoint is working</li>
                                    <li>• Try refreshing the page</li>
                                    <li>• Clear browser cache and reload</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => globalThis.location.reload()}
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                            >
                                Retry
                            </button>
                            {currentChainId && currentChainId !== 80002 && (
                                <button
                                    onClick={async () => {
                                        try {
                                            await window.ethereum.request({
                                                method: 'wallet_switchEthereumChain',
                                                params: [{ chainId: '0x13882' }], // 80002 in hex
                                            });
                                        } catch (switchError) {
                                            console.error('Network switch error:', switchError);
                                        }
                                    }}
                                    className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 rounded-lg font-semibold transition"
                                >
                                    Switch to Polygon Amoy
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* NFT Display */}
                {!isLoading && !error && filteredNFTs.length > 0 && (
                    <>
                        <div className="mb-4 text-sm text-slate-400">
                            Showing {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''}
                        </div>

                        {/* Gallery View */}
                        {viewMode === 'gallery' && (
                            <NFTGallery
                                nfts={filteredNFTs}
                                showFilters={true}
                                onSelectNFT={(nft) => {
                                    globalThis.location.href = `/nft/${nft.id}`
                                }}
                            />
                        )}

                        {/* Detailed View with Stats */}
                        {viewMode === 'detailed' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredNFTs.map((nft) => (
                                    <NFTCardWithStats key={nft.id} nft={nft} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredNFTs.length === 0 && (
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
                {filteredNFTs.length >= 2 && (
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
