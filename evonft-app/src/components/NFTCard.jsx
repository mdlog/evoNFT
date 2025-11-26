import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NFTVisual } from './NFTVisual'
import { useNFTVisual } from '../hooks/useNFTVisuals'
import { rarityLevels } from '../assets/nft-visuals'

export default function NFTCard({ nft, variant = 'marketplace' }) {
    const visualData = useNFTVisual(nft)
    // Use visual data if available, fallback to original nft data
    const displayNFT = visualData || nft

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

    const rarityGlow = {
        common: 'hover:shadow-slate-500/50',
        rare: 'hover:shadow-blue-500/50',
        epic: 'hover:shadow-primary-500/50',
        legendary: 'hover:shadow-accent-500/50'
    }

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Link to={`/nft/${nft.id}`}>
                <div className={`glass rounded-2xl overflow-hidden hover:glass-strong transition-all duration-300 hover:shadow-2xl ${rarityGlow[nft.rarity]} border border-slate-700/50 hover:border-primary-500/50`}>
                    {/* NFT Visual Container */}
                    <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
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
                                View Details →
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                        <div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-gradient transition-all">
                                {displayNFT.name || `EvoNFT #${displayNFT.id || displayNFT.tokenId}`}
                            </h3>
                            <p className={`text-sm font-semibold bg-gradient-to-r ${rarityColors[rarity]} bg-clip-text text-transparent`}>
                                {rarityData.name} {displayNFT.creatureType ? `• ${displayNFT.creatureType}` : ''}
                            </p>
                        </div>

                        {variant === 'marketplace' && (
                            <>
                                <div className="flex justify-between items-center text-sm py-2 border-t border-slate-700/50">
                                    <span className="text-slate-400">Level</span>
                                    <span className="font-bold text-white">{displayNFT.level || 1}</span>
                                </div>

                                <div className="pt-2 border-t border-slate-700/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">Price</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                                {displayNFT.price || nft.price || '0.1'}
                                            </span>
                                            <span className="text-sm text-slate-400">MATIC</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {variant === 'collection' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>XP Progress</span>
                                        <span className="font-semibold">{Math.floor(((displayNFT.currentXP || nft.currentXP || 0) / (displayNFT.maxXP || nft.maxXP || 100)) * 100)}%</span>
                                    </div>
                                    <div className="relative w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rarityColors[rarity]} rounded-full transition-all duration-500 shadow-lg`}
                                            style={{ width: `${((displayNFT.currentXP || nft.currentXP || 0) / (displayNFT.maxXP || nft.maxXP || 100)) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{displayNFT.currentXP || nft.currentXP || 0} XP</span>
                                        <span>{displayNFT.maxXP || nft.maxXP || 100} XP</span>
                                    </div>
                                </div>

                                {/* Stats Display */}
                                {displayNFT.traits && (
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                        {displayNFT.traits.filter(trait => ['Power', 'Speed', 'Intelligence'].includes(trait.trait_type)).map((trait, i) => (
                                            <div key={i} className="text-center">
                                                <div className="text-xs text-slate-400">{trait.trait_type}</div>
                                                <div className="font-semibold text-sm" style={{ color: rarityData.color }}>
                                                    {trait.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Fallback traits display */}
                                {!displayNFT.traits && nft.traits && Array.isArray(nft.traits) && (
                                    <div className="flex gap-1.5 pt-2">
                                        {nft.traits.map((trait, i) => (
                                            <motion.span
                                                key={i}
                                                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {trait}
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
