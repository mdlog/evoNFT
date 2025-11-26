import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NFTVisual } from '../components/NFTVisual'
import { useMockNFTs } from '../hooks/useNFTVisuals'
import { useRecentActivity } from '../hooks/useRecentActivity'

export default function Home() {
    const mockNFTs = useMockNFTs(3) || [] // Generate 3 sample NFTs for preview
    const { activities, loading: activitiesLoading } = useRecentActivity(5) // Get 5 recent activities

    const stats = [
        { value: '12,543', label: 'Total Minted', icon: '🎨' },
        { value: '8,921', label: 'Owners', icon: '👥' },
        { value: 'Level 5', label: 'Avg Level', icon: '📈' },
        { value: '$2.4M', label: 'Volume', icon: '💰' }
    ]

    const steps = [
        { icon: '🎨', title: 'Mint', desc: 'Your NFT', color: 'from-primary-500 to-primary-600' },
        { icon: '🎮', title: 'Interact', desc: 'Daily', color: 'from-secondary-500 to-secondary-600' },
        { icon: '📈', title: 'Evolve', desc: '& Level Up', color: 'from-blue-500 to-blue-600' },
        { icon: '💰', title: 'Trade', desc: 'or Keep', color: 'from-accent-500 to-accent-600' }
    ]



    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
                                <span className="text-gradient">Evolving</span>
                                <br />
                                <span className="text-white">Digital Companions</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            NFTs that <span className="text-gradient font-semibold">grow</span>, <span className="text-gradient font-semibold">learn</span>, and <span className="text-gradient font-semibold">evolve</span> with you on Polygon
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                        >
                            <Link
                                to="/explore"
                                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
                            >
                                <span className="flex items-center gap-2">
                                    Explore Collection
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </Link>
                            <Link
                                to="/mint"
                                className="px-8 py-4 glass-strong hover:glass rounded-2xl font-bold text-lg transition-all hover:scale-105 border border-primary-500/30 hover:border-primary-500 hover:shadow-xl"
                            >
                                Mint Your First NFT
                            </Link>
                        </motion.div>

                        {/* NFT Preview Showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-16 max-w-4xl mx-auto"
                        >
                            {/* Main Featured NFT */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                                <div className="relative aspect-square max-w-md mx-auto glass-strong rounded-3xl border-2 border-primary-500/30 flex items-center justify-center overflow-hidden group hover:border-primary-500 transition-all">
                                    {mockNFTs.length > 0 && mockNFTs[0] ? (
                                        <>
                                            <NFTVisual
                                                tokenId={mockNFTs[0].tokenId}
                                                level={mockNFTs[0].level}
                                                creatureType={mockNFTs[0].creatureType}
                                                rarity={mockNFTs[0].rarity}
                                                size={350}
                                                animated={true}
                                                className="group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Floating info */}
                                            <div className="absolute bottom-4 left-4 right-4 glass-strong rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="text-center">
                                                    <h4 className="font-bold text-lg">{mockNFTs[0]?.name}</h4>
                                                    <p className="text-sm text-slate-300">Interactive • Evolvable • Unique</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-slate-400 text-center">
                                            <div className="text-6xl mb-4">🎨</div>
                                            <p>Loading preview...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mini NFT Gallery */}
                            <div className="flex justify-center gap-4">
                                {mockNFTs.length > 1 && mockNFTs.slice(1, 3).map((nft, index) => (
                                    <motion.div
                                        key={nft.tokenId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 + index * 0.2 }}
                                        className="glass rounded-2xl p-3 border border-slate-700/50 hover:border-primary-500/50 transition-all group cursor-pointer"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <NFTVisual
                                            tokenId={nft.tokenId}
                                            level={nft.level}
                                            creatureType={nft.creatureType}
                                            rarity={nft.rarity}
                                            size={120}
                                            animated={true}
                                        />
                                        <div className="text-center mt-2">
                                            <p className="text-sm font-semibold">{nft.name}</p>
                                            <p className="text-xs text-slate-400">Level {nft.level}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Call to action */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="text-center mt-8"
                            >
                                <p className="text-slate-300 mb-4">Each NFT is unique and grows with your interaction</p>
                                <Link
                                    to="/mint"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 rounded-xl font-semibold transition-all hover:scale-105"
                                >
                                    Create Your Own →
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: stats.indexOf(stat) * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="glass-strong rounded-2xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                                <div className="text-slate-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16"
                    >
                        How It <span className="text-gradient">Works</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step) => {
                            const stepIndex = steps.indexOf(step)
                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: stepIndex * 0.15 }}
                                    whileHover={{ y: -10 }}
                                    className="relative group"
                                >
                                    <div className="glass-strong rounded-2xl p-8 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all h-full">
                                        <div className="relative inline-block mb-6">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                            <div className={`relative text-7xl bg-gradient-to-r ${step.color} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                                                {step.icon}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold mb-2">{step.title}</div>
                                        <div className="text-slate-400 text-lg">{step.desc}</div>
                                    </div>
                                    {stepIndex < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 text-3xl text-primary-500 z-10">
                                            →
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-12"
                    >
                        Recent <span className="text-gradient">Activity</span>
                    </motion.h2>

                    {activitiesLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-strong rounded-2xl p-6 border border-slate-700/50 animate-pulse">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.txHash || `${activity.text}-${index}`}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 10, scale: 1.02 }}
                                    className="relative overflow-hidden group"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${activity.color}`}></div>
                                    <Link
                                        to={activity.tokenId ? `/nft/${activity.tokenId}` : '#'}
                                        className="relative flex items-center gap-4 p-6 glass-strong rounded-2xl border border-slate-700/50 hover:border-primary-500/50 transition-all"
                                    >
                                        <div className="text-4xl">{activity.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-slate-100 font-medium mb-1">{activity.text}</p>
                                            <p className="text-sm text-slate-400">{activity.time}</p>
                                        </div>
                                        <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass-strong rounded-2xl border border-slate-700/50">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold mb-2">No Recent Activity</h3>
                            <p className="text-slate-400">Be the first to mint an NFT!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-20"></div>
                        <div className="relative glass-strong border-2 border-primary-500/30 p-12 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to Start Your <span className="text-gradient">Journey</span>?
                            </h2>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of collectors and start evolving your digital companions today
                            </p>
                            <Link
                                to="/explore"
                                className="inline-block px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
                            >
                                Get Started Now →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
