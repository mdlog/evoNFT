import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContract, useContractStats } from '../hooks/useContract';
import { useWeb3 } from '../context/RainbowWeb3Context';
import { generateInitialMetadata, uploadMetadataToIPFS, parseContractError } from '../services/contractService';
import { ethers } from 'ethers';
import NetworkSwitcher from './NetworkSwitcher';

export default function MintNFT() {
    const { account, provider } = useWeb3();
    const { contractWithSigner } = useContract();
    const { stats, loading: statsLoading } = useContractStats();
    const [currentChainId, setCurrentChainId] = useState(null);

    // Get current chain ID
    useEffect(() => {
        if (provider) {
            provider.getNetwork().then(network => {
                setCurrentChainId(Number(network.chainId));
            }).catch(err => {
                console.error('Error getting network:', err);
            });
        }
    }, [provider]);

    const [minting, setMinting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [mintedTokenId, setMintedTokenId] = useState(null);

    const handleMint = async () => {
        console.log('🎯 Mint clicked');
        console.log('👤 Account:', account);
        console.log('📝 Contract with signer:', contractWithSigner);
        console.log('🌐 Provider:', provider);

        if (!account) {
            console.error('❌ No account connected');
            setError('Please connect your wallet first');
            return;
        }

        if (!contractWithSigner) {
            console.error('❌ No contract with signer');
            setError('Contract not initialized. Please refresh and try again.');
            return;
        }

        try {
            setMinting(true);
            setError(null);

            // Check balance
            const balance = await provider.getBalance(account);
            console.log('💰 Balance:', ethers.formatEther(balance), 'MATIC');

            // Step 1: Get next token ID
            console.log('📊 Getting total minted...');
            const totalMinted = await contractWithSigner.totalMinted();
            const nextTokenId = Number(totalMinted);
            console.log('✅ Next token ID:', nextTokenId);

            // Step 2: Generate metadata
            console.log('🎨 Generating metadata...');
            const metadata = generateInitialMetadata(nextTokenId);
            console.log('✅ Metadata generated:', metadata);

            // Step 3: Upload to IPFS
            console.log('📤 Uploading to IPFS...');
            const uri = await uploadMetadataToIPFS(metadata);
            console.log('✅ Uploaded to IPFS:', uri);

            // Step 4: Get mint price
            console.log('💵 Getting mint price...');
            const mintPrice = await contractWithSigner.mintPrice();
            console.log('✅ Mint price:', ethers.formatEther(mintPrice), 'MATIC');

            // Check if enough balance
            if (balance < mintPrice) {
                throw new Error(`Insufficient balance. Need ${ethers.formatEther(mintPrice)} MATIC`);
            }

            // Step 5: Mint NFT
            console.log('🚀 Sending mint transaction...');
            const tx = await contractWithSigner.mint(account, uri, {
                value: mintPrice,
                gasLimit: 500000 // Set explicit gas limit
            });

            console.log('✅ Transaction sent:', tx.hash);
            console.log('⏳ Waiting for confirmation...');

            // Step 6: Wait for confirmation
            const receipt = await tx.wait();
            console.log('✅ Transaction confirmed:', receipt.hash);

            // Step 6: Extract token ID from event
            const mintedEvent = receipt.logs.find(log => {
                try {
                    const parsed = contractWithSigner.interface.parseLog(log);
                    return parsed.name === 'Minted';
                } catch {
                    return false;
                }
            });

            if (mintedEvent) {
                const parsed = contractWithSigner.interface.parseLog(mintedEvent);
                const tokenId = Number(parsed.args.tokenId);
                setMintedTokenId(tokenId);
                console.log('Minted token ID:', tokenId);
            }

            setSuccess(true);
            setMinting(false);

        } catch (err) {
            console.error('Mint error:', err);
            setError(parseContractError(err));
            setMinting(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError(null);
        setMintedTokenId(null);
    };

    if (!account) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🦊</div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-slate-400">Please connect your wallet to mint NFTs</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Network Switcher */}
            <NetworkSwitcher
                currentChainId={currentChainId}
                onSwitch={() => window.location.reload()}
            />

            {/* Mint Card */}
            <div className="glass-strong rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Mint Your <span className="text-gradient">EvoNFT</span>
                </h2>

                {/* Preview */}
                <div className="mb-8">
                    <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl border-2 border-primary-500/30 flex items-center justify-center animate-float">
                        <div className="text-9xl">🐉</div>
                    </div>
                </div>

                {/* Stats */}
                {!statsLoading && stats && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-400">
                                {stats.totalMinted || 0}/{stats.maxSupply || 10000}
                            </div>
                            <div className="text-sm text-slate-400">Minted</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-accent-400">
                                {stats.mintPrice || '0.01'} MATIC
                            </div>
                            <div className="text-sm text-slate-400">Price</div>
                        </div>
                    </div>
                )}

                {/* Loading Stats */}
                {statsLoading && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg animate-pulse">
                            <div className="h-8 bg-slate-700 rounded w-20 mx-auto mb-2"></div>
                            <div className="text-sm text-slate-400">Minted</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg animate-pulse">
                            <div className="h-8 bg-slate-700 rounded w-20 mx-auto mb-2"></div>
                            <div className="text-sm text-slate-400">Price</div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold mb-2">What You'll Get:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>✅ Unique EvoNFT with random traits</li>
                        <li>✅ Starting at Level 1</li>
                        <li>✅ Base stats ready to evolve</li>
                        <li>✅ Ability to grow and level up</li>
                        <li>✅ Stored permanently on IPFS</li>
                    </ul>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Mint Button */}
                <button
                    onClick={handleMint}
                    disabled={minting || statsLoading || (stats && stats.totalMinted >= stats.maxSupply)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
                >
                    {minting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⟳</span>
                            Minting...
                        </span>
                    ) : statsLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⟳</span>
                            Loading...
                        </span>
                    ) : !stats || stats.maxSupply === 0 ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="text-yellow-400">⚠️</span>
                            Contract Not Connected
                        </span>
                    ) : stats.totalMinted >= stats.maxSupply ? (
                        'Sold Out'
                    ) : (
                        `Mint for ${stats.mintPrice || '0.01'} MATIC`
                    )}
                </button>

                {/* Debug Info (only in development) */}
                {!stats || stats.maxSupply === 0 ? (
                    <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <p className="text-yellow-200 text-sm mb-2">
                            <strong>⚠️ Contract Connection Issue</strong>
                        </p>
                        <p className="text-yellow-200 text-xs mb-2">
                            The contract stats are not loading. This could be due to:
                        </p>
                        <ul className="text-yellow-200 text-xs space-y-1 ml-4">
                            <li>• Wrong network (should be Polygon Amoy)</li>
                            <li>• RPC connection issue</li>
                            <li>• Contract address not configured</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-yellow-500/30">
                            <p className="text-yellow-200 text-xs">
                                <strong>Quick Fix:</strong> Try refreshing the page or switching to Polygon Amoy network in MetaMask
                            </p>
                        </div>
                    </div>
                ) : null}

                {/* Progress Steps */}
                {minting && (
                    <div className="mt-6 space-y-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⟳</span>
                            <span>Generating metadata...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⟳</span>
                            <span>Uploading to IPFS...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⟳</span>
                            <span>Waiting for confirmation...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-strong rounded-2xl border border-primary-500/50 p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                                <p className="text-slate-300 mb-6">
                                    Your EvoNFT has been minted successfully!
                                </p>

                                {mintedTokenId !== null && (
                                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                                        <div className="text-sm text-slate-400 mb-1">Token ID</div>
                                        <div className="text-2xl font-bold text-gradient">#{mintedTokenId}</div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                    >
                                        Close
                                    </button>
                                    <a
                                        href={`/nft/${mintedTokenId}`}
                                        className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition text-center"
                                    >
                                        View NFT
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
