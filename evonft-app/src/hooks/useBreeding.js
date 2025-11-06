import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/RainbowWeb3Context';
import { BREEDING_CONTRACT, BREEDING_ABI, NFT_CONTRACT, NFT_ABI } from '../config/contractsExtended';

/**
 * Hook for Breeding Contract
 */
export function useBreeding() {
    const { provider, signer } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!BREEDING_CONTRACT) {
            console.warn('⚠️ BREEDING_CONTRACT not set');
            setLoading(false);
            return;
        }

        console.log('🧬 Initializing Breeding Contract:', BREEDING_CONTRACT);

        if (provider) {
            const readContract = new ethers.Contract(BREEDING_CONTRACT, BREEDING_ABI, provider);
            setContract(readContract);
            console.log('✅ Breeding read contract initialized');
        }

        if (signer) {
            const writeContract = new ethers.Contract(BREEDING_CONTRACT, BREEDING_ABI, signer);
            setContractWithSigner(writeContract);
            console.log('✅ Breeding write contract initialized');
        }
    }, [provider, signer]);

    // Load breeding configuration
    useEffect(() => {
        if (!contract) return;

        async function loadConfig() {
            try {
                const [fee, cooldown, maxCount] = await Promise.all([
                    contract.breedingFee(),
                    contract.breedingCooldown(),
                    contract.maxBreedCount()
                ]);

                setConfig({
                    breedingFee: ethers.formatEther(fee),
                    breedingFeeWei: fee,
                    cooldown: Number(cooldown),
                    maxBreedCount: Number(maxCount)
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading breeding config:', error);
                setLoading(false);
            }
        }

        loadConfig();
    }, [contract]);

    return { contract, contractWithSigner, config, loading };
}

/**
 * Hook for NFT Breeding Info
 */
export function useNFTBreedingInfo(tokenId) {
    const { contract } = useBreeding();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) return;

        async function loadInfo() {
            try {
                const breedingInfo = await contract.getBreedingInfo(tokenId);

                setInfo({
                    breedCount: Number(breedingInfo[0]),
                    lastBreedTime: Number(breedingInfo[1]),
                    generation: Number(breedingInfo[2]),
                    canBreedNow: breedingInfo[3],
                    timeUntilBreedable: Number(breedingInfo[4])
                });

                setLoading(false);
            } catch (error) {
                console.error('Error loading breeding info:', error);
                setInfo(null);
                setLoading(false);
            }
        }

        loadInfo();
    }, [contract, tokenId]);

    return { info, loading };
}

/**
 * Hook for Offspring Prediction
 */
export function useOffspringPrediction(parent1Id, parent2Id) {
    const { contract } = useBreeding();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || parent1Id === undefined || parent2Id === undefined) {
            setLoading(false);
            return;
        }

        async function loadPrediction() {
            try {
                const stats = await contract.predictOffspringStats(parent1Id, parent2Id);

                setPrediction({
                    strength: Number(stats[0]),
                    speed: Number(stats[1]),
                    intelligence: Number(stats[2]),
                    defense: Number(stats[3]),
                    luck: Number(stats[4]),
                    generation: Number(stats[5])
                });

                setLoading(false);
            } catch (error) {
                console.error('Error predicting offspring:', error);
                setPrediction(null);
                setLoading(false);
            }
        }

        loadPrediction();
    }, [contract, parent1Id, parent2Id]);

    return { prediction, loading };
}

/**
 * Hook for Breeding Actions
 */
export function useBreedingActions() {
    const { contractWithSigner: breedingContract } = useBreeding();
    const { signer } = useWeb3();
    const [breeding, setBreeding] = useState(false);

    const breed = async (parent1Id, parent2Id, breedingFee) => {
        if (!breedingContract || !signer) {
            throw new Error('Contract or signer not available');
        }

        try {
            setBreeding(true);
            console.log(`🧬 Breeding NFT #${parent1Id} with #${parent2Id}...`);

            // Total cost = breeding fee + mint price (0.01 MATIC)
            const mintPrice = ethers.parseEther("0.01");
            const totalCost = BigInt(breedingFee) + BigInt(mintPrice);

            const tx = await breedingContract.breed(parent1Id, parent2Id, {
                value: totalCost
            });

            console.log('Transaction sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt.hash);

            // Extract offspring ID from event
            const bredEvent = receipt.logs.find(log => {
                try {
                    const parsed = breedingContract.interface.parseLog(log);
                    return parsed.name === 'Bred';
                } catch {
                    return false;
                }
            });

            let offspringId = null;
            if (bredEvent) {
                const parsed = breedingContract.interface.parseLog(bredEvent);
                offspringId = Number(parsed.args.offspringId);
                console.log('✅ Offspring ID:', offspringId);
            }

            setBreeding(false);
            return { success: true, offspringId, txHash: receipt.hash };

        } catch (error) {
            console.error('Breeding error:', error);
            setBreeding(false);
            throw error;
        }
    };

    return { breed, breeding };
}

/**
 * Hook to check if two NFTs can breed
 */
export function useCanBreedPair(parent1Id, parent2Id) {
    const { contract } = useBreeding();
    const { provider } = useWeb3();
    const [canBreed, setCanBreed] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || !provider || parent1Id === undefined || parent2Id === undefined) {
            setLoading(false);
            return;
        }

        async function checkCanBreed() {
            try {
                // Check if same NFT
                if (parent1Id === parent2Id) {
                    setCanBreed(false);
                    setReason('Cannot breed with self');
                    setLoading(false);
                    return;
                }

                // Check both NFTs individually
                const [canBreed1, canBreed2] = await Promise.all([
                    contract.canBreed(parent1Id),
                    contract.canBreed(parent2Id)
                ]);

                if (!canBreed1) {
                    setCanBreed(false);
                    setReason(`Parent 1 cannot breed (max breeds or cooldown)`);
                    setLoading(false);
                    return;
                }

                if (!canBreed2) {
                    setCanBreed(false);
                    setReason(`Parent 2 cannot breed (max breeds or cooldown)`);
                    setLoading(false);
                    return;
                }

                // Check ownership
                const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
                const signer = await provider.getSigner();
                const account = await signer.getAddress();

                const [owner1, owner2] = await Promise.all([
                    nftContract.ownerOf(parent1Id),
                    nftContract.ownerOf(parent2Id)
                ]);

                if (owner1.toLowerCase() !== account.toLowerCase()) {
                    setCanBreed(false);
                    setReason('You do not own Parent 1');
                    setLoading(false);
                    return;
                }

                if (owner2.toLowerCase() !== account.toLowerCase()) {
                    setCanBreed(false);
                    setReason('You do not own Parent 2');
                    setLoading(false);
                    return;
                }

                // All checks passed
                setCanBreed(true);
                setReason('');
                setLoading(false);

            } catch (error) {
                console.error('Error checking breed eligibility:', error);
                setCanBreed(false);
                setReason('Error checking eligibility');
                setLoading(false);
            }
        }

        checkCanBreed();
    }, [contract, provider, parent1Id, parent2Id]);

    return { canBreed, reason, loading };
}
