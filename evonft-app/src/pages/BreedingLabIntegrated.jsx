import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMyNFTs } from '../hooks/useContract'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useNFTVisuals } from '../hooks/useNFTVisuals'
import { useBreeding, useNFTBreedingInfo, useOffspringPrediction, useBreedingActions, useCanBreedPair } from '../hooks/useBreeding'
import { NFTVisual } from '../components/NFTVisual'
import { rarityLevels } from '../assets/nft-visuals'

export default function BreedingLab() {
    const { account } = useWeb3()
    const { nfts: rawNFTs, loading: nftsLoading } = useMyNFTs()
    const { visualNFTs } = useNFTVisuals(rawNFTs || [])
    const { config, loading: configLoading } = useBreeding()
    const { breed, breeding } = useBreedingActions()

    const [parent1, setParent1] = useState(null)
    const [parent2, setParent2] = useState(null)
    const [showModal, setShowModal] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [offspringId, setOffspringId] = useState(null)

    const selectParent = (nft, parentNum) => {
        if (parentNum === 1) {
            setParent1(nft)
        } else {
            setParent2(nft)
        }
        setShowModal(null)
    }

    const handleBreed = async () => {
        if (!parent1 || !parent2 || !config) return

        try {
            const result = await breed(parent1.id, parent2.id, config.breedingFeeWei)

            if (result.success) {
                setOffspringId(result.offspringId)
                setShowConfirmModal(false)
                // Reset parents
                setParent1(null)
                setParent2(null)
            }
        } catch (error) {
            console.error('Breeding error:', error)
            let errorMessage = 'Failed to breed NFTs'
            if (error.message.includes('user rejected')) {
                errorMessage = 'Transaction cancelled'
            } else if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient MATIC balance'
            }
            alert(errorMessage)
        }
    }

    if (!account) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-slate-400">Please connect your wallet to access breeding</p>
                    </div>
                </div>
            </div>
        )
    }

    const loading = nftsLoading || configLoading

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">🧬 Breeding Lab</h1>
                <p className="text-slate-400 mb-8">Create next generation EvoNFTs</p>

                {/* How It Works */}
                <div className="glass-strong rounded-2xl border border-slate-700/50 p-6 mb-8">
                    <h3 className="font-semibold mb-3">How Breeding Works</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>• Select two compatible NFTs from your collection</li>
                        <li>• Each NFT can breed up to {config?.maxBreedCount || 3} times</li>
                        <li>• Offspring inherits 70% of parents' average stats</li>
                        <li>• Higher level parents = better offspring stats</li>
                        <li>• Breeding cost: {config?.breedingFee || '0.01'} MATIC + Gas</li>
                        <li>• Cooldown: {config ? (config.cooldown / 3600).toFixed(0) : 24} hours between breeds</li>
                    </ul>
                </div>

                {/* Parent Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Parent 1 */}
                    <ParentCard
                        parent={parent1}
                        parentNum={1}
                        onSelect={() => setShowModal(1)}
                        onClear={() => setParent1(null)}
                        loading={loading}
                    />

                    {/* Parent 2 */}
                    <ParentCard
                        parent={parent2}
                        parentNum={2}
                        onSelect={() => setShowModal(2)}
                        onClear={() => setParent2(null)}
                        loading={loading}
                    />
                </div>

                {/* Offspring Preview */}
                <OffspringPreview
                    parent1={parent1}
                    parent2={parent2}
                    config={config}
                    onBreed={() => setShowConfirmModal(true)}
                    breeding={breeding}
                />

                {/* NFT Selection Modal */}
                {showModal && (
                    <NFTSelectionModal
                        nfts={visualNFTs}
                        onSelect={(nft) => selectParent(nft, showModal)}
                        onClose={() => setShowModal(null)}
                        loading={loading}
                    />
                )}

                {/* Confirm Breeding Modal */}
                {showConfirmModal && parent1 && parent2 && config && (
                    <ConfirmBreedingModal
                        parent1={parent1}
                        parent2={parent2}
                        config={config}
                        onConfirm={handleBreed}
                        onClose={() => setShowConfirmModal(false)}
                        breeding={breeding}
                    />
                )}

                {/* Success Modal */}
                {offspringId !== null && (
                    <SuccessModal
                        offspringId={offspringId}
                        onClose={() => setOffspringId(null)}
                    />
                )}
            </div>
        </div>
    )
}

// Parent Card Component
function ParentCard({ parent, parentNum, onSelect, onClear, loading }) {
    const { info } = useNFTBreedingInfo(parent?.id)

    if (loading) {
        return (
            <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                <h3 className="font-semibold mb-4">PARENT {parentNum}</h3>
                <div className="animate-pulse">
                    <div className="aspect-square bg-slate-700 rounded-xl mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (!parent) {
        return (
            <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                <h3 className="font-semibold mb-4">PARENT {parentNum}</h3>
                <button
                    onClick={onSelect}
                    className="w-full aspect-square border-2 border-dashed border-slate-600 rounded-xl hover:border-primary-500 transition flex items-center justify-center group"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">+</div>
                        <div className="text-slate-400">Select NFT</div>
                    </div>
                </button>
            </div>
        )
    }

    const rarity = parent.rarity || 'common'
    const rarityData = rarityLevels[rarity] || rarityLevels.common

    return (
        <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
            <h3 className="font-semibold mb-4">PARENT {parentNum}</h3>
            <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                <NFTVisual
                    tokenId={parent.id}
                    level={parent.level || 1}
                    creatureType={parent.creatureType}
                    rarity={rarity}
                    size={280}
                    animated={true}
                />
            </div>
            <div className="space-y-2">
                <p className="font-medium text-lg">{parent.name}</p>
                <p className="text-sm text-slate-400">Level: {parent.level || 1}</p>
                {info && (
                    <>
                        <p className="text-sm text-slate-400">
                            Breed Count: {info.breedCount}/{info.generation === 0 ? 3 : 3}
                            {info.breedCount >= 3 && <span className="text-red-400 ml-2">MAX</span>}
                        </p>
                        <p className="text-sm text-slate-400">Generation: {info.generation}</p>
                        {!info.canBreedNow && info.timeUntilBreedable > 0 && info.timeUntilBreedable < 999999999 && (
                            <p className="text-sm text-yellow-400">
                                Cooldown: {Math.ceil(info.timeUntilBreedable / 3600)}h remaining
                            </p>
                        )}
                    </>
                )}
                <button
                    onClick={onClear}
                    className="w-full mt-4 px-4 py-2 glass hover:glass-strong rounded-lg transition"
                >
                    Change
                </button>
            </div>
        </div>
    )
}

// Offspring Preview Component
function OffspringPreview({ parent1, parent2, config, onBreed, breeding }) {
    const { prediction, loading } = useOffspringPrediction(parent1?.id, parent2?.id)
    const { canBreed, reason } = useCanBreedPair(parent1?.id, parent2?.id)

    if (!parent1 || !parent2) {
        return (
            <div className="glass-strong rounded-2xl border border-slate-700/50 p-8 mb-8">
                <h3 className="font-semibold mb-6 text-center">OFFSPRING PREVIEW</h3>
                <div className="text-center py-12 text-slate-400">
                    <div className="text-6xl mb-4">❓</div>
                    <p>Select both parents to see predicted offspring</p>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-strong rounded-2xl border border-slate-700/50 p-8 mb-8">
            <h3 className="font-semibold mb-6 text-center">OFFSPRING PREVIEW</h3>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
            >
                <div className="flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-6xl">🥚</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-slate-400">
                        <div className="animate-spin text-4xl mb-2">⟳</div>
                        <p>Calculating offspring stats...</p>
                    </div>
                ) : prediction && (
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Generation:</span>
                            <span className="font-semibold">{prediction.generation}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Starting Level:</span>
                            <span className="font-semibold">1</span>
                        </div>

                        {/* Predicted Stats */}
                        <div className="glass rounded-xl p-4">
                            <h4 className="text-sm font-semibold mb-3">Predicted Stats (70% of parents avg)</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span>Strength:</span>
                                    <span className="font-semibold">{prediction.strength}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Speed:</span>
                                    <span className="font-semibold">{prediction.speed}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Intelligence:</span>
                                    <span className="font-semibold">{prediction.intelligence}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Defense:</span>
                                    <span className="font-semibold">{prediction.defense}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Luck:</span>
                                    <span className="font-semibold">{prediction.luck}/100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {config && (
                    <div className="glass rounded-xl p-4 max-w-md mx-auto">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-400">Breeding Cost</span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Breeding Fee:</span>
                                <span>{config.breedingFee} MATIC</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mint Price:</span>
                                <span>0.01 MATIC</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Gas:</span>
                                <span>~0.01 MATIC</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-700">
                                <span>Total:</span>
                                <span className="text-primary-400">~{(parseFloat(config.breedingFee) + 0.02).toFixed(3)} MATIC</span>
                            </div>
                        </div>
                    </div>
                )}

                {!canBreed && reason && (
                    <div className="max-w-md mx-auto p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">⚠️ {reason}</p>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={onBreed}
                        disabled={breeding || !canBreed}
                        className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                        {breeding ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⟳</span>
                                Breeding...
                            </span>
                        ) : (
                            'Start Breeding'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// NFT Selection Modal Component
function NFTSelectionModal({ nfts, onSelect, onClose, loading }) {
    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                <div className="glass-strong rounded-2xl border border-slate-700/50 p-6 max-w-4xl w-full">
                    <div className="text-center py-12">
                        <div className="animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading your NFTs...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-slate-700/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Select Parent NFT</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl transition"
                    >
                        ✕
                    </button>
                </div>

                {nfts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-slate-400 mb-4">You don't have any NFTs yet</p>
                        <a
                            href="/mint"
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition"
                        >
                            Mint Your First NFT
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {nfts.map(nft => (
                            <NFTSelectCard
                                key={nft.id}
                                nft={nft}
                                onSelect={() => onSelect(nft)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// NFT Select Card Component
function NFTSelectCard({ nft, onSelect }) {
    const { info } = useNFTBreedingInfo(nft.id)
    const canBreed = info?.canBreedNow && info?.breedCount < 3

    return (
        <button
            onClick={onSelect}
            disabled={!canBreed}
            className="glass hover:glass-strong rounded-xl p-4 transition disabled:opacity-50 disabled:cursor-not-allowed text-left group"
        >
            <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                <NFTVisual
                    tokenId={nft.id}
                    level={nft.level || 1}
                    creatureType={nft.creatureType}
                    rarity={nft.rarity}
                    size={150}
                    animated={false}
                    className="group-hover:scale-110 transition-transform"
                />
            </div>
            <p className="font-medium text-sm truncate">{nft.name}</p>
            <p className="text-xs text-slate-400">Level {nft.level || 1}</p>
            {info && (
                <p className="text-xs text-slate-400">
                    Breeds: {info.breedCount}/3
                    {!canBreed && <span className="text-red-400 ml-1">⚠️</span>}
                </p>
            )}
        </button>
    )
}

// Confirm Breeding Modal
function ConfirmBreedingModal({ parent1, parent2, config, onConfirm, onClose, breeding }) {
    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4">Confirm Breeding</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 text-center">
                            <p className="text-sm text-slate-400 mb-1">Parent 1</p>
                            <p className="font-semibold">{parent1.name}</p>
                            <p className="text-xs text-slate-400">Level {parent1.level}</p>
                        </div>
                        <div className="text-2xl">+</div>
                        <div className="flex-1 text-center">
                            <p className="text-sm text-slate-400 mb-1">Parent 2</p>
                            <p className="font-semibold">{parent2.name}</p>
                            <p className="text-xs text-slate-400">Level {parent2.level}</p>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Breeding Fee:</span>
                            <span className="font-semibold">{config.breedingFee} MATIC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Cooldown:</span>
                            <span className="font-semibold">{(config.cooldown / 3600).toFixed(0)} hours</span>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <p className="text-yellow-200 text-sm">
                            ⚠️ Both parents will be on cooldown for {(config.cooldown / 3600).toFixed(0)} hours after breeding
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={breeding}
                        className="flex-1 px-4 py-3 glass hover:glass-strong rounded-xl transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={breeding}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                        {breeding ? 'Breeding...' : 'Confirm'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// Success Modal
function SuccessModal({ offspringId, onClose }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-strong rounded-2xl border border-primary-500/50 p-8 max-w-md w-full text-center"
                >
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h3 className="text-2xl font-bold mb-2">Breeding Successful!</h3>
                    <p className="text-slate-300 mb-6">
                        Your new offspring has been born!
                    </p>

                    <div className="mb-6 p-4 glass rounded-xl">
                        <div className="text-sm text-slate-400 mb-1">Offspring Token ID</div>
                        <div className="text-2xl font-bold text-gradient">#{offspringId}</div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 glass hover:glass-strong rounded-lg transition"
                        >
                            Close
                        </button>
                        <a
                            href={`/nft/${offspringId}`}
                            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition text-center"
                        >
                            View NFT
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
