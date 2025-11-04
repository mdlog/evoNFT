import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { NFTGallery } from '../components/NFTGallery'
import { useMockNFTs } from '../hooks/useNFTVisuals'

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState('')

    // Generate mock NFTs with visual data
    const allMockNFTs = useMockNFTs(24) // Generate 24 sample NFTs

    // Add marketplace-specific data (prices)
    const mockNFTs = useMemo(() => {
        return allMockNFTs.map(nft => ({
            ...nft,
            price: (Math.random() * 10 + 0.5).toFixed(2), // Random price between 0.5 and 10.5
            currentXP: Math.floor(Math.random() * 5000),
            maxXP: 5000
        }))
    }, [allMockNFTs])

    // Filter by search term
    const filteredNFTs = useMemo(() => {
        if (!searchTerm) return mockNFTs

        const searchLower = searchTerm.toLowerCase()
        return mockNFTs.filter(nft =>
            nft.name?.toLowerCase().includes(searchLower) ||
            nft.id?.toString().includes(searchTerm) ||
            nft.creatureType?.toLowerCase().includes(searchLower)
        )
    }, [mockNFTs, searchTerm])

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
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gradient">{mockNFTs.length}</div>
                        <div className="text-sm text-slate-400">Total NFTs</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gradient">
                            {mockNFTs.filter(n => n.rarity === 'legendary').length}
                        </div>
                        <div className="text-sm text-slate-400">Legendary</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gradient">
                            {Math.max(...mockNFTs.map(n => n.level))}
                        </div>
                        <div className="text-sm text-slate-400">Max Level</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gradient">
                            {Math.min(...mockNFTs.map(n => Number.parseFloat(n.price))).toFixed(2)} Ⓜ
                        </div>
                        <div className="text-sm text-slate-400">Floor Price</div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="relative">
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
                </motion.div>

                {/* NFT Gallery with Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <NFTGallery
                        nfts={filteredNFTs}
                        showFilters={true}
                        onSelectNFT={(nft) => {
                            // Navigate to NFT detail page
                            globalThis.location.href = `/nft/${nft.id}`
                        }}
                    />
                </motion.div>

                {/* Empty State */}
                {filteredNFTs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
                        <p className="text-slate-400 mb-6">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all"
                        >
                            Clear Search
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
