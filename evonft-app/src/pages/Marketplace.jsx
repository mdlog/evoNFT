import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { NFTVisual } from '../components/NFTVisual'
import { useAllNFTsFast } from '../hooks/useAllNFTsFast'
import { useNFTVisuals, useNFTVisual } from '../hooks/useNFTVisuals'
import { useListings, useMarketplace, useListing } from '../hooks/useMarketplace'
import { useWeb3 } from '../context/RainbowWeb3Context'
import BuyNFTModal from '../components/BuyNFTModal'
import { rarityLevels } from '../assets/nft-visuals'

// Component wrapper for BuyNFTModal with listing data
function BuyNFTModalWithListing({ isOpen, onClose, nft, onSuccess }) {
    const { listing } = useListing(nft?.id);
    
    return (
        <BuyNFTModal
            isOpen={isOpen}
            onClose={onClose}
            nft={nft}
            listing={listing}
            onSuccess={onSuccess}
        />
    );
}

// NFT Card with listing badge
function NFTCardWithListing({ nft, listedTokenIds, listings, onSelect, currentAccount }) {
    const visualData = useNFTVisual(nft)
    const displayNFT = visualData || nft

    // Get listing data from activeListings array (already loaded)
    const nftIdNum = Number(nft.id)
    const listing = listings.find(l => {
        const listingIdNum = Number(l.tokenId)
        return listingIdNum === nftIdNum
    })

    // Check if listed - use listing existence as source of truth
    const isListed = !!listing && listing.active !== false
    
    // Check if listed
    const finalIsListed = isListed
    const finalListing = listing

    // Get owner address and check if current user is owner
    const ownerAddress = displayNFT.owner || nft.owner
    const isCurrentUserOwner = currentAccount && ownerAddress && 
        currentAccount.toLowerCase() === ownerAddress.toLowerCase()

    // Debug logging for NFT #2
    if (nft.id == 2) {
        console.log(`🔍 DEBUG NFT #${nft.id}:`, {
            nftId: nft.id,
            nftIdNum,
            isListed,
            hasListing: !!listing,
            listingPrice: listing?.price,
            listingActive: listing?.active,
            ownerAddress,
            currentAccount,
            isCurrentUserOwner,
            allListings: listings,
            allListingIds: listings.map(l => Number(l.tokenId))
        });
    }

    // Normalize rarity
    let rarity = displayNFT.rarity || 'common'
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

    const rarityColors = {
        common: 'from-slate-400 to-slate-500',
        rare: 'from-blue-500 to-blue-600',
        epic: 'from-primary-500 to-primary-600',
        legendary: 'from-accent-500 to-accent-600'
    }

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Link to={`/nft/${nft.id}`}>
                <div className="glass rounded-2xl overflow-hidden hover:glass-strong transition-all duration-300 hover:shadow-2xl border border-slate-700/50 hover:border-primary-500/50">
                    {/* NFT Visual Container */}
                    <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
                        {displayNFT.image ? (
                            <img
                                src={displayNFT.image}
                                alt={displayNFT.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    console.error('Image load error for NFT #' + nft.id);
                                    // Fallback to NFTVisual component
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <NFTVisual
                                tokenId={displayNFT.id || displayNFT.tokenId}
                                level={displayNFT.level || 1}
                                creatureType={displayNFT.creatureType}
                                rarity={rarity}
                                size={280}
                                showLevel={false}
                                showRarity={false}
                                animated={true}
                                className="group-hover:scale-110 transition-transform duration-500"
                            />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>



                        {/* Level Badge */}
                        <div className="absolute top-3 right-3">
                            <div className={`px-3 py-1.5 bg-gradient-to-r ${rarityColors[rarity]} rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
                                LVL {displayNFT.level || 1}
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

                        {/* Hover Quick View */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="px-6 py-3 glass-strong rounded-xl font-semibold border border-white/20 hover:scale-110 transition-transform">
                                {isListed ? '🛒 View & Buy' : '👁️ View Details'}
                            </div>
                        </div>
                    </div>



                    {/* Content */}
                    <div className="p-5 space-y-3">
                        <div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-gradient transition-all">
                                {displayNFT.name || `EvoNFT #${displayNFT.id || displayNFT.tokenId}`}
                            </h3>
                            {displayNFT.creatureType && (
                                <p className="text-sm text-slate-400">
                                    {displayNFT.creatureType}
                                </p>
                            )}
                        </div>

                        {/* Owner Info */}
                        {ownerAddress && (
                            <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-700/30">
                                <span className="text-slate-500">Owner:</span>
                                <span className="font-mono text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                                    {ownerAddress.slice(0, 6)}...{ownerAddress.slice(-4)}
                                </span>
                            </div>
                        )}

                        {/* Listing Status */}
                        <div className="pt-2 border-t border-slate-700/50">
                            {finalIsListed && finalListing ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Price:</span>
                                        <span className="text-lg font-bold text-primary-400">
                                            {finalListing.price} MATIC
                                        </span>
                                    </div>
                                    {isCurrentUserOwner ? (
                                        <div className="text-center text-sm text-slate-400 py-2">
                                            💼 You own this NFT
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onSelect();
                                            }}
                                            className="w-full px-4 py-2.5 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 rounded-lg font-bold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <span className="text-lg">🛒</span>
                                            <span>Buy Now</span>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-slate-500 py-2">
                                    Not for sale
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [selectedNFT, setSelectedNFT] = useState(null)
    const [filterType, setFilterType] = useState('all') // 'all', 'listed', 'not-listed' - default to 'all' to show everything

    // Get current user account
    const { account } = useWeb3()

    // Get all NFTs from blockchain (fast mode)
    const { nfts: rawNFTs, loading: nftsLoading } = useAllNFTsFast()

    // Get marketplace data
    const { listings: activeListings, loading: listingsLoading } = useListings()
    const { stats: marketplaceStats } = useMarketplace()

    // Generate visuals for NFTs
    const { visualNFTs, loading: visualsLoading } = useNFTVisuals(rawNFTs)

    const loading = nftsLoading || visualsLoading || listingsLoading

    // Debug: Log marketplace data
    console.log('📊 Marketplace Debug:', {
        totalNFTs: rawNFTs.length,
        nftsLoading,
        visualsLoading,
        listingsLoading,
        loading,
        activeListings: activeListings.length,
        listings: activeListings,
        listingTokenIds: activeListings.map(l => l.tokenId),
        visualNFTs: visualNFTs.length
    })

    // Get listed token IDs as Set for faster lookup
    const listedTokenIds = useMemo(() => {
        const tokenIds = activeListings.map(l => l.tokenId);
        console.log('🔢 Listed Token IDs:', tokenIds);
        return new Set(tokenIds);
    }, [activeListings])

    // Filter NFTs based on listing status
    const displayNFTs = useMemo(() => {
        if (filterType === 'listed') {
            return visualNFTs.filter(nft => listedTokenIds.has(nft.id))
        }
        if (filterType === 'not-listed') {
            return visualNFTs.filter(nft => !listedTokenIds.has(nft.id))
        }
        // Show all NFTs by default
        return visualNFTs
    }, [visualNFTs, listedTokenIds, filterType])

    // Filter by search term
    const filteredNFTs = useMemo(() => {
        if (!searchTerm) return displayNFTs

        const searchLower = searchTerm.toLowerCase()
        return displayNFTs.filter(nft =>
            nft.name?.toLowerCase().includes(searchLower) ||
            nft.id?.toString().includes(searchTerm) ||
            nft.creatureType?.toLowerCase().includes(searchLower)
        )
    }, [displayNFTs, searchTerm])

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">🌟 Explore EvoNFTs</h1>
                    <p className="text-slate-400">Discover and collect unique evolving NFTs</p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {loading ? (
                        new Array(4).fill(0).map((_, i) => (
                            <div key={`stat-loading-${i}`} className="glass rounded-xl p-4 text-center animate-pulse">
                                <div className="h-8 bg-slate-700 rounded w-16 mx-auto mb-2"></div>
                                <div className="h-4 bg-slate-700 rounded w-20 mx-auto"></div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gradient">{visualNFTs.length}</div>
                                <div className="text-sm text-slate-400">Total NFTs</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gradient">{activeListings.length}</div>
                                <div className="text-sm text-slate-400">Listed for Sale</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gradient">
                                    {marketplaceStats?.totalVolume ? Number(marketplaceStats.totalVolume).toFixed(2) : '0'} Ⓜ
                                </div>
                                <div className="text-sm text-slate-400">Total Volume</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gradient">
                                    {activeListings.length > 0
                                        ? Math.min(...activeListings.map(l => Number(l.price))).toFixed(2)
                                        : '0'} Ⓜ
                                </div>
                                <div className="text-sm text-slate-400">Floor Price</div>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Search Bar & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, ID, or creature type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            />
                            <span className="absolute left-4 top-3.5 text-slate-400 text-xl">🔍</span>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-3 text-slate-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer font-medium text-white"
                            >
                                <option value="all">🌟 All NFTs ({visualNFTs.length})</option>
                                <option value="listed">💰 For Sale ({activeListings.length})</option>
                                <option value="not-listed">🔒 Not for Sale ({visualNFTs.length - activeListings.length})</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin text-6xl mb-4">⟳</div>
                        <h3 className="text-xl font-semibold mb-2">Loading NFTs...</h3>
                        <p className="text-slate-400">Fetching data from blockchain</p>
                        <div className="mt-4 text-sm text-slate-500">
                            <div>NFTs: {nftsLoading ? 'Loading...' : '✓ Loaded'}</div>
                            <div>Visuals: {visualsLoading ? 'Loading...' : '✓ Loaded'}</div>
                            <div>Listings: {listingsLoading ? 'Loading...' : '✓ Loaded'}</div>
                        </div>
                    </div>
                ) : rawNFTs.length === 0 ? (
                    /* No NFTs minted yet */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No NFTs Minted Yet</h3>
                        <p className="text-slate-400 mb-6">Be the first to mint an EvoNFT!</p>
                        <button
                            onClick={() => globalThis.location.href = '/mint'}
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all"
                        >
                            Mint NFT
                        </button>
                    </motion.div>
                ) : filteredNFTs.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">{searchTerm ? '🔍' : '📦'}</div>
                        <h3 className="text-xl font-semibold mb-2">
                            {searchTerm ? 'No NFTs Found' : 'No NFTs Minted Yet'}
                        </h3>
                        <p className="text-slate-400 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search or filters'
                                : 'Be the first to mint an EvoNFT!'
                            }
                        </p>
                        {searchTerm ? (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all"
                            >
                                Clear Search
                            </button>
                        ) : (
                            <button
                                onClick={() => globalThis.location.href = '/mint'}
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all"
                            >
                                Mint NFT
                            </button>
                        )}
                    </motion.div>
                ) : (
                    /* NFT Grid */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredNFTs.map((nft) => (
                            <NFTCardWithListing
                                key={nft.id}
                                nft={nft}
                                listedTokenIds={listedTokenIds}
                                listings={activeListings}
                                currentAccount={account}
                                onSelect={() => {
                                    console.log('🛒 Buy button clicked for NFT:', nft.id);
                                    setSelectedNFT(nft);
                                    setShowBuyModal(true);
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Buy Modal */}
            {selectedNFT && (
                <BuyNFTModalWithListing
                    isOpen={showBuyModal}
                    onClose={() => {
                        console.log('🚪 Closing buy modal');
                        setShowBuyModal(false);
                        setSelectedNFT(null);
                    }}
                    nft={selectedNFT}
                    onSuccess={() => {
                        globalThis.location.reload();
                    }}
                />
            )}
        </div>
    )
}
