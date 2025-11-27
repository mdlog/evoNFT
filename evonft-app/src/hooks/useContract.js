import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/RainbowWeb3Context';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CURRENT_NETWORK } from '../config/contracts';

// Fallback RPC provider
const FALLBACK_RPC = 'https://rpc-amoy.polygon.technology';
const fallbackProvider = new ethers.JsonRpcProvider(FALLBACK_RPC);

/**
 * Hook untuk interact dengan smart contract
 */
export function useContract() {
    const { provider, signer, account } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!CONTRACT_ADDRESS) {
            console.error('❌ Contract address not configured');
            setError('Contract address not configured');
            setLoading(false);
            return;
        }

        async function initContract() {
            try {
                const readContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    fallbackProvider
                );

                setContract(readContract);

                if (signer) {
                    const writeContract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        CONTRACT_ABI,
                        signer
                    );
                    setContractWithSigner(writeContract);
                } else if (provider) {
                    const writeContract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        CONTRACT_ABI,
                        provider
                    );
                    setContractWithSigner(writeContract);
                }

                setLoading(false);
            } catch (err) {
                console.error('❌ Error initializing contract:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        initContract();
    }, [provider, signer]);

    return {
        contract,
        contractWithSigner,
        loading,
        error,
        isReady: !!contract && !!contractWithSigner
    };
}

/**
 * Hook untuk NFT operations
 */
export function useNFT(tokenId) {
    const { contract } = useContract();
    const [nft, setNft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!contract || tokenId === undefined) {
            return;
        }

        async function loadNFT() {
            try {
                setLoading(true);
                setError(null);

                const uri = await contract.tokenURI(tokenId);

                let version = 1, lastEvolved = 0, nextEvolveTime = 0;
                try {
                    [version, lastEvolved, nextEvolveTime] = await contract.getEvolutionInfo(tokenId);
                } catch (e) {
                    // Silent fallback
                }

                const owner = await contract.ownerOf(tokenId);

                let canEvolve = false;
                try {
                    canEvolve = await contract.canEvolve(tokenId);
                } catch (e) {
                    // Silent fallback
                }

                let xp = 0;
                try {
                    const tokenXP = await contract.tokenXP(tokenId);
                    xp = Number(tokenXP);
                } catch (xpErr) {
                    // Silent fallback
                }

                // Default metadata
                let metadata = {
                    name: `EvoNFT #${tokenId}`,
                    description: 'An evolving NFT',
                    image: `https://via.placeholder.com/400/8B5CF6/FFFFFF?text=NFT+${tokenId}`,
                    level: 1,
                    rarity: 'Common',
                    attributes: [],
                    traits: ['🔥', '⚡', '🛡️']
                };

                try {
                    const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);

                    const response = await fetch(metadataUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const fetchedMetadata = await response.json();
                        metadata = { ...metadata, ...fetchedMetadata };
                    }
                } catch (metadataErr) {
                    // Silent fallback to default metadata
                }

                setNft({
                    id: tokenId,
                    uri,
                    owner,
                    version: Number(version),
                    lastEvolved: Number(lastEvolved),
                    nextEvolveTime: Number(nextEvolveTime),
                    canEvolve,
                    xp, // Add XP from contract
                    ...metadata
                });

                setLoading(false);
            } catch (err) {
                console.error('Error loading NFT:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        loadNFT();
    }, [contract, tokenId]);

    return { nft, loading, error };
}

/**
 * Hook untuk user's NFT collection
 */
export function useMyNFTs() {
    const { contract } = useContract();
    const { account } = useWeb3();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!contract || !account) {
            return;
        }

        async function loadNFTs() {
            try {
                setLoading(true);
                setError(null);

                try {
                    const code = await contract.runner.provider.getCode(contract.target || contract.address);
                    if (code === '0x') {
                        throw new Error('Contract not deployed at this address');
                    }
                } catch (verifyErr) {
                    console.error('❌ Contract verification failed:', verifyErr);
                    throw new Error('Contract not found. Please check network and contract address.');
                }

                let tokenCount = 0;

                try {
                    const balance = await contract.balanceOf(account);
                    tokenCount = Number(balance);
                } catch (balanceErr) {
                    console.error('❌ balanceOf failed:', balanceErr.message);

                    if (balanceErr.message.includes('missing revert data') ||
                        balanceErr.message.includes('CALL_EXCEPTION')) {
                        throw new Error('Network connection issue. Please check:\n• You are on Polygon Amoy network\n• RPC endpoint is working\n• Contract is deployed');
                    }

                    tokenCount = -1;
                }

                if (tokenCount === 0) {
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                // Get all token IDs owned by user
                // Note: This is inefficient for large collections
                // In production, use events or indexer
                let totalMinted;
                try {
                    totalMinted = await contract.totalMinted();
                } catch (mintErr) {
                    console.error('❌ totalMinted failed:', mintErr.message);
                    throw new Error('Cannot read contract data. Please verify:\n• Network is Polygon Amoy (Chain ID: 80002)\n• Contract address is correct\n• RPC endpoint is responsive');
                }

                const ownedTokens = [];
                const maxToScan = Math.min(Number(totalMinted), 100);

                for (let i = 0; i < maxToScan; i++) {
                    try {
                        const owner = await contract.ownerOf(i);
                        if (owner.toLowerCase() === account.toLowerCase()) {
                            ownedTokens.push(i);
                        }
                    } catch (err) {
                        continue;
                    }
                }

                if (ownedTokens.length === 0) {
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                const nftPromises = ownedTokens.map(async (tokenId) => {
                    try {
                        const uri = await contract.tokenURI(tokenId);
                        const [version, lastEvolved, nextEvolveTime] =
                            await contract.getEvolutionInfo(tokenId);
                        const canEvolve = await contract.canEvolve(tokenId);

                        let metadata = {
                            name: `EvoNFT #${tokenId}`,
                            description: 'An evolving NFT',
                            level: 1,
                            rarity: 'Common',
                            attributes: []
                        };

                        try {
                            const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                            const response = await fetch(metadataUrl, { timeout: 10000 });

                            if (response.ok) {
                                const fetchedMetadata = await response.json();
                                metadata = { ...metadata, ...fetchedMetadata };
                            }
                        } catch (metadataErr) {
                            // Silent fallback
                        }

                        return {
                            id: tokenId,
                            uri,
                            version: Number(version),
                            lastEvolved: Number(lastEvolved),
                            nextEvolveTime: Number(nextEvolveTime),
                            canEvolve,
                            ...metadata
                        };
                    } catch (err) {
                        console.error(`❌ Error loading NFT ${tokenId}:`, err);
                        // Return basic NFT even if everything fails
                        return {
                            id: tokenId,
                            name: `EvoNFT #${tokenId}`,
                            description: 'An evolving NFT',
                            level: 1,
                            rarity: 'Common',
                            uri: 'error',
                            version: 1,
                            attributes: []
                        };
                    }
                });

                const loadedNFTs = await Promise.all(nftPromises);
                const validNFTs = loadedNFTs.filter(nft => nft !== null && nft !== undefined);

                setNfts(validNFTs);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading NFTs:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        loadNFTs();
    }, [contract, account]);

    return { nfts, loading, error, refetch: () => { } };
}

/**
 * Hook untuk contract stats
 */
export function useContractStats() {
    const { contract } = useContract();
    const [stats, setStats] = useState({
        totalMinted: 0,
        maxSupply: 0,
        mintPrice: '0',
        cooldown: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const statsContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    fallbackProvider
                );

                const [totalMinted, maxSupply, mintPrice, cooldown] = await Promise.all([
                    statsContract.totalMinted(),
                    statsContract.maxSupply(),
                    statsContract.mintPrice(),
                    statsContract.cooldown()
                ]);

                const statsData = {
                    totalMinted: Number(totalMinted),
                    maxSupply: Number(maxSupply),
                    mintPrice: ethers.formatEther(mintPrice),
                    cooldown: Number(cooldown)
                };

                setStats(statsData);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading stats:', err);
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    return { stats, loading };
}
