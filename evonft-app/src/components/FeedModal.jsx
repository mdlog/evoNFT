import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNFTExtended } from '../hooks/useExtendedContract';
import { ethers } from 'ethers';

export default function FeedModal({ isOpen, onClose, tokenId, nftName, onSuccess }) {
    const { contractWithSigner } = useNFTExtended();
    const [feeding, setFeeding] = useState(false);
    const [feedingStatus, setFeedingStatus] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);

    const foodOptions = [
        {
            type: 0,
            name: 'Basic Food',
            icon: '🍖',
            xp: 50,
            price: '0.1',
            description: 'Simple nutrition for steady growth',
            color: 'from-slate-500 to-slate-600'
        },
        {
            type: 1,
            name: 'Premium Food',
            icon: '🥩',
            xp: 200,
            price: '0.5',
            description: 'High-quality nutrients for faster growth',
            color: 'from-blue-500 to-blue-600'
        },
        {
            type: 2,
            name: 'Legendary Food',
            icon: '🍗',
            xp: 500,
            price: '1.0',
            description: 'Mystical delicacy for maximum growth',
            color: 'from-accent-500 to-accent-600'
        }
    ];

    async function handleFeed() {
        if (!selectedFood || !contractWithSigner) return;

        try {
            setFeeding(true);
            setFeedingStatus('Sending transaction...');

            // Add gas limit to avoid estimation issues
            const tx = await contractWithSigner.feed(tokenId, selectedFood.type, {
                value: ethers.parseEther(selectedFood.price),
                gasLimit: 200000 // Set manual gas limit
            });

            console.log('Feed transaction sent:', tx.hash);
            setFeedingStatus(`Waiting for confirmation...\nTx: ${tx.hash.slice(0, 10)}...`);
            
            const receipt = await tx.wait();
            console.log('Feed transaction confirmed:', receipt);

            setFeedingStatus('✅ Success! Updating data...');

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Show success for 1 second then close
            await new Promise(resolve => setTimeout(resolve, 1000));
            onClose();

        } catch (error) {
            console.error('Feed error:', error);

            let errorMessage = 'Failed to feed NFT';

            // Check for specific error types
            if (error.message.includes('user rejected') || error.code === 'ACTION_REJECTED') {
                errorMessage = '❌ Transaction Cancelled\n\nYou rejected the transaction in your wallet.';
            } else if (error.message.includes('insufficient funds') || error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = `💰 Insufficient Balance!\n\nYou need ${selectedFood.price} MATIC + gas fees (~0.001 MATIC)\nTotal required: ~${(parseFloat(selectedFood.price) + 0.001).toFixed(3)} MATIC\n\nYour current balance is too low.\nPlease add more MATIC to your wallet.`;
            } else if (error.message.includes('Not token owner')) {
                errorMessage = '🚫 Not Owner\n\nYou are not the owner of this NFT.';
            } else if (error.message.includes('ERC721: invalid token ID')) {
                errorMessage = `🚫 NFT Not Found\n\nNFT #${tokenId} does not exist.`;
            } else if (error.message.includes('missing revert data') || error.code === 'CALL_EXCEPTION') {
                errorMessage = '⚠️ RPC Connection Issue\n\nMetaMask RPC is timing out.\n\nPlease:\n1. Change MetaMask RPC to: https://rpc-amoy.polygon.technology/\n2. Or try again in a few seconds';
            } else if (error.reason) {
                errorMessage = `❌ Contract Error\n\n${error.reason}`;
            } else {
                errorMessage = `❌ Transaction Failed\n\n${error.message.substring(0, 150)}`;
            }

            alert(errorMessage);
        } finally {
            setFeeding(false);
            setFeedingStatus('');
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
                    className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">🍖 Feed Your NFT</h2>
                            <p className="text-slate-400">{nftName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-2xl transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Food Options */}
                    <div className="space-y-3 mb-6">
                        {foodOptions.map((food) => (
                            <motion.button
                                key={food.type}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedFood(food)}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${selectedFood?.type === food.type
                                    ? 'border-primary-500 bg-primary-500/20'
                                    : 'border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${food.color} rounded-xl flex items-center justify-center text-2xl`}>
                                        {food.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold text-lg">{food.name}</div>
                                        <div className="text-sm text-slate-400 mb-1">{food.description}</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-secondary-400 font-bold">+{food.xp} XP</span>
                                            <span className="text-accent-400 font-bold">{food.price} MATIC</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Selected Food Info */}
                    {selectedFood && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                        >
                            <h3 className="font-semibold mb-2">Selected: {selectedFood.name}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">XP Gain:</span>
                                    <span className="ml-2 text-secondary-400 font-bold">+{selectedFood.xp}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Cost:</span>
                                    <span className="ml-2 text-accent-400 font-bold">{selectedFood.price} MATIC</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={feeding}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFeed}
                            disabled={!selectedFood || feeding}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {feeding ? (
                                <span className="flex flex-col items-center justify-center gap-1">
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⟳</span>
                                        {feedingStatus.includes('✅') ? 'Success!' : 'Processing...'}
                                    </span>
                                    <span className="text-xs opacity-80 whitespace-pre-line">{feedingStatus}</span>
                                </span>
                            ) : (
                                `Feed ${selectedFood ? selectedFood.name : 'NFT'}`
                            )}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                            💡 <strong>Tip:</strong> Higher quality food gives more XP and helps your NFT level up faster!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}