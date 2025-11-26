import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../context/RainbowWeb3Context'
import { useMyNFTs } from '../hooks/useContract'
import { ethers } from 'ethers'
import NetworkSwitcher from '../components/NetworkSwitcher'

export default function Profile() {
    const { account, provider, disconnectWallet } = useWeb3()
    const { nfts, loading } = useMyNFTs()
    const [activeTab, setActiveTab] = useState('activity')
    const [currentChainId, setCurrentChainId] = useState(null)
    const [balance, setBalance] = useState('0')

    // Profile settings state
    const [profileSettings, setProfileSettings] = useState({
        username: '',
        bio: '',
        email: '',
        twitter: '',
        discord: ''
    })

    // Notification settings state
    const [notificationSettings, setNotificationSettings] = useState({
        evolution: true,
        breeding: true,
        staking: true,
        marketplace: true,
        email: false
    })

    // UI state
    const [isSaving, setIsSaving] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('success') // 'success' or 'error'

    // Load saved settings from localStorage
    useEffect(() => {
        if (account) {
            const savedProfile = localStorage.getItem(`profile_${account}`)
            const savedNotifications = localStorage.getItem(`notifications_${account}`)

            if (savedProfile) {
                try {
                    setProfileSettings(JSON.parse(savedProfile))
                } catch (err) {
                    console.error('Error loading profile:', err)
                }
            } else {
                // Reset to defaults when switching accounts
                setProfileSettings({
                    username: '',
                    bio: '',
                    email: '',
                    twitter: '',
                    discord: ''
                })
            }

            if (savedNotifications) {
                try {
                    setNotificationSettings(JSON.parse(savedNotifications))
                } catch (err) {
                    console.error('Error loading notifications:', err)
                }
            } else {
                // Reset to defaults when switching accounts
                setNotificationSettings({
                    evolution: true,
                    breeding: true,
                    staking: true,
                    marketplace: true,
                    email: false
                })
            }
        }
    }, [account])

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

    // Get wallet balance
    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then(bal => {
                setBalance(ethers.formatEther(bal))
            }).catch(err => {
                console.error('Error getting balance:', err)
            })
        }
    }, [provider, account])

    // Helper functions
    const formatAddress = (addr) => {
        if (!addr) return '0x0000...0000'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    // Show toast notification
    const showNotification = (message, type = 'success') => {
        setToastMessage(message)
        setToastType(type)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    // Save profile settings
    const handleSaveProfile = async () => {
        if (!account) {
            showNotification('Please connect your wallet first', 'error')
            return
        }

        // Validation
        if (!profileSettings.username || profileSettings.username.trim().length < 3) {
            showNotification('Username must be at least 3 characters', 'error')
            return
        }

        if (profileSettings.email && !profileSettings.email.includes('@')) {
            showNotification('Please enter a valid email address', 'error')
            return
        }

        setIsSaving(true)

        try {
            // Save to localStorage
            localStorage.setItem(`profile_${account}`, JSON.stringify(profileSettings))

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500))

            showNotification('Profile settings saved successfully! ✅', 'success')
        } catch (error) {
            console.error('Error saving profile:', error)
            showNotification('Failed to save profile settings', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    // Save notification settings
    const handleSaveNotifications = async () => {
        if (!account) {
            showNotification('Please connect your wallet first', 'error')
            return
        }

        setIsSaving(true)

        try {
            // Save to localStorage
            localStorage.setItem(`notifications_${account}`, JSON.stringify(notificationSettings))

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500))

            showNotification('Notification settings saved! 🔔', 'success')
        } catch (error) {
            console.error('Error saving notifications:', error)
            showNotification('Failed to save notification settings', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    // Handle profile input change
    const handleProfileChange = (field, value) => {
        setProfileSettings(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle notification toggle
    const handleNotificationToggle = (field) => {
        setNotificationSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const getMemberSince = () => {
        if (nfts.length > 0 && nfts[0].lastEvolved) {
            const date = new Date(nfts[0].lastEvolved * 1000)
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }
        return 'Recently'
    }

    // Calculate real stats from NFTs
    const stats = [
        {
            value: loading ? '...' : nfts.length.toString(),
            label: 'NFTs Owned',
            icon: '🎨'
        },
        {
            value: loading ? '...' : nfts.reduce((sum, nft) => {
                const level = nft.level || 1
                return sum + (level * 1000)
            }, 0).toLocaleString(),
            label: 'Total XP',
            icon: '⚡'
        },
        {
            value: loading ? '...' : nfts.length > 0
                ? (nfts.reduce((sum, nft) => sum + (nft.level || 1), 0) / nfts.length).toFixed(1)
                : '0',
            label: 'Avg Level',
            icon: '📊'
        },
        {
            value: parseFloat(balance).toFixed(4),
            label: 'Balance (MATIC)',
            icon: '💰'
        }
    ]

    // Generate activities from NFTs
    const activities = nfts.length > 0 ? nfts.map((nft, index) => {
        const timeAgo = nft.lastEvolved
            ? new Date(nft.lastEvolved * 1000).toLocaleDateString()
            : 'Recently'

        return {
            icon: '🎨',
            text: `Minted ${nft.name || `EvoNFT #${nft.id}`}`,
            time: timeAgo
        }
    }) : [
        { icon: '📦', text: 'No activity yet', time: 'Start by minting your first NFT!' }
    ]

    // Calculate achievements based on real data
    const unlockedAchievements = []
    const lockedAchievements = []

    // === COLLECTION ACHIEVEMENTS ===

    // First Mint achievement
    if (nfts.length > 0) {
        unlockedAchievements.push({
            icon: '🏆',
            name: 'First Mint',
            desc: 'Minted your first NFT',
            date: getMemberSince()
        })
    } else {
        lockedAchievements.push({
            icon: '🔒',
            name: 'First Mint',
            desc: 'Mint your first NFT',
            progress: 0
        })
    }

    // Collector I (5 NFTs)
    if (nfts.length >= 5) {
        unlockedAchievements.push({
            icon: '⭐',
            name: 'Collector I',
            desc: 'Own 5 NFTs',
            date: 'Unlocked'
        })
    } else if (nfts.length > 0) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Collector I',
            desc: 'Own 5 NFTs',
            progress: Math.round((nfts.length / 5) * 100)
        })
    }

    // Collector II (10 NFTs)
    if (nfts.length >= 10) {
        unlockedAchievements.push({
            icon: '🌟',
            name: 'Collector II',
            desc: 'Own 10 NFTs',
            date: 'Unlocked'
        })
    } else if (nfts.length >= 5) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Collector II',
            desc: 'Own 10 NFTs',
            progress: Math.round((nfts.length / 10) * 100)
        })
    }

    // Collector III (25 NFTs)
    if (nfts.length >= 25) {
        unlockedAchievements.push({
            icon: '💫',
            name: 'Collector III',
            desc: 'Own 25 NFTs',
            date: 'Unlocked'
        })
    } else if (nfts.length >= 10) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Collector III',
            desc: 'Own 25 NFTs',
            progress: Math.round((nfts.length / 25) * 100)
        })
    }

    // Whale (50 NFTs)
    if (nfts.length >= 50) {
        unlockedAchievements.push({
            icon: '🐋',
            name: 'Whale',
            desc: 'Own 50 NFTs',
            date: 'Unlocked'
        })
    } else if (nfts.length >= 25) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Whale',
            desc: 'Own 50 NFTs',
            progress: Math.round((nfts.length / 50) * 100)
        })
    }

    // === LEVEL ACHIEVEMENTS ===

    const maxLevel = nfts.length > 0 ? Math.max(...nfts.map(nft => nft.level || 1)) : 0
    const totalLevels = nfts.reduce((sum, nft) => sum + (nft.level || 1), 0)

    // Level 5
    if (maxLevel >= 5) {
        unlockedAchievements.push({
            icon: '🎯',
            name: 'Level 5',
            desc: 'Reach Level 5',
            date: 'Unlocked'
        })
    } else if (maxLevel > 0) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Level 5',
            desc: 'Reach Level 5 with any NFT',
            progress: Math.round((maxLevel / 5) * 100)
        })
    }

    // Level 10
    if (maxLevel >= 10) {
        unlockedAchievements.push({
            icon: '🎖️',
            name: 'Level 10',
            desc: 'Reach Level 10',
            date: 'Unlocked'
        })
    } else if (maxLevel >= 5) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Level 10',
            desc: 'Reach Level 10 with any NFT',
            progress: Math.round((maxLevel / 10) * 100)
        })
    }

    // Level 20
    if (maxLevel >= 20) {
        unlockedAchievements.push({
            icon: '🏅',
            name: 'Level 20',
            desc: 'Reach Level 20',
            date: 'Unlocked'
        })
    } else if (maxLevel >= 10) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Level 20',
            desc: 'Reach Level 20 with any NFT',
            progress: Math.round((maxLevel / 20) * 100)
        })
    }

    // Level 50
    if (maxLevel >= 50) {
        unlockedAchievements.push({
            icon: '👑',
            name: 'Level 50',
            desc: 'Reach Level 50',
            date: 'Unlocked'
        })
    } else if (maxLevel >= 20) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Level 50',
            desc: 'Reach Level 50 with any NFT',
            progress: Math.round((maxLevel / 50) * 100)
        })
    }

    // === RARITY ACHIEVEMENTS ===

    const rarityCount = {
        common: nfts.filter(n => n.rarity?.toLowerCase() === 'common').length,
        uncommon: nfts.filter(n => n.rarity?.toLowerCase() === 'uncommon').length,
        rare: nfts.filter(n => n.rarity?.toLowerCase() === 'rare').length,
        epic: nfts.filter(n => n.rarity?.toLowerCase() === 'epic').length,
        legendary: nfts.filter(n => n.rarity?.toLowerCase() === 'legendary').length,
        mythic: nfts.filter(n => n.rarity?.toLowerCase() === 'mythic').length
    }

    // Rare Collector
    if (rarityCount.rare > 0) {
        unlockedAchievements.push({
            icon: '💙',
            name: 'Rare Collector',
            desc: 'Own a Rare NFT',
            date: 'Unlocked'
        })
    }

    // Epic Collector
    if (rarityCount.epic > 0) {
        unlockedAchievements.push({
            icon: '💜',
            name: 'Epic Collector',
            desc: 'Own an Epic NFT',
            date: 'Unlocked'
        })
    }

    // Legendary Collector
    if (rarityCount.legendary > 0) {
        unlockedAchievements.push({
            icon: '💎',
            name: 'Legendary',
            desc: 'Own a Legendary NFT',
            date: 'Unlocked'
        })
    } else if (nfts.length > 0) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Legendary',
            desc: 'Own a Legendary NFT',
            progress: 0
        })
    }

    // Mythic Collector
    if (rarityCount.mythic > 0) {
        unlockedAchievements.push({
            icon: '🔴',
            name: 'Mythic',
            desc: 'Own a Mythic NFT',
            date: 'Unlocked'
        })
    }

    // === SPECIAL ACHIEVEMENTS ===

    // Diversity (own 3+ different rarities)
    const uniqueRarities = Object.values(rarityCount).filter(count => count > 0).length
    if (uniqueRarities >= 3) {
        unlockedAchievements.push({
            icon: '🌈',
            name: 'Diversity',
            desc: 'Own 3+ different rarities',
            date: 'Unlocked'
        })
    } else if (nfts.length >= 3) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Diversity',
            desc: 'Own 3+ different rarities',
            progress: Math.round((uniqueRarities / 3) * 100)
        })
    }

    // Power Trainer (total levels >= 50)
    if (totalLevels >= 50) {
        unlockedAchievements.push({
            icon: '💪',
            name: 'Power Trainer',
            desc: 'Total levels reach 50',
            date: 'Unlocked'
        })
    } else if (totalLevels > 0) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Power Trainer',
            desc: 'Total levels reach 50',
            progress: Math.round((totalLevels / 50) * 100)
        })
    }

    // Elite Trainer (total levels >= 100)
    if (totalLevels >= 100) {
        unlockedAchievements.push({
            icon: '⚡',
            name: 'Elite Trainer',
            desc: 'Total levels reach 100',
            date: 'Unlocked'
        })
    } else if (totalLevels >= 50) {
        lockedAchievements.push({
            icon: '🔒',
            name: 'Elite Trainer',
            desc: 'Total levels reach 100',
            progress: Math.round((totalLevels / 100) * 100)
        })
    }

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <div className={`px-6 py-4 rounded-lg shadow-lg border ${toastType === 'success'
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-red-500/20 border-red-500/50 text-red-400'
                            }`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {toastType === 'success' ? '✅' : '❌'}
                                </span>
                                <p className="font-medium">{toastMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Network Switcher */}
            <NetworkSwitcher
                currentChainId={currentChainId}
                onSwitch={() => window.location.reload()}
            />

            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="glass-strong rounded-2xl border border-slate-700/50 p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-4xl animate-float">
                            {nfts.length > 0 ? '🎮' : '👤'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 justify-center md:justify-start">
                                {account ? (
                                    profileSettings.username
                                        ? profileSettings.username
                                        : `Trainer ${formatAddress(account)}`
                                ) : 'Not Connected'}
                                {profileSettings.username && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                        ✓ Verified
                                    </span>
                                )}
                            </h1>

                            {/* Bio */}
                            {profileSettings.bio && (
                                <p className="text-slate-300 text-sm mb-2 max-w-md">
                                    {profileSettings.bio}
                                </p>
                            )}

                            {/* Wallet Address */}
                            <p className="text-slate-400 font-mono text-xs mb-2">
                                {account || 'Please connect your wallet'}
                            </p>

                            {/* Social Links */}
                            {(profileSettings.twitter || profileSettings.discord || profileSettings.email) && (
                                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                    {profileSettings.twitter && (
                                        <a
                                            href={`https://twitter.com/${profileSettings.twitter.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-blue-400 transition text-sm flex items-center gap-1"
                                        >
                                            🐦 {profileSettings.twitter}
                                        </a>
                                    )}
                                    {profileSettings.discord && (
                                        <span className="text-slate-400 text-sm flex items-center gap-1">
                                            💬 {profileSettings.discord}
                                        </span>
                                    )}
                                    {profileSettings.email && (
                                        <a
                                            href={`mailto:${profileSettings.email}`}
                                            className="text-slate-400 hover:text-primary-400 transition text-sm flex items-center gap-1"
                                        >
                                            📧 Email
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Member Info */}
                            <div className="flex items-center gap-4 justify-center md:justify-start text-sm">
                                <span className="text-slate-400">
                                    Member since: {getMemberSince()}
                                </span>
                                {currentChainId && (
                                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">
                                        Chain ID: {currentChainId}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTab('settings')}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                            >
                                Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                            <div className="text-slate-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-700 mb-6">
                    {['activity', 'achievements', 'settings'].map(tab => (
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

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                    <div className="space-y-4">
                        {activities.map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-slate-700"
                            >
                                <span className="text-2xl">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="text-slate-200">{activity.text}</p>
                                    <p className="text-sm text-slate-500">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Unlocked ({unlockedAchievements.length})</h2>
                        {unlockedAchievements.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                                {unlockedAchievements.map((achievement, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-strong rounded-xl border border-primary-500/30 p-4 text-center"
                                    >
                                        <div className="text-4xl mb-2">{achievement.icon}</div>
                                        <div className="font-medium text-sm mb-1">{achievement.name}</div>
                                        <div className="text-xs text-slate-500">{achievement.date}</div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 mb-8">
                                <p className="text-slate-400">No achievements unlocked yet. Start minting NFTs!</p>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mb-4">Locked Achievements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {lockedAchievements.map((achievement, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-surface rounded-lg border border-slate-700 p-4"
                                >
                                    <div className="text-4xl mb-2 opacity-50">{achievement.icon}</div>
                                    <div className="font-medium mb-1">{achievement.name}</div>
                                    <div className="text-sm text-slate-400 mb-3">{achievement.desc}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span>{achievement.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-primary-500 h-2 rounded-full"
                                                style={{ width: `${achievement.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-strong rounded-2xl border border-slate-700/50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <span>👤</span>
                                    Profile Settings
                                </h3>
                                {profileSettings.username && (
                                    <span className="text-xs text-green-400">✓ Saved</span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Username <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileSettings.username}
                                        onChange={(e) => handleProfileChange('username', e.target.value)}
                                        placeholder="Enter your username (min 3 characters)"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition"
                                    />
                                    {profileSettings.username && profileSettings.username.length < 3 && (
                                        <p className="text-xs text-red-400 mt-1">Username must be at least 3 characters</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Bio</label>
                                    <textarea
                                        rows="3"
                                        value={profileSettings.bio}
                                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {profileSettings.bio.length}/200 characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={profileSettings.email}
                                        onChange={(e) => handleProfileChange('email', e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">
                                            <span className="mr-1">🐦</span>Twitter Handle
                                        </label>
                                        <input
                                            type="text"
                                            value={profileSettings.twitter}
                                            onChange={(e) => handleProfileChange('twitter', e.target.value)}
                                            placeholder="@username"
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">
                                            <span className="mr-1">💬</span>Discord Username
                                        </label>
                                        <input
                                            type="text"
                                            value={profileSettings.discord}
                                            onChange={(e) => handleProfileChange('discord', e.target.value)}
                                            placeholder="username#1234"
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving || !profileSettings.username || profileSettings.username.length < 3}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Save Profile Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Notification Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-strong rounded-2xl border border-slate-700/50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <span>🔔</span>
                                    Notification Settings
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        { key: 'evolution', label: 'NFT Evolution Notifications', icon: '🧬' },
                                        { key: 'breeding', label: 'Breeding Complete Notifications', icon: '👶' },
                                        { key: 'staking', label: 'Staking Rewards Available', icon: '💰' },
                                        { key: 'marketplace', label: 'Marketplace Activity', icon: '🛒' },
                                        { key: 'email', label: 'Email Notifications', icon: '📧' }
                                    ].map((setting) => (
                                        <label
                                            key={setting.key}
                                            className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{setting.icon}</span>
                                                <span className="text-sm group-hover:text-primary-400 transition">
                                                    {setting.label}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[setting.key]}
                                                    onChange={() => handleNotificationToggle(setting.key)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveNotifications}
                                    disabled={isSaving}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Save Notification Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        <div className="glass-strong rounded-2xl border border-slate-700/50 p-6">
                            <h3 className="font-semibold mb-4">Connected Wallet</h3>
                            {account ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">🦊 MetaMask</p>
                                            <p className="text-sm text-slate-400 font-mono">{account}</p>
                                        </div>
                                        <button
                                            onClick={disconnectWallet}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                    <div className="pt-4 border-t border-slate-700">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Balance:</span>
                                            <span className="font-mono">{parseFloat(balance).toFixed(4)} MATIC</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Network:</span>
                                            <span>Polygon Amoy (Chain ID: {currentChainId})</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">NFTs Owned:</span>
                                            <span>{nfts.length}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-400 mb-4">No wallet connected</p>
                                    <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition">
                                        Connect Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
