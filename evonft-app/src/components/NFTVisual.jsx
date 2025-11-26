import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    generateNFTImageURL,
    generateNFTMetadata,
    creatureTypes,
    rarityLevels,
    evolutionStages
} from '../assets/nft-visuals'

// Main NFT Visual Component
export function NFTVisual({
    tokenId,
    level = 1,
    creatureType,
    rarity = 'common',
    size = 200,
    showLevel = true,
    showRarity = true,
    animated = true,
    onClick,
    className = ''
}) {
    const [imageUrl, setImageUrl] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const nftData = {
            tokenId,
            level,
            creatureType,
            rarity
        }

        const url = generateNFTImageURL(nftData)
        setImageUrl(url)
        setIsLoaded(true)
    }, [tokenId, level, creatureType, rarity])

    const rarityData = rarityLevels[rarity] || rarityLevels.common
    const evolution = evolutionStages[Math.min(level, 10)]

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hover: animated ? {
            scale: 1.05,
            transition: { duration: 0.2 }
        } : {}
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={onClick}
            className={`relative inline-block ${onClick ? 'cursor-pointer' : ''} ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Loading placeholder */}
            {!isLoaded && (
                <div
                    className="flex items-center justify-center bg-slate-800 rounded-xl border-2 border-slate-600"
                    style={{ width: size, height: size }}
                >
                    <div className="animate-spin text-4xl">⟳</div>
                </div>
            )}

            {/* NFT Image */}
            {isLoaded && (
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt={`NFT #${tokenId}`}
                        className="w-full h-full rounded-xl"
                        style={{
                            filter: `drop-shadow(0 0 20px ${rarityData.borderGlow})`,
                        }}
                    />

                    {/* Animated border for high rarity */}
                    {(rarity === 'epic' || rarity === 'legendary') && animated && (
                        <div
                            className="absolute inset-0 rounded-xl border-2 animate-pulse"
                            style={{
                                borderColor: rarityData.color,
                                boxShadow: `0 0 20px ${rarityData.borderGlow}`
                            }}
                        />
                    )}

                    {/* Level badge */}
                    {showLevel && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-2 right-2 bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center border-2"
                            style={{ borderColor: rarityData.color }}
                        >
                            <span className="text-white text-sm font-bold">{level}</span>
                        </motion.div>
                    )}

                    {/* Rarity badge */}
                    {showRarity && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: rarityData.color }}
                        >
                            {rarityData.name}
                        </motion.div>
                    )}

                    {/* Evolution stage indicator */}
                    {level >= 5 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-2 right-2 text-xs text-yellow-400 font-semibold bg-black/50 px-2 py-1 rounded"
                        >
                            {evolution.name}
                        </motion.div>
                    )}

                    {/* Legendary glow effect */}
                    {rarity === 'legendary' && animated && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}
                </div>
            )}
        </motion.div>
    )
}

// NFT Card Component with additional info
export function NFTCard({
    nft,
    showStats = false,
    showDescription = false,
    onSelect,
    selected = false,
    className = ''
}) {
    const rarityData = rarityLevels[nft.rarity] || rarityLevels.common

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass rounded-xl p-4 border transition-all ${selected
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-slate-700/50 hover:border-primary-500/50'
                } ${className}`}
            onClick={onSelect}
        >
            {/* NFT Visual */}
            <div className="flex justify-center mb-4">
                <NFTVisual
                    tokenId={nft.id || nft.tokenId}
                    level={nft.level}
                    creatureType={nft.creatureType}
                    rarity={nft.rarity}
                    size={180}
                />
            </div>

            {/* NFT Info */}
            <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
                <p className="text-slate-400 text-sm mb-2">#{nft.id || nft.tokenId}</p>

                {showDescription && nft.description && (
                    <p className="text-slate-300 text-sm mb-3">{nft.description}</p>
                )}

                {/* Stats */}
                {showStats && nft.traits && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {nft.traits.filter(trait => ['Power', 'Speed', 'Intelligence'].includes(trait.trait_type)).map(trait => (
                            <div key={trait.trait_type} className="text-center">
                                <div className="text-xs text-slate-400">{trait.trait_type}</div>
                                <div className="font-semibold text-sm" style={{ color: rarityData.color }}>
                                    {trait.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selection indicator */}
                {selected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2 text-primary-500 text-2xl"
                    >
                        ✓
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

// NFT Grid Component
export function NFTGrid({
    nfts,
    onSelectNFT,
    selectedNFTs = [],
    showStats = false,
    loading = false,
    emptyMessage = "No NFTs found"
}) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="glass rounded-xl p-4 animate-pulse">
                        <div className="aspect-square bg-slate-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (nfts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No NFTs Available</h3>
                <p className="text-slate-400">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts.map((nft) => (
                <NFTCard
                    key={nft.id || nft.tokenId}
                    nft={nft}
                    showStats={showStats}
                    onSelect={() => onSelectNFT && onSelectNFT(nft)}
                    selected={selectedNFTs.some(selected => selected.id === nft.id)}
                />
            ))}
        </div>
    )
}

// NFT Preview Component for modals
export function NFTPreview({ nft, size = 120 }) {
    return (
        <div className="flex items-center gap-3">
            <NFTVisual
                tokenId={nft.id || nft.tokenId}
                level={nft.level}
                creatureType={nft.creatureType}
                rarity={nft.rarity}
                size={size}
                showLevel={true}
                showRarity={false}
                animated={false}
            />
            <div>
                <h4 className="font-semibold">{nft.name}</h4>
                <p className="text-slate-400 text-sm">#{nft.id || nft.tokenId}</p>
                <p className="text-sm" style={{ color: rarityLevels[nft.rarity]?.color }}>
                    Level {nft.level} • {rarityLevels[nft.rarity]?.name}
                </p>
            </div>
        </div>
    )
}

// PropTypes removed - install prop-types package if you need runtime type checking
// Run: npm install prop-types