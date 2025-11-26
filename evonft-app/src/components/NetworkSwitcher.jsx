import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkSwitcher({ currentChainId, onSwitch }) {
    const [switching, setSwitching] = useState(false);
    const [error, setError] = useState(null);

    const POLYGON_AMOY = {
        chainId: '0x13882', // 80002 in hex
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://rpc-amoy.polygon.technology'],
        blockExplorerUrls: ['https://amoy.polygonscan.com']
    };

    const handleSwitch = async () => {
        if (!window.ethereum) {
            setError('MetaMask not installed');
            return;
        }

        try {
            setSwitching(true);
            setError(null);

            // Try to switch to Polygon Amoy
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: POLYGON_AMOY.chainId }],
                });
                console.log('✅ Switched to Polygon Amoy');
                if (onSwitch) onSwitch();
            } catch (switchError) {
                // Network not added, try to add it
                if (switchError.code === 4902) {
                    console.log('📝 Adding Polygon Amoy network...');
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [POLYGON_AMOY],
                    });
                    console.log('✅ Network added and switched');
                    if (onSwitch) onSwitch();
                } else {
                    throw switchError;
                }
            }
        } catch (err) {
            console.error('❌ Error switching network:', err);
            setError(err.message);
        } finally {
            setSwitching(false);
        }
    };

    // Don't show if already on correct network
    if (currentChainId === 80002) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
            >
                <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 backdrop-blur-lg">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-400 mb-2">
                                Wrong Network
                            </h3>
                            <p className="text-slate-300 mb-4">
                                You're on <strong>Chain ID {currentChainId}</strong>.
                                <br />
                                Please switch to <strong>Polygon Amoy Testnet (Chain ID 80002)</strong>
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSwitch}
                                disabled={switching}
                                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                            >
                                {switching ? (
                                    <>
                                        <span className="animate-spin">⟳</span>
                                        Switching Network...
                                    </>
                                ) : (
                                    <>
                                        🔄 Switch to Polygon Amoy
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-slate-400 mt-3 text-center">
                                This will add Polygon Amoy to MetaMask if not already added
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
