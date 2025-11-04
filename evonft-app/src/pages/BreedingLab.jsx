import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BreedingLab() {
    const [parent1, setParent1] = useState(null)
    const [parent2, setParent2] = useState(null)
    const [showModal, setShowModal] = useState(null)

    const mockNFTs = [
        { id: 1, name: 'EvoNFT #1234', level: 12, breedCount: 1, image: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=1234', traits: ['🔥', '⚡', '🛡️'] },
        { id: 2, name: 'EvoNFT #5678', level: 15, breedCount: 0, image: 'https://via.placeholder.com/150/10B981/FFFFFF?text=5678', traits: ['💧', '🌟', '🗡️'] },
        { id: 3, name: 'EvoNFT #9012', level: 8, breedCount: 2, image: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=9012', traits: ['🌍', '💪'] },
    ]

    const selectParent = (nft, parentNum) => {
        if (parentNum === 1) {
            setParent1(nft)
        } else {
            setParent2(nft)
        }
        setShowModal(null)
    }

    const compatibility = parent1 && parent2 ? 95 : 0

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">🧬 Breeding Lab</h1>
                <p className="text-slate-400 mb-8">Create next generation EvoNFTs</p>

                {/* How It Works */}
                <div className="bg-surface rounded-lg border border-slate-700 p-6 mb-8">
                    <h3 className="font-semibold mb-3">How Breeding Works</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>• Select two compatible NFTs from your collection</li>
                        <li>• Each NFT can breed up to 3 times</li>
                        <li>• Offspring inherits traits from both parents</li>
                        <li>• Higher level parents = better offspring stats</li>
                        <li>• Breeding cost: 1.0 MATIC + Gas</li>
                    </ul>
                </div>

                {/* Parent Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Parent 1 */}
                    <div className="bg-surface rounded-lg border border-slate-700 p-6">
                        <h3 className="font-semibold mb-4">PARENT 1</h3>
                        {parent1 ? (
                            <div>
                                <img src={parent1.image} alt={parent1.name} className="w-full rounded-lg mb-4" />
                                <div className="space-y-2">
                                    <p className="font-medium">{parent1.name}</p>
                                    <p className="text-sm text-slate-400">Level: {parent1.level}</p>
                                    <p className="text-sm text-slate-400">Breed Count: {parent1.breedCount}/3</p>
                                    <div className="flex gap-1">
                                        {parent1.traits.map((trait, i) => (
                                            <span key={i} className="text-xl">{trait}</span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setParent1(null)}
                                        className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(1)}
                                className="w-full aspect-square border-2 border-dashed border-slate-600 rounded-lg hover:border-primary-500 transition flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-2">+</div>
                                    <div className="text-slate-400">Select NFT</div>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Parent 2 */}
                    <div className="bg-surface rounded-lg border border-slate-700 p-6">
                        <h3 className="font-semibold mb-4">PARENT 2</h3>
                        {parent2 ? (
                            <div>
                                <img src={parent2.image} alt={parent2.name} className="w-full rounded-lg mb-4" />
                                <div className="space-y-2">
                                    <p className="font-medium">{parent2.name}</p>
                                    <p className="text-sm text-slate-400">Level: {parent2.level}</p>
                                    <p className="text-sm text-slate-400">Breed Count: {parent2.breedCount}/3</p>
                                    <div className="flex gap-1">
                                        {parent2.traits.map((trait, i) => (
                                            <span key={i} className="text-xl">{trait}</span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setParent2(null)}
                                        className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(2)}
                                className="w-full aspect-square border-2 border-dashed border-slate-600 rounded-lg hover:border-primary-500 transition flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-2">+</div>
                                    <div className="text-slate-400">Select NFT</div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Offspring Preview */}
                <div className="bg-surface rounded-lg border border-slate-700 p-8 mb-8">
                    <h3 className="font-semibold mb-6 text-center">OFFSPRING PREVIEW</h3>

                    {parent1 && parent2 ? (
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

                            <div className="max-w-md mx-auto space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Generation:</span>
                                    <span className="font-semibold">2</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Starting Level:</span>
                                    <span className="font-semibold">1</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Possible Traits:</span>
                                    <span className="font-semibold">🔥💧⚡🌟 (4 inherited)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Compatibility:</span>
                                    <span className="font-semibold text-secondary-500">⭐⭐⭐⭐⭐ {compatibility}%</span>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-4 max-w-md mx-auto">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-slate-400">Breeding Cost</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Base Fee:</span>
                                        <span>1.0 MATIC</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Gas:</span>
                                        <span>0.05 MATIC</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-700">
                                        <span>Total:</span>
                                        <span className="text-primary-400">1.05 MATIC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md mx-auto">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-slate-300">I understand breeding will lock both NFTs for 24 hours</span>
                                </label>
                            </div>

                            <div className="flex justify-center">
                                <button className="px-8 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                                    Start Breeding
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-6xl mb-4">❓</div>
                            <p>Select both parents to see predicted traits</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface rounded-lg border border-slate-700 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Select Parent NFT</h2>
                            <button
                                onClick={() => setShowModal(null)}
                                className="text-slate-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {mockNFTs.map(nft => (
                                <button
                                    key={nft.id}
                                    onClick={() => selectParent(nft, showModal)}
                                    disabled={nft.breedCount >= 3}
                                    className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                >
                                    <img src={nft.image} alt={nft.name} className="w-full rounded-lg mb-3" />
                                    <p className="font-medium">{nft.name}</p>
                                    <p className="text-sm text-slate-400">Level {nft.level}</p>
                                    <p className="text-sm text-slate-400">Breed: {nft.breedCount}/3</p>
                                    <div className="flex gap-1 mt-2">
                                        {nft.traits.map((trait, i) => (
                                            <span key={i}>{trait}</span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
