import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { useNFT } from '../hooks/useContract'
import { useNFTStats } from '../hooks/useExtendedContract'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useNFTVisuals } from '../hooks/useNFTVisuals'
import { useNFTHistory } from '../hooks/useNFTHistory'
import { useListing, useMarketplace } from '../hooks/useMarketplace'
import { requestEvolution, calculateSignals } from '../services/evolutionService'
import FeedModal from '../components/FeedModal'
import TrainModal from '../components/TrainModal'
import ListForSaleModal from '../components/ListForSaleModal'
import BuyNFTModal from '../components/BuyNFTModal'
import ListingBadge from '../components/ListingBadge'
import NetworkSwitcher from '../components/NetworkSwitcher'

export default function NFTDetail() {
    const { id } = useParams()
    const { provider, account } = useWeb3()
    const [refreshKey, setRefreshKey] = useState(0)

    const tokenId = parseInt(id)

    const { nft: rawNft, loading: nftLoading } = useNFT(tokenId)
    const { stats, progress, loading: statsLoading } = useNFTStats(tokenId, refreshKey)
    const { history, loading: historyLoading } = useNFTHistory(tokenId)
    const { listing } = useListing(tokenId)
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
    const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
    const [isEvolving, setIsEvolving] = useState(false)

    const refreshData = () => {
        setRefreshKey(prev => prev + 1)
    }

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

    // Update current time every second for countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Math.floor(Date.now() / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const [forceShowContent, setForceShowContent] = useState(false)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setForceShowContent(true);
        }, 10000);
        
        return () => clearTimeout(timer);
    }, [nftLoading, statsLoading, rawNft, stats]);

    const loading = (nftLoading || statsLoading) && !forceShowContent

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin text-6xl mb-4">⟳</div>
                        <p className="text-slate-400">Loading NFT...</p>
                        <p className="text-xs text-slate-500 mt-2">If this takes too long, check your MetaMask RPC connection</p>
                    </div>
                </div>
            </div>
        )
    }

    // Create fallback NFT if loading failed
    const fallbackNFT = !nft && !loading ? {
        id: id,
        name: `EvoNFT #${id}`,
        description: 'An evolving digital companion',
        image: `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${id}`,
        owner: account,
        level: 1,
        rarity: 'common',
        version: 1,
        canEvolve: false,
        xp: 0,
        attributes: []
    } : null;

    const displayNFT = nft || fallbackNFT;

    // Check ownership and listing status
    const isOwner = account && displayNFT && account.toLowerCase() === displayNFT.owner?.toLowerCase()
    
    // Check listing status
    const isListed = listing?.active
    
    // Check ownership
    const isActualOwner = account && displayNFT.owner && account.toLowerCase() === displayNFT.owner.toLowerCase()

    // Get level from attributes or progress
    const level = progress?.currentLevel || displayNFT.attributes?.find(a => a.trait_type === 'level')?.value || 1
    const rarity = displayNFT.attributes?.find(a => a.trait_type === 'rarity')?.value || 'common'

    // Handle evolution
    const handleEvolveClick = async () => {
        if (!provider || !account) {
            alert('Please connect your wallet');
            return;
        }

        setIsEvolving(true);

        try {
            const signals = calculateSignals({ ...nft, level, stats });
            const evolutionData = await requestEvolution(id, signals);

            if (!evolutionData.success) {
                throw new Error(evolutionData.error || 'Evolution request failed');
            }

            // Get contract with signer
            const signer = await provider.getSigner();
            const contractABI = [
                "function requestEvolve(uint256 tokenId, string calldata newURI, uint256 deadline, bytes calldata signature) external"
            ];
            const contract = new ethers.Contract(
                import.meta.env.VITE_NFT_CONTRACT,
                contractABI,
                signer
            );

            const tx = await contract.requestEvolve(
                id,
                evolutionData.newMetadataURI,
                evolutionData.deadline,
                evolutionData.signature
            );

            await tx.wait();

            alert(`🎉 Evolution Successful!\n\nYour NFT has evolved to ${evolutionData.evolutionType} form!\n\nTransaction: ${tx.hash}`);

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('❌ Evolution error:', error);

            let errorMessage = 'Evolution failed: ';
            if (error.message.includes('Not eligible')) {
                errorMessage += 'NFT is not eligible for evolution yet. Please wait for cooldown period.';
            } else if (error.message.includes('Insufficient activity')) {
                errorMessage += 'Insufficient activity score. Keep interacting with your NFT!';
            } else if (error.message.includes('user rejected')) {
                errorMessage += 'Transaction was rejected.';
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
        } finally {
            setIsEvolving(false);
        }
    };

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
                                src={displayNFT.image || `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${id}`}
                                alt={displayNFT.name}
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
                                <h1 className="text-4xl font-bold mb-2">{displayNFT.name}</h1>
                                <p className="text-slate-400">Owned by: {isActualOwner ? 'You' : `${displayNFT.owner?.slice(0,6)}...${displayNFT.owner?.slice(-4)}`}</p>
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

                            {/* Marketplace Status */}
                            {isListed && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-green-400 font-semibold">💰 Listed for Sale</span>
                                        <span className="text-2xl font-bold text-green-400">{listing.price} MATIC</span>
                                    </div>
                                    {!isActualOwner && (
                                        <button 
                                            onClick={() => setShowBuyModal(true)}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-bold transition-all"
                                        >
                                            🛒 Buy Now for {listing.price} MATIC
                                        </button>
                                    )}
                                    {isActualOwner && (
                                        <div className="text-center text-green-300 py-2">
                                            You own this NFT
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {!isListed && (
                                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-center mb-4">
                                    <span className="text-slate-400">This NFT is not for sale</span>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                {isActualOwner && !isListed && (
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
                                        <Link
                                            to="/staking"
                                            className="px-6 py-4 glass-strong hover:glass rounded-xl font-semibold transition-all hover:scale-105 border border-slate-600 hover:border-primary-500 text-center"
                                        >
                                            💎 Stake
                                        </Link>
                                        <button
                                            onClick={() => setShowListModal(true)}
                                            className="px-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-xl font-semibold transition-all hover:scale-105"
                                        >
                                            💰 List for Sale
                                        </button>
                                    </>
                                )}

                                {isActualOwner && isListed && (
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


                            </div>

                            {/* Stats */}
                            <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Stats & Attributes</h3>
                                    <span className="text-xs text-slate-400">💪 Train to increase</span>
                                </div>
                                {statsLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin text-2xl mb-2">⟳</div>
                                        <p className="text-xs text-slate-400">Loading stats...</p>
                                    </div>
                                ) : stats ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-xs text-yellow-400">⚠️ Cannot load stats - RPC timeout</p>
                                        <button
                                            onClick={refreshData}
                                            className="mt-2 text-xs text-primary-400 hover:text-primary-300"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Traits - Visual Characteristics */}
                            {displayNFT.traits && displayNFT.traits.length > 0 && (
                                <div className="glass-strong rounded-xl border border-slate-700/50 p-6">
                                    <h3 className="font-semibold mb-4">Visual Traits</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {displayNFT.traits.map((trait) => {
                                            // Handle both string traits and object traits
                                            const traitType = typeof trait === 'object' ? trait.trait_type : 'Trait'
                                            const traitValue = typeof trait === 'string' ? trait : trait.value
                                            const traitKey = typeof trait === 'string' ? trait : `${trait.trait_type}-${trait.value}`

                                            // Skip stats that are already shown in Stats & Attributes
                                            if (['Power', 'Speed', 'Intelligence', 'level'].includes(traitType)) {
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Can Evolve:</span>
                                        <span className={displayNFT.canEvolve ? 'text-secondary-500 font-semibold' : 'text-slate-500'}>
                                            {displayNFT.canEvolve ? '✅ Ready' : '⏳ Cooldown'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Version:</span>
                                        <span className="font-semibold">{displayNFT.version || 1}</span>
                                    </div>
                                    {displayNFT.nextEvolveTime && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">
                                                {displayNFT.canEvolve ? 'Last Evolved:' : 'Next Evolution:'}
                                            </span>
                                            <span className="text-sm">
                                                {(() => {
                                                    const now = Math.floor(Date.now() / 1000);
                                                    const nextTime = displayNFT.nextEvolveTime;

                                                    // If can evolve (time has passed), show "Ready Now"
                                                    if (displayNFT.canEvolve || nextTime <= now) {
                                                        return <span className="text-secondary-500 font-semibold">Ready Now!</span>;
                                                    }

                                                    // Otherwise show the next evolution time
                                                    return new Date(nextTime * 1000).toLocaleString();
                                                })()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Countdown Timer if in cooldown */}
                                    {!displayNFT.canEvolve && displayNFT.nextEvolveTime && (
                                        <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                            <div className="text-xs text-slate-400 mb-1">Time Remaining:</div>
                                            <div className="text-sm font-mono text-primary-400">
                                                {(() => {
                                                    const remaining = displayNFT.nextEvolveTime - currentTime;

                                                    if (remaining <= 0) {
                                                        return <span className="text-secondary-500 font-bold">Ready!</span>;
                                                    }

                                                    const hours = Math.floor(remaining / 3600);
                                                    const minutes = Math.floor((remaining % 3600) / 60);
                                                    const seconds = remaining % 60;

                                                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                                                })()}
                                            </div>
                                            {/* Progress Bar */}
                                            {(() => {
                                                const totalCooldown = 86400; // 24 hours in seconds
                                                const elapsed = totalCooldown - (displayNFT.nextEvolveTime - currentTime);
                                                const progress = Math.max(0, Math.min(100, (elapsed / totalCooldown) * 100));

                                                return (
                                                    <div className="mt-2">
                                                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                                                            <div
                                                                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all duration-1000"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1 text-right">
                                                            {progress.toFixed(1)}% complete
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Evolution Info */}
                                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <p className="text-xs text-slate-400">
                                            {displayNFT.canEvolve
                                                ? '🧬 Your NFT is ready to evolve! Evolution will change its appearance and increase its version.'
                                                : '⏳ Evolution requires a 24-hour cooldown period between each transformation.'
                                            }
                                        </p>
                                    </div>

                                    {/* Evolve Button */}
                                    {displayNFT.canEvolve && isOwner && (
                                        <div className="mt-4">
                                            <button
                                                onClick={handleEvolveClick}
                                                disabled={isEvolving}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isEvolving ? '🔄 Evolving...' : '🧬 Evolve Now'}
                                            </button>
                                            <p className="text-xs text-center text-slate-500 mt-2">
                                                Evolution is AI-driven and requires backend signature
                                            </p>
                                        </div>
                                    )}

                                    {/* Not Owner Message */}
                                    {displayNFT.canEvolve && !isOwner && (
                                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                            <p className="text-xs text-yellow-400">
                                                ⚠️ Only the owner can evolve this NFT
                                            </p>
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
                                {displayNFT.description || 'This EvoNFT is a unique digital companion that grows and evolves based on your interactions. Feed it, train it, and watch it transform into something amazing!'}
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Token ID:</span>
                                    <span className="ml-2 font-mono">{displayNFT.id}</span>
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
                }}
                onSuccess={() => {
                    refreshData();
                }}
                tokenId={id}
                nftName={displayNFT.name}
            />

            <TrainModal
                isOpen={showTrainModal}
                onClose={() => {
                    setShowTrainModal(false);
                }}
                onSuccess={() => {
                    refreshData();
                }}
                tokenId={id}
                nftName={displayNFT.name}
            />

            <ListForSaleModal
                isOpen={showListModal}
                onClose={() => {
                    setShowListModal(false);
                }}
                tokenId={id}
                nftName={displayNFT.name}
                onSuccess={() => {
                    globalThis.location.reload();
                }}
            />

            <BuyNFTModal
                isOpen={showBuyModal}
                onClose={() => {
                    setShowBuyModal(false);
                }}
                nft={displayNFT}
                listing={listing}
                onSuccess={() => {
                    globalThis.location.reload();
                }}
            />
        </div>
    )
}