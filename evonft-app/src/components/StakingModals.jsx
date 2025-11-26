import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStakingInfo } from '../hooks/useExtendedContract'

// Confirmation Modal Component
export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'warning' }) {
    const typeStyles = {
        warning: 'border-yellow-500/50 from-yellow-500/10 to-orange-500/10',
        danger: 'border-red-500/50 from-red-500/10 to-red-600/10',
        success: 'border-green-500/50 from-green-500/10 to-green-600/10',
        info: 'border-blue-500/50 from-blue-500/10 to-blue-600/10'
    }

    const typeIcons = {
        warning: '⚠️',
        danger: '🚨',
        success: '✅',
        info: 'ℹ️'
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`glass-strong rounded-2xl border p-6 max-w-md w-full bg-gradient-to-br ${typeStyles[type]}`}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">{typeIcons[type]}</div>
                            <h3 className="text-xl font-bold mb-3">{title}</h3>
                            <p className="text-slate-300 mb-6">{message}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-all"
                                >
                                    {cancelText || 'Cancel'}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${type === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-primary-500 hover:bg-primary-600'
                                        }`}
                                >
                                    {confirmText || 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// Loading Modal Component
export function LoadingModal({ isOpen, title, message, progress }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-strong rounded-2xl border border-primary-500/50 p-8 max-w-md w-full text-center"
                    >
                        <div className="text-6xl mb-4 animate-spin">⏳</div>
                        <h3 className="text-xl font-bold mb-3">{title}</h3>
                        <p className="text-slate-300 mb-6">{message}</p>

                        {progress !== undefined && (
                            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                                />
                            </div>
                        )}

                        <div className="flex justify-center">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// Success Modal Component
export function SuccessModal({ isOpen, onClose, title, message, actionText, onAction }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="glass-strong rounded-2xl border border-green-500/50 p-8 max-w-md w-full text-center bg-gradient-to-br from-green-500/10 to-green-600/10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="text-6xl mb-4"
                        >
                            🎉
                        </motion.div>

                        <h3 className="text-2xl font-bold mb-3 text-green-400">{title}</h3>
                        <p className="text-slate-300 mb-6">{message}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-all"
                            >
                                Close
                            </button>
                            {onAction && (
                                <button
                                    onClick={onAction}
                                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all"
                                >
                                    {actionText || 'Continue'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// NFT Selection Modal Component
export function NFTSelectionModal({ isOpen, onClose, nfts, onSelect, title, description, multiSelect = false }) {
    const [selectedNFTs, setSelectedNFTs] = useState([])

    const handleNFTClick = (nft) => {
        if (multiSelect) {
            setSelectedNFTs(prev => {
                const isSelected = prev.find(n => n.id === nft.id)
                if (isSelected) {
                    return prev.filter(n => n.id !== nft.id)
                } else {
                    return [...prev, nft]
                }
            })
        } else {
            onSelect(nft)
        }
    }

    const handleConfirmSelection = () => {
        if (multiSelect) {
            onSelect(selectedNFTs)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{title}</h2>
                                <p className="text-slate-400">{description}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white text-2xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {nfts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                    {nfts.map((nft) => {
                                        const isSelected = multiSelect ? selectedNFTs.find(n => n.id === nft.id) : false
                                        return (
                                            <motion.div
                                                key={nft.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleNFTClick(nft)}
                                                className={`glass rounded-xl p-4 text-center cursor-pointer transition-all ${isSelected
                                                    ? 'border-primary-500 bg-primary-500/20'
                                                    : 'border-slate-700/50 hover:border-primary-500/50'
                                                    }`}
                                            >
                                                <img
                                                    src={nft.image}
                                                    alt={nft.name}
                                                    className="w-full aspect-square object-cover rounded-lg mb-3"
                                                />
                                                <h3 className="font-semibold mb-1">{nft.name}</h3>
                                                <p className="text-sm text-slate-400 mb-1">#{nft.id}</p>
                                                <p className="text-sm text-secondary-500">Level {nft.level || 1}</p>

                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 text-primary-500 text-xl">
                                                        ✓
                                                    </div>
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                {multiSelect && (
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400">
                                            {selectedNFTs.length} NFT{selectedNFTs.length !== 1 ? 's' : ''} selected
                                        </p>
                                        <button
                                            onClick={handleConfirmSelection}
                                            disabled={selectedNFTs.length === 0}
                                            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Confirm Selection
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold mb-2">No NFTs Available</h3>
                                <p className="text-slate-400">No NFTs match the current criteria.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// Rewards Summary Modal Component
export function RewardsSummaryModal({ isOpen, onClose, rewards, onClaimAll }) {
    const totalXP = rewards.reduce((sum, reward) => sum + (reward.xp || 0), 0)
    const totalMATIC = rewards.reduce((sum, reward) => sum + (Number.parseFloat(reward.matic) || 0), 0)

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-strong rounded-2xl border border-secondary-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">💰 Rewards Summary</h2>
                                <p className="text-slate-400">Your accumulated staking rewards</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white text-2xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Total Summary */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-4xl mb-2">⚡</div>
                                <div className="text-2xl font-bold text-secondary-500">{totalXP}</div>
                                <div className="text-slate-400">Total XP</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="text-4xl mb-2">💎</div>
                                <div className="text-2xl font-bold text-accent-500">{totalMATIC.toFixed(4)}</div>
                                <div className="text-slate-400">Total MATIC</div>
                            </div>
                        </div>

                        {/* Individual Rewards */}
                        <div className="space-y-3 mb-6">
                            <h3 className="font-semibold">Individual NFT Rewards:</h3>
                            {rewards.map((reward) => (
                                <div key={reward.tokenId} className="glass rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold">EvoNFT #{reward.tokenId}</span>
                                        <div className="text-sm text-slate-400">
                                            {reward.daysStaked} days staked
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-secondary-500 font-semibold">{reward.xp} XP</div>
                                        <div className="text-accent-500 font-semibold">{Number.parseFloat(reward.matic).toFixed(4)} MATIC</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={onClaimAll}
                                disabled={totalXP === 0 && totalMATIC === 0}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Claim All Rewards
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// PropTypes removed - install prop-types package if you need runtime type checking
// Run: npm install prop-types