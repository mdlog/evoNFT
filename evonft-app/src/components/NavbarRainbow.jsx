import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from '../context/RainbowWeb3Context';

export default function NavbarRainbow() {
    const { account } = useWeb3();

    return (
        <nav className="glass-strong sticky top-0 z-50 border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-4 group">
                            <img
                                src="/logo.png"
                                alt="EvoNFT Logo"
                                className="w-12 h-12 rounded-xl group-hover:scale-110 transition-transform duration-300 object-contain"
                            />
                            <span className="text-xl font-bold text-gradient">EvoNFT</span>
                        </Link>
                    </div>

                    {/* Menu - Center */}
                    <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/explore" className="text-lg font-medium text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                            Explore
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link to="/staking" className="text-lg font-medium text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                            Stake
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link to="/my-nfts" className="text-lg font-medium text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                            My NFTs
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        {account && (
                            <Link to="/profile" className="text-lg font-medium text-slate-300 hover:text-white transition-all hover:scale-105 relative group">
                                Profile
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        )}
                    </div>

                    {/* Wallet Button - Right */}
                    <div className="flex-shrink-0">
                        <ConnectButton
                            chainStatus="icon"
                            showBalance={false}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
