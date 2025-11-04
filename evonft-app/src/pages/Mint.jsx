import MintNFT from '../components/MintNFT';

export default function Mint() {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Mint Your <span className="text-gradient">EvoNFT</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Create your unique digital companion that grows and evolves with you
                    </p>
                </div>

                <MintNFT />

                {/* How It Works */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        How It <span className="text-gradient">Works</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🎨',
                                title: 'Mint',
                                desc: 'Create your unique EvoNFT with random starting traits'
                            },
                            {
                                icon: '📈',
                                title: 'Evolve',
                                desc: 'Your NFT grows and evolves based on your activity'
                            },
                            {
                                icon: '💰',
                                title: 'Trade',
                                desc: 'Trade your evolved NFT on the marketplace'
                            }
                        ].map((step, i) => (
                            <div
                                key={i}
                                className="glass-strong rounded-xl p-6 text-center border border-slate-700/50 hover:border-primary-500/50 transition-all"
                            >
                                <div className="text-5xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-slate-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
