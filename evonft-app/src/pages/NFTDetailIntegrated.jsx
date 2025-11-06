import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNFT } from '../hooks/useContract'
import { useNFTStats } from '../hooks/useExtendedContract'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useNFTVisuals } from '../hooks/useNFTVisuals'
import { useNFTHistory } from '../hooks/useNFTHistory'
import { useListing, useMarketplace } from '../hooks/useMarketplace'
import FeedModal from '../components/FeedModal'
import TrainModal from '../components/TrainModal'
import ListForSaleModal from '../components/ListForSaleModal'
import BuyNFTModal from '../components/BuyNFTModal'
import ListingBadge from '../components/ListingBadge'
import NetworkSwitcher from '../components/NetworkSwitcher'

export default function NFTDetail() {
    const { id } = useParams()
    const { provider, account } = useWeb3()
    const { nft: rawNft, loading: nftLoading } = useNFT(id)
    const { stats, progress, loading: statsLoading } = useNFTStats(id)
    const { history, loading: historyLoading } = useNFTHistory(id)
    const { listing } = useListing(id)
    const { contractWithSigner: marketplaceContract } = useMarketplace()

    // Generate visual for single NFT - use useMemo to prevent infinite loop
    const nftArray = useMemo(() => rawNft ? [rawNft] : [], [rawNft])
    const { visualNFTs } = useNFTVisuals(nftArray)
    const nft = useMemo(() => visualNFTs[0] || rawNft, [visualNFTs, rawNft])
    const [activeTab, setActiveTab] = useState('overview')
    const [showFeedModal, setShowFeedModal] = useState(false)
    const [showTrainModal, setShowTrainModal] = useState(false)
    const [showListModal, setShowListModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [currentChainId, setCurrentChainId] = useState(null)

    const isOwner = account && nft && account.toLowerCase() === nft.owner?.toLowerCase()
    const isListed = listing?.active

    // Get current chain ID
    useEffect(() => {
        if (provider) {
            provider.getNetwork().then(network => {
                setCurrentChainId(Number(network.chainId))
            }).catch(err => {
                console.error('Error getting network:', err)
            })
        }
    }, [provider])

    const loading = nftLoading || statsLoading

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading NFT...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!nft) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold mb-2">NFT Not Found</h3>
                        <p className="text-slate-400 mb-6">This NFT doesn't exist or hasn't been minted yet.</p>
                        <Link
                            to="/my-nfts"
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition"
                        >
                            Back to Collection
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Get level from attributes or progress
    const level = progress?.currentLevel || nft.attributes?.find(a => a.trait_type === 'level')?.value || 1
    const rarity = nft.attributes?.find(a => a.trait_type === 'rarity')?.value || 'common'

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Network Switcher */}
            <NetworkSwitcher
                currentChainId={currentChainId}
                onSwitch={() => globalThis.location.reload()}
            />

            <div className="max-w-7xl mx-auto">
                <Link to="/my-nfts" className="text-primary-400 hover:text-primary-300 mb-6 inline-block">
                    ← Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image */}
                    <div>
                        <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <img
                                src={nft.image || `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${id}`}
                                alt={nft.name}
                                className="w-full rounded-xl"
                                onError={(e) => {
                                    console.error('Image load error:', e.target.src);
                                    e.target.src = `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${id}`;
                                }}
                            />
                            <div className="flex gap-2 mt-4 justify-center">
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">⟲</button>
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">📷</button>
                                <button className="p-3 glass rounded-lg hover:glass-strong transition">🔍</button>
                            </div>
                        </div>

                        {/* Evolution Timeline */}
                        <div className="mt-6 glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Evolution Timeline</h3>
                            <div className="flex items-center justify-between">
                                {[1, 5, 10, 20, 'Max'].map((levelMark) => (
                                    <div key={`level-${levelMark}`} className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${level >= levelMark ? 'bg-primary-500' : 'bg-slate-700'
                                            }`}></div>
                                        <span className="text-xs mt-1">Lvl {levelMark}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
                                <p className="text-slate-400">Owned by: You</p>
                            </div>

                            {/* Level & XP */}
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold">Level {level}</span>
                                    <span className="text-primary-400 text-lg">⭐⭐⭐ {rarity}</span>
                                </div>

                                {progress && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span>XP: {progress.currentXP} / {progress.xpForNextLevel}</span>
                                            <span>{progress.xpProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all"
                                                style={{ width: `${progress.xpProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Listing Badge */}
                            {isListed && (
                                <div className="mb-4">
                                    <ListingBadge tokenId={id} variant="card" />
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                {isOwner && !isListed && (
                                    <>
                                        <button
                                            onClick={() => setShowFeedModal(true)}
                                            className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-semibold transition-all hover:scale-105"
                                        >
                                            🍖 Feed
                                        </button>
                                        <button
                                            onClick={() => setShowTrainModal(true)}
                                            className="px-6 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 rounded-xl font-semibold transition-all hover:scale-105"
                                        >
                                            💪 Train
                                        </button>
                                        <button className="px-6 py-4 glass-strong hover:glass rounded-xl font-semibold transition-all hover:scale-105 border border-slate-600 hover:border-primary-500">
                                            🔒 Stake
                                        </button>
                                        <button
                                            onClick={() => setShowListModal(true)}
                                            className="px-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-xl font-semibold transition-all hover:scale-105"
                                        >
                                            💰 List for Sale
                                        </button>
                                    </>
                                )}

                                {isOwner && isListed && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Cancel listing?')) {
                                                try {
                                                    const tx = await marketplaceContract.cancelListing(id);
                                                    await tx.wait();
                                                    alert('Listing cancelled!');
                                                    globalThis.location.reload();
                                                } catch (error) {
                                                    console.error('Cancel error:', error);
                                                    alert('Failed to cancel listing');
                                                }
                                            }
                                        }}
                                        className="col-span-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-all"
                                    >
                                        ❌ Cancel Listing
                                    </button>
                                )}

                                {!isOwner && isListed && (
                                    <button
                                        onClick={() => setShowBuyModal(true)}
                                        className="col-span-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition-all hover:scale-105 text-lg"
                                    >
                                        🛒 Buy for {listing.price} MATIC
                                    </button>
                                )}

                                {!isOwner && !isListed && (
                                    <div className="col-span-2 text-center py-4 glass-strong rounded-xl border border-slate-700">
                                        <p className="text-slate-400">This NFT is not for sale</p>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            {stats && (
                                <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Stats & Attributes</h3>
                                        <span className="text-xs text-slate-400">💪 Train to increase</span>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(stats).map(([statName, value]) => (
                                            <div key={statName}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="capitalize">{statName}:</span>
                                                    <span className="font-bold">{value}/100</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${value}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {Object.values(stats).every(v => v === 5) && (
                                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                            <p className="text-xs text-slate-400">
                                                ℹ️ All stats start at 5. Use <span className="text-secondary-400 font-semibold">Train</span> to increase specific stats!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Traits - Visual Characteristics */}
                            {nft.traits && nft.traits.length > 0 && (
                                <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                    <h3 className="font-semibold mb-4">Visual Traits</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {nft.traits.map((trait) => {
                                            // Handle both string traits and object traits
                                            const traitType = typeof trait === 'object' ? trait.trait_type : 'Trait'
                                            const traitValue = typeof trait === 'string' ? trait : trait.value
                                            const traitKey = typeof trait === 'string' ? trait : `${trait.trait_type}-${trait.value}`

                                            // Skip stats that are already shown in Stats & Attributes
                                            if (['Power', 'Speed', 'Intelligence'].includes(traitType)) {
                                                return null
                                            }

                                            return (
                                                <div
                                                    key={traitKey}
                                                    className="px-4 py-3 glass rounded-lg hover:glass-strong transition-all"
                                                >
                                                    <div className="text-xs text-slate-400 mb-1">{traitType}</div>
                                                    <div className="font-semibold">{traitValue}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Evolution Status */}
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <h3 className="font-semibold mb-4">Evolution Status</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Can Evolve:</span>
                                        <span className={nft.canEvolve ? 'text-secondary-500' : 'text-slate-500'}>
                                            {nft.canEvolve ? '✅ Ready' : '⏳ Cooldown'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Version:</span>
                                        <span className="font-semibold">{nft.version}</span>
                                    </div>
                                    {nft.nextEvolveTime && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Next Evolution:</span>
                                            <span className="text-sm">
                                                {new Date(nft.nextEvolveTime * 1000).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <div className="flex gap-4 border-b border-slate-700 mb-6">
                        {['overview', 'history', 'activity'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 font-medium transition ${activeTab === tab
                                    ? 'text-primary-400 border-b-2 border-primary-400'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Description</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {nft.description || 'This EvoNFT is a unique digital companion that grows and evolves based on your interactions. Feed it, train it, and watch it transform into something amazing!'}
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Token ID:</span>
                                    <span className="ml-2 font-mono">{nft.id}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Generation:</span>
                                    <span className="ml-2">1</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Rarity:</span>
                                    <span className="ml-2 capitalize">{rarity}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Level:</span>
                                    <span className="ml-2">{level}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {historyLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin text-4xl mb-2">⟳</div>
                                    <p className="text-slate-400">Loading history...</p>
                                </div>
                            ) : (
                                <>
                                    {history.length > 0 ? (
                                        history.map((activity) => (
                                            <div key={activity.txHash} className="glass-strong rounded-xl border border-slate-700/50 p-6 hover:border-primary-500/30 transition-all">
                                                <div className="flex items-start gap-4">
                                                    <span className="text-3xl">{activity.icon}</span>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-lg">{activity.title}</div>
                                                        <div className="text-sm text-slate-400 mb-2">{activity.description}</div>

                                                        {activity.xp && (
                                                            <div className="text-xs text-secondary-400 mb-1">
                                                                +{activity.xp} XP
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                                            <span>{new Date(activity.timestamp * 1000).toLocaleString()}</span>
                                                            <a
                                                                href={`https://amoy.polygonscan.com/tx/${activity.txHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary-400 hover:text-primary-300 transition"
                                                            >
                                                                View TX ↗
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 glass-strong rounded-xl border border-slate-700/50">
                                            <div className="text-6xl mb-4">📜</div>
                                            <h3 className="text-xl font-semibold mb-2">No Activity Yet</h3>
                                            <p className="text-slate-400">Feed or train your NFT to see activity here!</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <FeedModal
                isOpen={showFeedModal}
                onClose={() => {
                    setShowFeedModal(false);
                    // Reload page to refresh NFT data
                    globalThis.location.reload();
                }}
                tokenId={id}
                nftName={nft.name}
            />

            <TrainModal
                isOpen={showTrainModal}
                onClose={() => {
                    setShowTrainModal(false);
                    // Reload page to refresh NFT data
                    globalThis.location.reload();
                }}
                tokenId={id}
                nftName={nft.name}
            />

            <ListForSaleModal
                isOpen={showListModal}
                onClose={() => {
                    setShowListModal(false);
                }}
                tokenId={id}
                nftName={nft.name}
                onSuccess={() => {
                    globalThis.location.reload();
                }}
            />

            <BuyNFTModal
                isOpen={showBuyModal}
                onClose={() => {
                    setShowBuyModal(false);
                }}
                nft={nft}
                listing={listing}
                onSuccess={() => {
                    globalThis.location.reload();
                }}
            />
        </div>
    )
}