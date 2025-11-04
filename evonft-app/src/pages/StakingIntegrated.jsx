import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStaking, useStakingInfo, useNFTExtended } from '../hooks/useExtendedContract'
import { useMyNFTs } from '../hooks/useContract'
import { useWeb3 } from '../context/Web3Context'
import { STAKING_CONTRACT } from '../config/contractsExtended'

import { StakingCalculatorModal } from '../components/StakingCalculatorModal'

export default function Staking() {
    const { account } = useWeb3()
    const { contractWithSigner: stakingContract, userStakes, loading: stakingLoading } = useStaking()
    const { contractWithSigner: nftContract } = useNFTExtended()
    const { nfts: allNFTs } = useMyNFTs()
    const [showStakeModal, setShowStakeModal] = useState(false)
    const [showUnstakeModal, setShowUnstakeModal] = useState(false)
    const [showRewardsModal, setShowRewardsModal] = useState(false)
    const [showCalculatorModal, setShowCalculatorModal] = useState(false)
    const [processing, setProcessing] = useState(false)

    // Filter unstaked NFTs
    const unstakedNFTs = allNFTs.filter(nft => !userStakes.includes(nft.id))

    const renderStakedNFTsContent = () => {
        if (userStakes.length > 0) {
            return (
                <div className="space-y-4">
                    {userStakes.map((tokenId) => (
                        <StakedNFTCard
                            key={tokenId}
                            tokenId={tokenId}
                            onClaim={() => handleClaim(tokenId)}
                            onUnstake={() => handleUnstake(tokenId)}
                            processing={processing}
                        />
                    ))}
                </div>
            )
        }

        return (
            <div className="text-center py-12 glass-strong rounded-xl border border-slate-700/50">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No Staked NFTs</h3>
                <p className="text-slate-400 mb-6">Start staking to earn passive rewards!</p>
                <button
                    onClick={() => setShowStakeModal(true)}
                    disabled={unstakedNFTs.length === 0}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition disabled:opacity-50"
                >
                    Stake Your First NFT
                </button>
            </div>
        )
    }

    const poolStats = [
        { value: userStakes.length.toString(), label: 'Your Staked', icon: '🔒' },
        { value: '2,156', label: 'Total Stakers', icon: '👥' },
        { value: '50 XP', label: 'Daily Base Rate', icon: '📈' },
        { value: '125%', label: 'Current APY', icon: '💰' }
    ]

    const tiers = [
        { name: 'Bronze', days: '1-7', rate: '50 XP/day', icon: '🥉', bonus: '0%' },
        { name: 'Silver', days: '8-30', rate: '60 XP/day', icon: '🥈', bonus: '+20%' },
        { name: 'Gold', days: '31-90', rate: '75 XP/day', icon: '🥇', bonus: '+50%' },
        { name: 'Diamond', days: '90+', rate: '100 XP/day', icon: '💎', bonus: '+100%' }
    ]

    async function handleStake(tokenId) {
        if (!nftContract || !stakingContract) return

        try {
            setProcessing(true)

            // First approve NFT
            console.log('Approving NFT...')
            const approveTx = await nftContract.approve(STAKING_CONTRACT, tokenId)
            await approveTx.wait()

            // Then stake
            console.log('Staking NFT...')
            const stakeTx = await stakingContract.stake(tokenId)
            await stakeTx.wait()

            alert(`Successfully staked NFT #${tokenId}!`)
            setShowStakeModal(false)

            // Refresh page
            globalThis.location.reload()

        } catch (error) {
            console.error('Stake error:', error)

            let errorMessage = 'Failed to stake NFT'
            if (error.message.includes('user rejected')) {
                errorMessage = 'Transaction cancelled by user'
            } else if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient MATIC for gas'
            }

            alert(errorMessage)
        } finally {
            setProcessing(false)
        }
    }

    async function handleClaim(tokenId) {
        if (!stakingContract) return

        try {
            setProcessing(true)

            const tx = await stakingContract.claimRewards(tokenId)
            await tx.wait()

            alert(`Successfully claimed rewards for NFT #${tokenId}!`)

            // Refresh page
            globalThis.location.reload()

        } catch (error) {
            console.error('Claim error:', error)
            alert('Failed to claim rewards')
        } finally {
            setProcessing(false)
        }
    }

    async function handleUnstake(tokenId) {
        if (!stakingContract) return

        const confirmed = confirm('Are you sure you want to unstake? This will automatically claim your rewards.')
        if (!confirmed) return

        try {
            setProcessing(true)

            const tx = await stakingContract.unstake(tokenId)
            await tx.wait()

            alert(`Successfully unstaked NFT #${tokenId}!`)

            // Refresh page
            globalThis.location.reload()

        } catch (error) {
            console.error('Unstake error:', error)
            alert('Failed to unstake NFT')
        } finally {
            setProcessing(false)
        }
    }

    if (!account) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                        <p className="text-slate-400">Please connect your wallet to access staking</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">🔒 Staking Pool</h1>
                <p className="text-slate-400 mb-8">Stake your EvoNFTs to earn passive XP and MATIC rewards</p>

                {/* Pool Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {poolStats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: poolStats.indexOf(stat) * 0.1 }}
                            className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                            <div className="text-slate-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setShowStakeModal(true)}
                        disabled={unstakedNFTs.length === 0 || processing}
                        className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Stake NFTs ({unstakedNFTs.length} available)
                    </button>

                    <button
                        onClick={() => setShowRewardsModal(true)}
                        disabled={userStakes.length === 0 || processing}
                        className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        💰 View All Rewards
                    </button>

                    <button
                        onClick={() => setShowCalculatorModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold transition-all"
                    >
                        📊 Staking Calculator
                    </button>

                    <button
                        onClick={() => setShowUnstakeModal(true)}
                        disabled={userStakes.length === 0 || processing}
                        className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🔓 Manage Unstaking
                    </button>
                </div>

                {/* Staked NFTs */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Your Staked NFTs ({userStakes.length})</h2>

                    {stakingLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin text-4xl mb-2">⟳</div>
                            <p className="text-slate-400">Loading staked NFTs...</p>
                        </div>
                    ) : (
                        renderStakedNFTsContent()
                    )}
                </div>

                {/* Staking Tiers */}
                <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-2xl font-bold mb-6">Staking Tiers & Bonuses</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {tiers.map((tier) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tiers.indexOf(tier) * 0.1 }}
                                className="glass rounded-xl p-4 text-center border border-slate-700/50"
                            >
                                <div className="text-4xl mb-2">{tier.icon}</div>
                                <div className="font-semibold mb-1">{tier.name}</div>
                                <div className="text-sm text-slate-400 mb-2">{tier.days} days</div>
                                <div className="text-sm text-secondary-500 font-semibold">{tier.rate}</div>
                                <div className="text-xs text-accent-400">{tier.bonus}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass rounded-xl p-4">
                        <h3 className="font-semibold mb-3">Additional Bonuses:</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Stake 5+ NFTs: +10% XP</li>
                            <li>• Stake Rare/Epic: +25% XP</li>
                            <li>• Stake Legendary: +50% XP</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Stake Modal */}
            {showStakeModal && (
                <StakeModal
                    unstakedNFTs={unstakedNFTs}
                    onClose={() => setShowStakeModal(false)}
                    onStake={handleStake}
                    processing={processing}
                />
            )}

            {/* Rewards Modal */}
            {showRewardsModal && (
                <RewardsModal
                    userStakes={userStakes}
                    onClose={() => setShowRewardsModal(false)}
                    onClaim={handleClaim}
                    processing={processing}
                />
            )}

            {/* Unstake Modal */}
            {showUnstakeModal && (
                <UnstakeModal
                    userStakes={userStakes}
                    onClose={() => setShowUnstakeModal(false)}
                    onUnstake={handleUnstake}
                    processing={processing}
                />
            )}

            {/* Calculator Modal */}
            {showCalculatorModal && (
                <StakingCalculatorModal
                    isOpen={showCalculatorModal}
                    onClose={() => setShowCalculatorModal(false)}
                />
            )}
        </div>
    )
}

// Modal Components
function StakeModal({ unstakedNFTs, onClose, onStake, processing }) {
    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">🔒 Stake NFTs</h2>
                        <p className="text-slate-400">Select NFTs to stake and earn passive rewards</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {unstakedNFTs.length > 0 ? (
                    <>
                        <div className="glass rounded-xl p-4 mb-6">
                            <h3 className="font-semibold mb-2">💡 Staking Benefits:</h3>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• Earn 50-100 XP per day based on staking duration</li>
                                <li>• Receive MATIC rewards proportional to your stake</li>
                                <li>• Unlock tier bonuses for longer staking periods</li>
                                <li>• Multiple NFT bonuses for staking 5+ NFTs</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unstakedNFTs.map((nft) => (
                                <motion.div
                                    key={nft.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass rounded-xl p-4 text-center hover:border-primary-500/50 transition-all"
                                >
                                    <img
                                        src={nft.image}
                                        alt={nft.name}
                                        className="w-full aspect-square object-cover rounded-lg mb-3"
                                    />
                                    <h3 className="font-semibold mb-1">{nft.name}</h3>
                                    <p className="text-sm text-slate-400 mb-1">#{nft.id}</p>
                                    <p className="text-sm text-secondary-500 mb-3">Level {nft.level || 1}</p>

                                    <div className="text-xs text-slate-400 mb-3">
                                        Expected: 50+ XP/day
                                    </div>

                                    <button
                                        onClick={() => onStake(nft.id)}
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg font-semibold transition-all disabled:opacity-50"
                                    >
                                        {processing ? '⏳ Staking...' : '🔒 Stake NFT'}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No NFTs Available</h3>
                        <p className="text-slate-400">All your NFTs are already staked or you don't own any NFTs yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function RewardsModal({ userStakes, onClose, onClaim, processing }) {
    const [totalXP, setTotalXP] = useState(0)
    const [totalMATIC, setTotalMATIC] = useState(0)

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-secondary-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">💰 Rewards Overview</h2>
                        <p className="text-slate-400">View and claim all your staking rewards</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Total Rewards Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="text-2xl font-bold text-secondary-500">{totalXP}</div>
                        <div className="text-slate-400">Total Pending XP</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">💎</div>
                        <div className="text-2xl font-bold text-accent-500">{totalMATIC.toFixed(4)}</div>
                        <div className="text-slate-400">Total Pending MATIC</div>
                    </div>
                </div>

                {userStakes.length > 0 ? (
                    <div className="space-y-4">
                        {userStakes.map((tokenId) => (
                            <RewardNFTCard
                                key={tokenId}
                                tokenId={tokenId}
                                onClaim={() => onClaim(tokenId)}
                                processing={processing}
                                onRewardsUpdate={(xp, matic) => {
                                    setTotalXP(prev => prev + Number(xp))
                                    setTotalMATIC(prev => prev + Number(matic))
                                }}
                            />
                        ))}

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => {
                                    for (const tokenId of userStakes) {
                                        onClaim(tokenId)
                                    }
                                }}
                                disabled={processing || totalXP === 0}
                                className="px-8 py-3 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 rounded-xl font-semibold transition-all disabled:opacity-50"
                            >
                                {processing ? '⏳ Claiming...' : '💰 Claim All Rewards'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold mb-2">No Staked NFTs</h3>
                        <p className="text-slate-400">Stake some NFTs first to start earning rewards!</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function UnstakeModal({ userStakes, onClose, onUnstake, processing }) {
    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-slate-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">🔓 Manage Unstaking</h2>
                        <p className="text-slate-400">Unstake NFTs and automatically claim rewards</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-2xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="glass rounded-xl p-4 mb-6 border border-yellow-500/30">
                    <h3 className="font-semibold mb-2 text-yellow-400">⚠️ Important Notice:</h3>
                    <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Unstaking will automatically claim all pending rewards</li>
                        <li>• You'll lose tier bonuses and need to restart staking duration</li>
                        <li>• Consider claiming rewards first if you want to continue staking</li>
                    </ul>
                </div>

                {userStakes.length > 0 ? (
                    <div className="space-y-4">
                        {userStakes.map((tokenId) => (
                            <UnstakeNFTCard
                                key={tokenId}
                                tokenId={tokenId}
                                onUnstake={() => onUnstake(tokenId)}
                                processing={processing}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔓</div>
                        <h3 className="text-xl font-semibold mb-2">No Staked NFTs</h3>
                        <p className="text-slate-400">You don't have any NFTs to unstake.</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function RewardNFTCard({ tokenId, onClaim, processing, onRewardsUpdate }) {
    const { stakeInfo, pendingRewards, tier, loading } = useStakingInfo(tokenId)

    // Update parent component with rewards data
    useEffect(() => {
        if (pendingRewards && onRewardsUpdate) {
            onRewardsUpdate(pendingRewards.xp, pendingRewards.matic)
        }
    }, [pendingRewards, onRewardsUpdate])

    if (loading) {
        return (
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }

    const hasRewards = pendingRewards && (pendingRewards.xp > 0 || Number.parseFloat(pendingRewards.matic) > 0)

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-slate-700/50 hover:border-secondary-500/50 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center text-lg font-bold">
                    #{tokenId}
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold">EvoNFT #{tokenId}</h3>
                    <p className="text-sm text-slate-400">
                        {tier && `${tier.name} Tier • `}
                        {stakeInfo ? `${stakeInfo.daysStaked} days staked` : 'Loading...'}
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-sm text-secondary-500 font-semibold">
                        {pendingRewards ? `${pendingRewards.xp} XP` : '-'}
                    </div>
                    <div className="text-sm text-accent-500 font-semibold">
                        {pendingRewards ? `${Number.parseFloat(pendingRewards.matic).toFixed(4)} MATIC` : '-'}
                    </div>
                </div>

                <button
                    onClick={onClaim}
                    disabled={processing || !hasRewards}
                    className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? '⏳' : '💰 Claim'}
                </button>
            </div>
        </motion.div>
    )
}

function UnstakeNFTCard({ tokenId, onUnstake, processing }) {
    const { stakeInfo, pendingRewards, tier, loading } = useStakingInfo(tokenId)

    if (loading) {
        return (
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4 border border-slate-700/50 hover:border-slate-500/50 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-lg flex items-center justify-center text-lg font-bold">
                    #{tokenId}
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold">EvoNFT #{tokenId}</h3>
                    <p className="text-sm text-slate-400">
                        {tier && `${tier.name} Tier • `}
                        {stakeInfo ? `${stakeInfo.daysStaked} days staked` : 'Loading...'}
                    </p>
                    <p className="text-xs text-yellow-400">
                        Will claim: {pendingRewards ? `${pendingRewards.xp} XP + ${Number.parseFloat(pendingRewards.matic).toFixed(4)} MATIC` : 'Loading...'}
                    </p>
                </div>

                <button
                    onClick={onUnstake}
                    disabled={processing}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? '⏳ Unstaking...' : '🔓 Unstake'}
                </button>
            </div>
        </motion.div>
    )
}

function StakedNFTCard({ tokenId, onClaim, onUnstake, processing }) {
    const { stakeInfo, pendingRewards, tier, loading } = useStakingInfo(tokenId)

    if (loading) {
        return (
            <div className="glass-strong rounded-xl p-6 border border-slate-700/50">
                <div className="animate-pulse flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-6 border border-slate-700/50 hover:border-primary-500/50 transition-all"
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center text-2xl">
                    #{tokenId}
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg">EvoNFT #{tokenId}</h3>
                        <p className="text-slate-400 text-sm">
                            {tier && `${tier.name} Tier (${tier.bonus / 100}% bonus)`}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-slate-400">Staked</div>
                            <div className="font-semibold">
                                {stakeInfo ? `${stakeInfo.daysStaked} days` : '-'}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-400">Pending XP</div>
                            <div className="font-semibold text-secondary-500">
                                {pendingRewards ? pendingRewards.xp : '-'}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-400">Pending MATIC</div>
                            <div className="font-semibold text-accent-500">
                                {pendingRewards ? `${Number.parseFloat(pendingRewards.matic).toFixed(4)}` : '-'}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-400">Actions</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={onClaim}
                                    disabled={processing || !pendingRewards || (pendingRewards.xp === 0 && Number.parseFloat(pendingRewards.matic) === 0)}
                                    className="px-3 py-1 bg-secondary-500 hover:bg-secondary-600 rounded text-xs font-semibold transition disabled:opacity-50"
                                >
                                    Claim
                                </button>
                                <button
                                    onClick={onUnstake}
                                    disabled={processing}
                                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs font-semibold transition disabled:opacity-50"
                                >
                                    Unstake
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// PropTypes removed - install prop-types package if you need runtime type checking
// Run: npm install prop-types