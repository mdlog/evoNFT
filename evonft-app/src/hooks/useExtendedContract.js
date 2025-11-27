import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/RainbowWeb3Context';
import {
    NFT_CONTRACT,
    STAKING_CONTRACT,
    BREEDING_CONTRACT,
    NFT_ABI,
    STAKING_ABI,
    BREEDING_ABI
} from '../config/contractsExtended';

// Fallback RPC provider
const FALLBACK_RPC = 'https://rpc-amoy.polygon.technology';
const fallbackProvider = new ethers.JsonRpcProvider(FALLBACK_RPC);

/**
 * Hook untuk NFT Extended Contract
 */
export function useNFTExtended() {
    const { provider, signer } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);

    useEffect(() => {
        if (!NFT_CONTRACT) return;

        // Always create read-only contract with fallback provider
        const readContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, fallbackProvider);
        setContract(readContract);

        // Create contract with provider if available
        if (provider) {
            const providerContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
            setContract(providerContract);
        }

        // Create contract with signer if available
        if (signer) {
            const writeContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
            setContractWithSigner(writeContract);
        }
    }, [provider, signer]);

    return { contract, contractWithSigner };
}

/**
 * Hook untuk Staking Contract
 */
export function useStaking() {
    const { provider, signer, account } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [userStakes, setUserStakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!STAKING_CONTRACT) {
            console.warn('⚠️ STAKING_CONTRACT not set');
            return;
        }

        if (provider) {
            const readContract = new ethers.Contract(STAKING_CONTRACT, STAKING_ABI, provider);
            setContract(readContract);
        }

        if (signer) {
            const writeContract = new ethers.Contract(STAKING_CONTRACT, STAKING_ABI, signer);
            setContractWithSigner(writeContract);
        }
    }, [provider, signer]);

    useEffect(() => {
        if (!contract || !account) return;

        async function loadStakes() {
            try {
                const stakes = await contract.getUserStakes(account);
                setUserStakes(stakes.map(s => Number(s)));
                setLoading(false);
            } catch (error) {
                console.error('❌ Error loading stakes:', error);
                setLoading(false);
            }
        }

        loadStakes();
    }, [contract, account]);

    return { contract, contractWithSigner, userStakes, loading };
}

/**
 * Hook untuk Breeding Contract
 */
export function useBreeding() {
    const { provider, signer } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);

    useEffect(() => {
        if (!BREEDING_CONTRACT) return;

        if (provider) {
            const readContract = new ethers.Contract(BREEDING_CONTRACT, BREEDING_ABI, provider);
            setContract(readContract);
        }

        if (signer) {
            const writeContract = new ethers.Contract(BREEDING_CONTRACT, BREEDING_ABI, signer);
            setContractWithSigner(writeContract);
        }
    }, [provider, signer]);

    return { contract, contractWithSigner };
}

/**
 * Hook untuk NFT Stats & Progress
 * @param {number} tokenId - Token ID
 * @param {number} refreshKey - Optional refresh trigger
 */
export function useNFTStats(tokenId, refreshKey = 0) {
    const { contract } = useNFTExtended();
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) {
            return;
        }

        async function loadStats() {
            try {
                let statsArray = null;
                let progressData = null;

                try {
                    statsArray = await contract.getTokenStats(tokenId);
                } catch (statsErr) {
                    // Silent fallback
                }

                try {
                    progressData = await contract.getTokenProgress(tokenId);
                } catch (progressErr) {
                    // Silent fallback
                }

                if (statsArray && progressData) {
                    const statsObj = {
                        strength: Number(statsArray[0]),
                        intelligence: Number(statsArray[1]),
                        speed: Number(statsArray[2]),
                        endurance: Number(statsArray[3]),
                        luck: Number(statsArray[4])
                    };

                    setStats(statsObj);

                    const progressObj = {
                        currentXP: Number(progressData[0]),
                        currentLevel: Number(progressData[1]),
                        xpForNextLevel: Number(progressData[2]),
                        xpProgress: Number(progressData[3])
                    };

                    setProgress(progressObj);
                } else {
                    if (statsArray) {
                        const statsObj = {
                            strength: Number(statsArray[0]),
                            intelligence: Number(statsArray[1]),
                            speed: Number(statsArray[2]),
                            endurance: Number(statsArray[3]),
                            luck: Number(statsArray[4])
                        };
                        setStats(statsObj);
                    } else {
                        setStats({
                            strength: 5,
                            intelligence: 5,
                            speed: 5,
                            endurance: 5,
                            luck: 5
                        });
                    }

                    let currentXP = 0;
                    let currentLevel = 1;
                    try {
                        currentXP = Number(await contract.tokenXP(tokenId));
                        currentLevel = Number(await contract.version(tokenId));
                    } catch (xpErr) {
                        // Silent fallback
                    }

                    const xpForNextLevel = (currentLevel + 1) * 1000;
                    const xpProgress = Math.min(100, Math.floor((currentXP / xpForNextLevel) * 100));

                    setProgress({
                        currentXP,
                        currentLevel,
                        xpForNextLevel,
                        xpProgress
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error('❌ Error loading stats:', error);
                setLoading(false);
            }
        }

        loadStats();
    }, [contract, tokenId, refreshKey]);

    return { stats, progress, loading };
}

/**
 * Hook untuk Staking Info
 */
export function useStakingInfo(tokenId) {
    const { contract } = useStaking();
    const [stakeInfo, setStakeInfo] = useState(null);
    const [pendingRewards, setPendingRewards] = useState(null);
    const [tier, setTier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) return;

        async function loadInfo() {
            try {
                const [info, rewards, tierInfo] = await Promise.all([
                    contract.getStakeInfo(tokenId),
                    contract.getPendingRewards(tokenId),
                    contract.getStakeTier(tokenId)
                ]);

                setStakeInfo({
                    owner: info[0],
                    stakedAt: Number(info[1]),
                    lastClaimAt: Number(info[2]),
                    daysStaked: Number(info[3]),
                    pendingXP: Number(info[4]),
                    pendingMatic: Number(info[5])
                });

                setPendingRewards({
                    xp: Number(rewards[0]),
                    matic: ethers.formatEther(rewards[1])
                });

                setTier({
                    name: tierInfo[0],
                    bonus: Number(tierInfo[1])
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading staking info:', error);
                setStakeInfo(null);
                setLoading(false);
            }
        }

        loadInfo();
    }, [contract, tokenId]);

    return { stakeInfo, pendingRewards, tier, loading };
}

/**
 * Hook untuk Breeding Info
 */
export function useBreedingInfo(breedingId) {
    const { contract } = useBreeding();
    const [breedingInfo, setBreedingInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || breedingId === undefined) return;

        async function loadInfo() {
            try {
                const info = await contract.getBreedingInfo(breedingId);

                setBreedingInfo({
                    parent1: Number(info[0]),
                    parent2: Number(info[1]),
                    owner: info[2],
                    startTime: Number(info[3]),
                    completed: info[4],
                    offspringId: Number(info[5]),
                    timeRemaining: Number(info[6])
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading breeding info:', error);
                setLoading(false);
            }
        }

        loadInfo();
    }, [contract, breedingId]);

    return { breedingInfo, loading };
}

/**
 * Hook untuk Pool Statistics
 */
export function usePoolStats() {
    const { contract } = useStaking();
    const { account } = useWeb3();
    const [poolStats, setPoolStats] = useState({
        totalStaked: 0,
        userStakedCount: 0,
        contractBalance: '0'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract) {
            return;
        }

        async function loadPoolStats() {
            try {
                const totalStaked = await contract.totalStaked();
                const userStakes = account ? await contract.getUserStakes(account) : [];
                const contractAddress = contract.target || contract.address;
                const balance = await contract.provider.getBalance(contractAddress);

                setPoolStats({
                    totalStaked: Number(totalStaked),
                    userStakedCount: userStakes.length,
                    contractBalance: ethers.formatEther(balance)
                });

                setLoading(false);
            } catch (error) {
                console.error('❌ Error loading pool stats:', error);
                setLoading(false);
            }
        }

        loadPoolStats();

        // Refresh every 30 seconds
        const interval = setInterval(loadPoolStats, 30000);
        return () => clearInterval(interval);
    }, [contract, account]);

    return { poolStats, loading };
}
