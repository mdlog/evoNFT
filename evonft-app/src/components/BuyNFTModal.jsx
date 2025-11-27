import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useMarketplace } from '../hooks/useMarketplace';

export default function BuyNFTModal({ isOpen, onClose, nft, listing, onSuccess }) {
    const { contractWithSigner: marketplaceContract } = useMarketplace();
    const [buying, setBuying] = useState(false);

    async function handleBuy() {
        if (!marketplaceContract || !listing) {
            console.error('❌ Missing contract or listing:', {
                hasContract: !!marketplaceContract,
                hasListing: !!listing
            });
            alert('Contract or listing data not available');
            return;
        }

        try {
            setBuying(true);
            console.log('🛒 Buying NFT:', {
                tokenId: nft.id,
                price: listing.price,
                priceWei: listing.priceWei?.toString(),
                seller: listing.seller
            });

            // Ensure priceWei is valid
            if (!listing.priceWei) {
                throw new Error('Price data is missing');
            }

            // Skip balance check due to RPC issues
            console.log('💵 Required:', listing.price, 'MATIC');
            console.log('💰 Skipping balance check to avoid RPC error');

            // Send transaction
            console.log('📤 Sending transaction...');
            const tx = await marketplaceContract.buyNFT(nft.id, {
                value: listing.priceWei
            });

            console.log('✅ Transaction sent:', tx.hash);
            console.log('⏳ Waiting for confirmation...');

            const receipt = await tx.wait();
            console.log('✅ Transaction confirmed:', receipt.hash);

            alert(`Successfully purchased ${nft.name} for ${listing.price} MATIC!`);

            if (onSuccess) {
                onSuccess();
            }

            onClose();

        } catch (error) {
            console.error('❌ Buy error:', error);
            console.error('   Error details:', {
                message: error.message,
                code: error.code,
                reason: error.reason,
                data: error.data
            });

            let errorMessage = 'Failed to buy NFT';

            if (error.message.includes('user rejected') || error.code === 'ACTION_REJECTED') {
                errorMessage = 'Transaction cancelled by user';
            } else if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient MATIC balance';
            } else if (error.message.includes('Not for sale')) {
                errorMessage = 'NFT is no longer for sale';
            } else if (error.message.includes('Cannot buy own NFT')) {
                errorMessage = 'You cannot buy your own NFT';
            } else if (error.reason) {
                errorMessage = `Error: ${error.reason}`;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setBuying(false);
        }
    }

    if (!isOpen || !listing) return null;

    const marketplaceFee = Number(listing.price) * 0.025;
    const sellerReceives = Number(listing.price) * 0.975;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">🛒 Buy NFT</h2>
                            <p className="text-slate-400">{nft.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={buying}
                            className="text-slate-400 hover:text-white text-2xl transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* NFT Preview */}
                    <div className="mb-6">
                        <img
                            src={nft.image}
                            alt={nft.name}
                            className="w-full aspect-square object-cover rounded-xl mb-4"
                        />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400">Level:</span>
                                <span className="ml-2 font-semibold">{nft.level || 1}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">XP:</span>
                                <span className="ml-2 font-semibold">{nft.xp || 0}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Rarity:</span>
                                <span className="ml-2 font-semibold capitalize">{nft.rarity || 'common'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Token ID:</span>
                                <span className="ml-2 font-semibold">#{nft.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl space-y-2">
                        <div className="flex justify-between text-lg">
                            <span className="font-semibold">Price:</span>
                            <span className="font-bold text-primary-400">{listing.price} MATIC</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Marketplace Fee (2.5%):</span>
                            <span>{marketplaceFee.toFixed(4)} MATIC</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Seller Receives:</span>
                            <span>{sellerReceives.toFixed(4)} MATIC</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700">
                            <div className="flex justify-between text-sm">
                                <span>Seller:</span>
                                <span className="font-mono text-xs">
                                    {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <p className="text-sm text-yellow-200">
                            ⚠️ <strong>Important:</strong> Make sure you have enough MATIC for the purchase price + gas fees.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={buying}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBuy}
                            disabled={buying}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {buying ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⟳</span>
                                    Buying...
                                </span>
                            ) : (
                                `Buy for ${listing.price} MATIC`
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
