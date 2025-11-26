import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const links = {
        product: [
            { name: 'Explore', path: '/explore' },
            { name: 'My NFTs', path: '/my-nfts' },
            { name: 'Staking', path: '/staking' },
            { name: 'Breeding', path: '/breeding' }
        ],
        resources: [
            { name: 'Documentation', path: '#' },
            { name: 'Whitepaper', path: '#' },
            { name: 'Smart Contract', path: '#' },
            { name: 'FAQ', path: '#' }
        ],
        community: [
            { name: 'Twitter', path: '#', icon: '𝕏' },
            { name: 'Discord', path: '#', icon: '💬' },
            { name: 'Telegram', path: '#', icon: '✈️' },
            { name: 'GitHub', path: '#', icon: '⚙️' }
        ]
    }

    return (
        <footer className="relative mt-20 border-t border-slate-800/50">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/logo.png"
                                alt="EvoNFT Logo"
                                className="w-12 h-12 rounded-xl object-contain"
                            />
                            <span className="text-xl font-bold text-gradient">EvoNFT</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Evolving Digital Companions on Polygon. NFTs that grow, learn, and evolve with you.
                        </p>
                        <div className="flex gap-3">
                            {links.community.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.path}
                                    className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:glass-strong hover:scale-110 transition-all border border-slate-700/50 hover:border-primary-500/50"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-lg">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Product</h3>
                        <ul className="space-y-2">
                            {links.product.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="text-slate-400 hover:text-primary-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Resources</h3>
                        <ul className="space-y-2">
                            {links.resources.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.path}
                                        className="text-slate-400 hover:text-primary-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Stay Updated</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Get the latest updates and news
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg font-semibold text-sm transition-all hover:scale-105">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} EvoNFT. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Polygon Badge */}
                <div className="mt-6 flex justify-center">
                    <div className="glass px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-2">
                        <span className="text-sm text-slate-400">Built on</span>
                        <span className="font-semibold text-gradient">Polygon</span>
                        <span className="text-lg">⬡</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
