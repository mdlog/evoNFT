import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import {
    NFT_CONTRACT,
    STAKING_CONTRACT,
    BREEDING_CONTRACT,
    NFT_ABI,
    STAKING_ABI,
    BREEDING_ABI
} from '../config/contractsExtended';

/**
 * Hook untuk NFT Extended Contract
 */
export function useNFTExtended() {
    const { provider, signer } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);

    useEffect(() => {
        if (!NFT_CONTRACT) return;

        if (provider) {
            const readContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
            setContract(readContract);
        }

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
        if (!STAKING_CONTRACT) return;

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
                console.error('Error loading stakes:', error);
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
 */
export function useNFTStats(tokenId) {
    const { contract } = useNFTExtended();
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) return;

        async function loadStats() {
            try {
                const [statsArray, progressData] = await Promise.all([
                    contract.getTokenStats(tokenId),
                    contract.getTokenProgress(tokenId)
                ]);

                setStats({
                    strength: Number(statsArray[0]),
                    intelligence: Number(statsArray[1]),
                    speed: Number(statsArray[2]),
                    endurance: Number(statsArray[3]),
                    luck: Number(statsArray[4])
                });

                setProgress({
                    currentXP: Number(progressData[0]),
                    currentLevel: Number(progressData[1]),
                    xpForNextLevel: Number(progressData[2]),
                    xpProgress: Number(progressData[3])
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading stats:', error);
                setLoading(false);
            }
        }

        loadStats();
    }, [contract, tokenId]);

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
