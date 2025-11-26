import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useMarketplace } from '../hooks/useMarketplace';
import { useContract } from '../hooks/useContract';
import { MARKETPLACE_CONTRACT } from '../config/contractsExtended';
import { useWeb3 } from '../context/RainbowWeb3Context';

export default function ListForSaleModal({ isOpen, onClose, tokenId, nftName, onSuccess }) {
    const { contractWithSigner: marketplaceContract } = useMarketplace();
    const { contractWithSigner: nftContract } = useContract();
    const { account } = useWeb3();
    const [price, setPrice] = useState('');
    const [listing, setListing] = useState(false);
    const [step, setStep] = useState(1); // 1: input, 2: approve, 3: list

    async function handleList() {
        if (!price || !marketplaceContract || !nftContract) {
            console.error('Missing required data:', { price, marketplaceContract, nftContract });
            alert('Please connect your wallet and try again');
            return;
        }

        try {
            setListing(true);

            console.log('User address:', account);
            console.log('Token ID:', tokenId);
            console.log('Marketplace contract:', MARKETPLACE_CONTRACT);

            // Step 1: Check approval
            setStep(2);
            console.log('Checking approval...');

            // Check if marketplace is approved for this specific token
            let needsApproval = true;
            try {
                const approved = await nftContract.getApproved(tokenId);
                console.log('Approved address:', approved);
                needsApproval = approved.toLowerCase() !== MARKETPLACE_CONTRACT.toLowerCase();
            } catch (err) {
                console.log('getApproved not available, checking isApprovedForAll');
            }

            // Also check if marketplace is approved for all tokens
            if (needsApproval) {
                try {
                    const isApprovedForAll = await nftContract.isApprovedForAll(
                        account,
                        MARKETPLACE_CONTRACT
                    );
                    console.log('Is approved for all:', isApprovedForAll);
                    needsApproval = !isApprovedForAll;
                } catch (err) {
                    console.log('isApprovedForAll check failed:', err.message);
                }
            }

            if (needsApproval) {
                console.log('Approving marketplace...');
                try {
                    const approveTx = await nftContract.approve(MARKETPLACE_CONTRACT, tokenId);
                    console.log('Approval transaction sent:', approveTx.hash);
                    await approveTx.wait();
                    console.log('✅ Approved');
                } catch (approveErr) {
                    console.error('Approval failed:', approveErr);
                    throw new Error('Failed to approve marketplace: ' + approveErr.message);
                }
            } else {
                console.log('✅ Already approved');
            }

            // Step 2: List for sale
            setStep(3);
            console.log('Listing NFT...');

            const priceWei = ethers.parseEther(price);
            const listTx = await marketplaceContract.listForSale(tokenId, priceWei);
            await listTx.wait();

            console.log('✅ Listed successfully');
            alert(`Successfully listed ${nftName} for ${price} MATIC!`);

            // Refresh page to update listings
            if (onSuccess) {
                onSuccess();
            }

            onClose();

            // Reload page to refresh data
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('List error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                reason: error.reason
            });

            let errorMessage = 'Failed to list NFT';
            if (error.message) {
                if (error.message.includes('user rejected') || error.message.includes('User denied')) {
                    errorMessage = 'Transaction cancelled by user';
                } else if (error.message.includes('insufficient funds')) {
                    errorMessage = 'Insufficient MATIC for gas';
                } else if (error.message.includes('Already listed')) {
                    errorMessage = 'NFT is already listed';
                } else if (error.message.includes('not owner')) {
                    errorMessage = 'You are not the owner of this NFT';
                } else {
                    errorMessage = `Failed to list NFT: ${error.message.substring(0, 100)}`;
                }
            }

            alert(errorMessage);
        } finally {
            setListing(false);
            setStep(1);
        }
    }

    if (!isOpen) return null;

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
                            <h2 className="text-2xl font-bold">💰 List for Sale</h2>
                            <p className="text-slate-400">{nftName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={listing}
                            className="text-slate-400 hover:text-white text-2xl transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Price Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Sale Price (MATIC)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="1.0"
                            disabled={listing}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all disabled:opacity-50"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            Marketplace fee: 2.5% • You'll receive: {price ? (Number(price) * 0.975).toFixed(4) : '0'} MATIC
                        </p>
                    </div>

                    {/* Steps */}
                    {listing && (
                        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-secondary-400' : 'text-slate-500'}`}>
                                    {step > 2 ? '✅' : step === 2 ? '⏳' : '⭕'} Approve Marketplace
                                </div>
                                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-secondary-400' : 'text-slate-500'}`}>
                                    {step > 3 ? '✅' : step === 3 ? '⏳' : '⭕'} List NFT
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                            💡 <strong>Note:</strong> You'll need to approve the marketplace first (one-time), then confirm the listing.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={listing}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleList}
                            disabled={!price || Number(price) <= 0 || listing}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {listing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⟳</span>
                                    {step === 2 ? 'Approving...' : 'Listing...'}
                                </span>
                            ) : (
                                'List for Sale'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
