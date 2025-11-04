import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export default function Navbar() {
    const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3()

    const truncateAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
        <nav className="glass-strong sticky top-0 z-50 border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                                <span className="text-xl">🐉</span>
                            </div>
                            <span className="text-xl font-bold text-gradient">EvoNFT</span>
                        </Link>

                        <div className="hidden md:flex space-x-6">
                            <Link to="/explore" className="text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                                Explore
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link to="/staking" className="text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                                Stake
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link to="/my-nfts" className="text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                                My NFTs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {account ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="hidden md:block text-slate-300 hover:text-white transition-all hover:scale-105"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={disconnectWallet}
                                    className="px-4 py-2 glass rounded-xl hover:glass-strong transition-all font-mono text-sm border border-primary-500/30 hover:border-primary-500 hover:scale-105"
                                >
                                    {truncateAddress(account)}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition-all disabled:opacity-50 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/50"
                            >
                                {isConnecting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⟳</span>
                                        Connecting...
                                    </span>
                                ) : (
                                    '🦊 Connect Wallet'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
