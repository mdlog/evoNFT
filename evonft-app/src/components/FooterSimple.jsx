import { Link } from 'react-router-dom'

export default function FooterSimple() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative mt-20 border-t border-slate-800/50">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🐉</span>
                        </div>
                        <span className="text-lg font-bold text-gradient">EvoNFT</span>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link to="/explore" className="text-slate-400 hover:text-primary-400 transition-colors">
                            Explore
                        </Link>
                        <Link to="/my-nfts" className="text-slate-400 hover:text-primary-400 transition-colors">
                            My NFTs
                        </Link>
                        <Link to="/staking" className="text-slate-400 hover:text-primary-400 transition-colors">
                            Staking
                        </Link>
                        <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                            Docs
                        </a>
                        <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                            FAQ
                        </a>
                    </div>

                    {/* Social */}
                    <div className="flex gap-3">
                        {['𝕏', '💬', '✈️', '⚙️'].map((icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:glass-strong hover:scale-110 transition-all border border-slate-700/50 hover:border-primary-500/50"
                            >
                                <span>{icon}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {currentYear} EvoNFT. Built on Polygon ⬡</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
