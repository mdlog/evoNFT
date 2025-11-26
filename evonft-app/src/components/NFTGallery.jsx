import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NFTVisual, NFTGrid } from './NFTVisual'
import { useNFTFilters } from '../hooks/useNFTVisuals'
import { creatureTypes, rarityLevels } from '../assets/nft-visuals'

// NFT Gallery with filters and search
export function NFTGallery({ nfts, onSelectNFT, selectedNFTs = [], showFilters = true }) {
    const {
        filters,
        filteredNFTs,
        updateFilter,
        resetFilters,
        totalCount,
        filteredCount
    } = useNFTFilters(nfts)

    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    // Apply search filter
    const searchFilteredNFTs = filteredNFTs.filter(nft => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            nft.name?.toLowerCase().includes(searchLower) ||
            nft.creatureType?.toLowerCase().includes(searchLower) ||
            nft.rarity?.toLowerCase().includes(searchLower) ||
            (nft.id || nft.tokenId)?.toString().includes(searchTerm)
        )
    })

    return (
        <div className="space-y-6">
            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search NFTs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        🔍
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'grid'
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        ⊞ Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'list'
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        ☰ List
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass rounded-xl p-4 border border-slate-700/50"
                >
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Rarity Filter */}
                        <div>
                            <label htmlFor="rarity-filter" className="block text-sm font-medium mb-1">Rarity</label>
                            <select
                                id="rarity-filter"
                                value={filters.rarity}
                                onChange={(e) => updateFilter('rarity', e.target.value)}
                                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
                            >
                                <option value="all">All Rarities</option>
                                {Object.entries(rarityLevels).map(([key, rarity]) => (
                                    <option key={key} value={key}>{rarity.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Creature Type Filter */}
                        <div>
                            <label htmlFor="creature-filter" className="block text-sm font-medium mb-1">Creature</label>
                            <select
                                id="creature-filter"
                                value={filters.creatureType}
                                onChange={(e) => updateFilter('creatureType', e.target.value)}
                                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
                            >
                                <option value="all">All Creatures</option>
                                {Object.entries(creatureTypes).map(([key, creature]) => (
                                    <option key={key} value={key}>{creature.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Level Range */}
                        <div>
                            <label htmlFor="level-min" className="block text-sm font-medium mb-1">Level Range</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    id="level-min"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={filters.levelRange[0]}
                                    onChange={(e) => updateFilter('levelRange', [Number(e.target.value), filters.levelRange[1]])}
                                    className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm focus:border-primary-500 focus:outline-none"
                                />
                                <span className="text-slate-400">-</span>
                                <input
                                    id="level-max"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={filters.levelRange[1]}
                                    onChange={(e) => updateFilter('levelRange', [filters.levelRange[0], Number(e.target.value)])}
                                    className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label htmlFor="sort-filter" className="block text-sm font-medium mb-1">Sort By</label>
                            <div className="flex gap-2">
                                <select
                                    id="sort-filter"
                                    value={filters.sortBy}
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:border-primary-500 focus:outline-none"
                                >
                                    <option value="tokenId">Token ID</option>
                                    <option value="level">Level</option>
                                    <option value="rarity">Rarity</option>
                                    <option value="name">Name</option>
                                </select>
                                <button
                                    onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-sm transition-all"
                                >
                                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>

                        {/* Reset */}
                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-3 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
                        Showing {searchFilteredNFTs.length} of {totalCount} NFTs
                        {filteredCount !== totalCount && ` (${filteredCount} after filters)`}
                    </div>
                </motion.div>
            )}

            {/* NFT Display */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <NFTGrid
                            nfts={searchFilteredNFTs}
                            onSelectNFT={onSelectNFT}
                            selectedNFTs={selectedNFTs}
                            showStats={true}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {searchFilteredNFTs.map((nft) => (
                            <NFTListItem
                                key={nft.id || nft.tokenId}
                                nft={nft}
                                onSelect={() => onSelectNFT && onSelectNFT(nft)}
                                selected={selectedNFTs.some(selected => selected.id === nft.id)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// NFT List Item Component
function NFTListItem({ nft, onSelect, selected }) {
    const rarityData = rarityLevels[nft.rarity] || rarityLevels.common

    return (
        <motion.div
            whileHover={{ x: 5 }}
            onClick={onSelect}
            className={`glass rounded-xl p-4 border transition-all cursor-pointer ${selected
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-slate-700/50 hover:border-primary-500/50'
                }`}
        >
            <div className="flex items-center gap-4">
                {/* NFT Visual */}
                <NFTVisual
                    tokenId={nft.id || nft.tokenId}
                    level={nft.level}
                    creatureType={nft.creatureType}
                    rarity={nft.rarity}
                    size={80}
                    showLevel={false}
                    showRarity={false}
                    animated={false}
                />

                {/* NFT Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{nft.name}</h3>
                        <span
                            className="px-2 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: rarityData.color + '20', color: rarityData.color }}
                        >
                            {rarityData.name}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 rounded-lg text-xs font-semibold">
                            Level {nft.level}
                        </span>
                    </div>

                    <p className="text-slate-400 text-sm mb-2">#{nft.id || nft.tokenId} • {nft.creatureType || 'Unknown'}</p>

                    {/* Stats */}
                    {nft.traits && (
                        <div className="flex gap-4 text-sm">
                            {nft.traits.filter(trait => ['Power', 'Speed', 'Intelligence'].includes(trait.trait_type)).map((trait) => (
                                <div key={trait.trait_type} className="flex items-center gap-1">
                                    <span className="text-slate-400">{trait.trait_type}:</span>
                                    <span className="font-semibold" style={{ color: rarityData.color }}>
                                        {trait.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selection indicator */}
                {selected && (
                    <div className="text-primary-500 text-2xl">✓</div>
                )}
            </div>
        </motion.div>
    )
}

// PropTypes removed - install prop-types package if you need runtime type checking
// Run: npm install prop-types