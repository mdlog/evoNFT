import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNFTExtended, useNFTStats } from '../hooks/useExtendedContract';
import { ethers } from 'ethers';

export default function TrainModal({ isOpen, onClose, tokenId, nftName, onSuccess }) {
    const { contract, contractWithSigner } = useNFTExtended();
    const { stats, loading } = useNFTStats(tokenId);
    const [training, setTraining] = useState(false);
    const [trainingStatus, setTrainingStatus] = useState('');
    const [selectedStat, setSelectedStat] = useState(null);
    const [trainPrice, setTrainPrice] = useState('0.3');

    useEffect(() => {
        if (contract) {
            contract.getTrainPrice().then(price => {
                setTrainPrice(ethers.formatEther(price));
            }).catch(err => {
                console.warn('⚠️ Could not get train price, using default:', err.message);
            });
        }
    }, [contract]);

    const TRAIN_PRICE = trainPrice;

    const statOptions = [
        {
            type: 0,
            name: 'Strength',
            icon: '💪',
            description: 'Physical power and combat ability',
            color: 'from-red-500 to-red-600',
            current: stats?.strength || 0
        },
        {
            type: 1,
            name: 'Intelligence',
            icon: '🧠',
            description: 'Learning speed and problem solving',
            color: 'from-blue-500 to-blue-600',
            current: stats?.intelligence || 0
        },
        {
            type: 2,
            name: 'Speed',
            icon: '⚡',
            description: 'Agility and reaction time',
            color: 'from-yellow-500 to-yellow-600',
            current: stats?.speed || 0
        },
        {
            type: 3,
            name: 'Endurance',
            icon: '🛡️',
            description: 'Stamina and durability',
            color: 'from-green-500 to-green-600',
            current: stats?.endurance || 0
        },
        {
            type: 4,
            name: 'Luck',
            icon: '🍀',
            description: 'Fortune and rare event chances',
            color: 'from-purple-500 to-purple-600',
            current: stats?.luck || 0
        }
    ];

    async function handleTrain() {
        if (!selectedStat || !contractWithSigner) {
            console.error('❌ Cannot train: missing requirements');
            return;
        }

        try {
            setTraining(true);

            const owner = await contractWithSigner.ownerOf(tokenId);
            const signer = await contractWithSigner.runner.getAddress();

            if (owner.toLowerCase() !== signer.toLowerCase()) {
                throw new Error('You are not the owner of this NFT');
            }

            // Pre-check: verify stat not maxed
            if (selectedStat.current >= 100) {
                throw new Error('This stat is already at maximum (100)');
            }

            let gasLimit;
            try {
                gasLimit = await contractWithSigner.train.estimateGas(tokenId, selectedStat.type, {
                    value: ethers.parseEther(TRAIN_PRICE)
                });
            } catch (estimateError) {
                console.error('❌ Gas estimation failed:', estimateError.message);

                // Check specific errors
                if (estimateError.message.includes('ERC721: invalid token ID')) {
                    throw new Error(`NFT #${tokenId} does not exist`);
                }
                if (estimateError.message.includes('Not token owner')) {
                    throw new Error('You are not the owner of this NFT');
                }
                if (estimateError.message.includes('Stat already maxed')) {
                    throw new Error('This stat is already at maximum (100)');
                }

                // Generic error
                throw new Error('Transaction will fail. Please check: 1) NFT exists, 2) You own it, 3) Stat not maxed, 4) Sufficient balance');
            }

            setTrainingStatus('Sending transaction...');
            const tx = await contractWithSigner.train(tokenId, selectedStat.type, {
                value: ethers.parseEther(TRAIN_PRICE),
                gasLimit: gasLimit
            });

            setTrainingStatus(`Waiting for confirmation...\nTx: ${tx.hash.slice(0, 10)}...`);
            
            const receipt = await tx.wait();

            setTrainingStatus('✅ Success! Updating data...');

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Show success for 1 second then close
            await new Promise(resolve => setTimeout(resolve, 1000));
            onClose();

        } catch (error) {
            console.error('❌ Train error:', error);

            let errorMessage = 'Failed to train NFT';

            // Check for specific error types
            if (error.message.includes('user rejected') || error.code === 'ACTION_REJECTED') {
                errorMessage = '❌ Transaction Cancelled\n\nYou rejected the transaction in your wallet.';
            } else if (error.message.includes('insufficient funds') || error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = `💰 Insufficient Balance!\n\nYou need ${TRAIN_PRICE} MATIC + gas fees (~0.001 MATIC)\nTotal required: ~${(parseFloat(TRAIN_PRICE) + 0.001).toFixed(3)} MATIC\n\nYour current balance is too low.\nPlease add more MATIC to your wallet.`;
            } else if (error.message.includes('Stat already maxed')) {
                errorMessage = `🎯 Stat Already Maxed!\n\n${selectedStat?.name || 'This stat'} is already at maximum (100/100).\n\nYou cannot train this stat further.`;
            } else if (error.message.includes('Not token owner')) {
                errorMessage = '🚫 Not Owner\n\nYou are not the owner of this NFT.\n\nOnly the owner can train their NFT.';
            } else if (error.message.includes('does not exist') || error.message.includes('invalid token ID')) {
                errorMessage = `🚫 NFT Not Found\n\nNFT #${tokenId} does not exist.\n\nPlease check the token ID.`;
            } else if (error.message.includes('Transaction will fail')) {
                errorMessage = `⚠️ Transaction Will Fail\n\nPre-flight check failed. Please verify:\n\n1. NFT #${tokenId} exists\n2. You own this NFT\n3. Stat is not maxed (< 100)\n4. You have at least ${(parseFloat(TRAIN_PRICE) + 0.01).toFixed(2)} MATIC`;
            } else if (error.reason) {
                errorMessage = `❌ Contract Error\n\n${error.reason}`;
            } else {
                errorMessage = `❌ Transaction Failed\n\n${error.message.substring(0, 150)}`;
            }

            alert(errorMessage);

            // Silent error handling
        } finally {
            setTraining(false);
            setTrainingStatus('');
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
                    className="glass-strong rounded-2xl border border-primary-500/50 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">💪 Train Your NFT</h2>
                            <p className="text-slate-400">{nftName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-2xl transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin text-4xl mb-2">⟳</div>
                            <p className="text-slate-400">Loading stats...</p>
                        </div>
                    )}

                    {/* Stat Options */}
                    {!loading && (
                        <div className="space-y-3 mb-6">
                            {statOptions.map((stat) => {
                                const isMaxed = stat.current >= 100;

                                return (
                                    <motion.button
                                        key={stat.type}
                                        whileHover={!isMaxed ? { scale: 1.02 } : {}}
                                        whileTap={!isMaxed ? { scale: 0.98 } : {}}
                                        onClick={() => !isMaxed && setSelectedStat(stat)}
                                        disabled={isMaxed}
                                        className={`w-full p-4 rounded-xl border-2 transition-all ${selectedStat?.type === stat.type
                                            ? 'border-primary-500 bg-primary-500/20'
                                            : isMaxed
                                                ? 'border-slate-800 bg-slate-800/50 opacity-50 cursor-not-allowed'
                                                : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl ${isMaxed ? 'opacity-50' : ''}`}>
                                                {stat.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-lg">{stat.name}</span>
                                                    <span className={`font-bold ${isMaxed ? 'text-accent-400' : 'text-white'}`}>
                                                        {stat.current}/100 {isMaxed && '(MAX)'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-400 mb-2">{stat.description}</div>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-slate-800 rounded-full h-2">
                                                    <div
                                                        className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all`}
                                                        style={{ width: `${stat.current}%` }}
                                                    ></div>
                                                </div>

                                                {!isMaxed && (
                                                    <div className="mt-2 text-xs text-slate-500">
                                                        Next: {stat.current + 1}/100 (+1 stat, +100 XP)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}

                    {/* Selected Stat Info */}
                    {selectedStat && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                        >
                            <h3 className="font-semibold mb-2">Training: {selectedStat.name}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Current:</span>
                                    <span className="ml-2 text-white font-bold">{selectedStat.current}/100</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">After:</span>
                                    <span className="ml-2 text-secondary-400 font-bold">{selectedStat.current + 1}/100</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">XP Gain:</span>
                                    <span className="ml-2 text-secondary-400 font-bold">+100</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Cost:</span>
                                    <span className="ml-2 text-accent-400 font-bold">{TRAIN_PRICE} MATIC</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={training}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleTrain}
                            disabled={!selectedStat || training || loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {training ? (
                                <span className="flex flex-col items-center justify-center gap-1">
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⟳</span>
                                        {trainingStatus.includes('✅') ? 'Success!' : 'Processing...'}
                                    </span>
                                    <span className="text-xs opacity-80 whitespace-pre-line">{trainingStatus}</span>
                                </span>
                            ) : (
                                `Train ${selectedStat ? selectedStat.name : 'Stat'}`
                            )}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                        <p className="text-sm text-blue-200">
                            💡 <strong>Tip:</strong> Each training session increases the selected stat by 1 and gives 100 XP. Stats cap at 100.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}