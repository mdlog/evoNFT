import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function StakingCalculatorModal({ isOpen, onClose }) {
    const [stakingDays, setStakingDays] = useState(30)
    const [nftCount, setNftCount] = useState(1)
    const [nftRarity, setNftRarity] = useState('common')
    const [calculations, setCalculations] = useState({
        dailyXP: 0,
        totalXP: 0,
        dailyMATIC: 0,
        totalMATIC: 0,
        tier: 'Bronze',
        bonusMultiplier: 1
    })

    const rarityMultipliers = {
        common: 1,
        rare: 1.25,
        epic: 1.5,
        legendary: 2
    }

    const tierBonuses = {
        Bronze: { days: '1-7', multiplier: 1, rate: 50 },
        Silver: { days: '8-30', multiplier: 1.2, rate: 60 },
        Gold: { days: '31-90', multiplier: 1.5, rate: 75 },
        Diamond: { days: '90+', multiplier: 2, rate: 100 }
    }

    useEffect(() => {
        calculateRewards()
    }, [stakingDays, nftCount, nftRarity])

    const calculateRewards = () => {
        // Determine tier based on staking days
        let tier = 'Bronze'
        if (stakingDays >= 90) tier = 'Diamond'
        else if (stakingDays >= 31) tier = 'Gold'
        else if (stakingDays >= 8) tier = 'Silver'

        const tierData = tierBonuses[tier]
        const rarityMultiplier = rarityMultipliers[nftRarity]

        // Multiple NFT bonus (10% for 5+ NFTs)
        const multipleNFTBonus = nftCount >= 5 ? 1.1 : 1

        // Base calculations
        const baseXPPerDay = tierData.rate
        const bonusMultiplier = tierData.multiplier * rarityMultiplier * multipleNFTBonus

        const dailyXP = Math.floor(baseXPPerDay * bonusMultiplier * nftCount)
        const totalXP = dailyXP * stakingDays

        // MATIC rewards (simplified calculation)
        const dailyMATIC = (dailyXP * 0.0001) // 0.0001 MATIC per XP
        const totalMATIC = dailyMATIC * stakingDays

        setCalculations({
            dailyXP,
            totalXP,
            dailyMATIC,
            totalMATIC,
            tier,
            bonusMultiplier
        })
    }

    const presetDays = [7, 30, 60, 90, 180, 365]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">📊 Staking Calculator</h2>
                                <p className="text-slate-400">Calculate your potential staking rewards</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white text-2xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Input Section */}
                            <div className="space-y-6">
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-4">Staking Parameters</h3>

                                    {/* Staking Duration */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Staking Duration (Days)</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="365"
                                            value={stakingDays}
                                            onChange={(e) => setStakingDays(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-sm text-slate-400 mt-1">
                                            <span>1 day</span>
                                            <span className="font-semibold text-primary-500">{stakingDays} days</span>
                                            <span>365 days</span>
                                        </div>

                                        {/* Preset buttons */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {presetDays.map(days => (
                                                <button
                                                    key={days}
                                                    onClick={() => setStakingDays(days)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${stakingDays === days
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-slate-700 hover:bg-slate-600'
                                                        }`}
                                                >
                                                    {days}d
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* NFT Count */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Number of NFTs</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={nftCount}
                                            onChange={(e) => setNftCount(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none"
                                        />
                                        {nftCount >= 5 && (
                                            <p className="text-sm text-green-400 mt-1">
                                                🎉 Multiple NFT Bonus: +10% XP
                                            </p>
                                        )}
                                    </div>

                                    {/* NFT Rarity */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Average NFT Rarity</label>
                                        <select
                                            value={nftRarity}
                                            onChange={(e) => setNftRarity(e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none"
                                        >
                                            <option value="common">Common (1x multiplier)</option>
                                            <option value="rare">Rare (1.25x multiplier)</option>
                                            <option value="epic">Epic (1.5x multiplier)</option>
                                            <option value="legendary">Legendary (2x multiplier)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tier Information */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-3">Current Tier: {calculations.tier}</h3>
                                    <div className="space-y-2">
                                        {Object.entries(tierBonuses).map(([tierName, tierData]) => (
                                            <div
                                                key={tierName}
                                                className={`flex justify-between p-2 rounded-lg ${calculations.tier === tierName
                                                    ? 'bg-primary-500/20 border border-primary-500/50'
                                                    : 'bg-slate-700/50'
                                                    }`}
                                            >
                                                <span className="font-medium">{tierName}</span>
                                                <span className="text-sm text-slate-400">{tierData.days}</span>
                                                <span className="text-sm text-secondary-500">{tierData.rate} XP/day</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Results Section */}
                            <div className="space-y-6">
                                {/* Daily Rewards */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-4">Daily Rewards</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">⚡</div>
                                            <div className="text-2xl font-bold text-secondary-500">{calculations.dailyXP}</div>
                                            <div className="text-sm text-slate-400">XP per day</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">💎</div>
                                            <div className="text-2xl font-bold text-accent-500">{calculations.dailyMATIC.toFixed(4)}</div>
                                            <div className="text-sm text-slate-400">MATIC per day</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Rewards */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-4">Total Rewards ({stakingDays} days)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🏆</div>
                                            <div className="text-3xl font-bold text-secondary-500">{calculations.totalXP.toLocaleString()}</div>
                                            <div className="text-sm text-slate-400">Total XP</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">💰</div>
                                            <div className="text-3xl font-bold text-accent-500">{calculations.totalMATIC.toFixed(4)}</div>
                                            <div className="text-sm text-slate-400">Total MATIC</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bonus Breakdown */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-4">Bonus Breakdown</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Base Rate ({calculations.tier}):</span>
                                            <span className="text-secondary-500">{tierBonuses[calculations.tier].rate} XP/day</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tier Multiplier:</span>
                                            <span className="text-primary-500">{tierBonuses[calculations.tier].multiplier}x</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rarity Multiplier:</span>
                                            <span className="text-accent-500">{rarityMultipliers[nftRarity]}x</span>
                                        </div>
                                        {nftCount >= 5 && (
                                            <div className="flex justify-between">
                                                <span>Multiple NFT Bonus:</span>
                                                <span className="text-green-400">1.1x</span>
                                            </div>
                                        )}
                                        <hr className="border-slate-600" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total Multiplier:</span>
                                            <span className="text-gradient">{calculations.bonusMultiplier.toFixed(2)}x</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Projection Chart */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-semibold mb-4">Reward Projection</h3>
                                    <div className="space-y-3">
                                        {[7, 30, 90, 180, 365].map(days => {
                                            const projectedXP = calculations.dailyXP * days
                                            const projectedMATIC = calculations.dailyMATIC * days
                                            return (
                                                <div key={days} className="flex justify-between items-center p-2 rounded-lg bg-slate-700/30">
                                                    <span className="font-medium">{days} days</span>
                                                    <div className="text-right">
                                                        <div className="text-secondary-500 text-sm">{projectedXP.toLocaleString()} XP</div>
                                                        <div className="text-accent-500 text-sm">{projectedMATIC.toFixed(4)} MATIC</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-all"
                            >
                                Close Calculator
                            </button>
                            <button
                                onClick={() => {
                                    // Copy results to clipboard
                                    const results = `Staking Calculator Results:
${nftCount} NFTs for ${stakingDays} days
Tier: ${calculations.tier}
Daily: ${calculations.dailyXP} XP + ${calculations.dailyMATIC.toFixed(4)} MATIC
Total: ${calculations.totalXP.toLocaleString()} XP + ${calculations.totalMATIC.toFixed(4)} MATIC`
                                    navigator.clipboard.writeText(results)
                                    alert('Results copied to clipboard!')
                                }}
                                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-all"
                            >
                                📋 Copy Results
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