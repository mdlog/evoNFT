import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CURRENT_NETWORK } from '../config/contracts';

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
            setError('Contract address not configured');
            setLoading(false);
            return;
        }

        try {
            // Read-only contract
            if (provider) {
                const readContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    provider
                );
                setContract(readContract);
            }

            // Contract with signer (for write operations)
            if (signer) {
                const writeContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    signer
                );
                setContractWithSigner(writeContract);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error initializing contract:', err);
            setError(err.message);
            setLoading(false);
        }
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
        if (!contract || tokenId === undefined) return;

        async function loadNFT() {
            try {
                setLoading(true);

                // Get token URI
                const uri = await contract.tokenURI(tokenId);

                // Get evolution info
                const [version, lastEvolved, nextEvolveTime, nonce] =
                    await contract.getEvolutionInfo(tokenId);

                // Get owner
                const owner = await contract.ownerOf(tokenId);

                // Check if can evolve
                const canEvolve = await contract.canEvolve(tokenId);

                // Fetch metadata from IPFS
                const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const response = await fetch(metadataUrl);
                const metadata = await response.json();

                setNft({
                    id: tokenId,
                    uri,
                    owner,
                    version: Number(version),
                    lastEvolved: Number(lastEvolved),
                    nextEvolveTime: Number(nextEvolveTime),
                    canEvolve,
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
        if (!contract || !account) return;

        async function loadNFTs() {
            try {
                setLoading(true);

                // Get balance
                const balance = await contract.balanceOf(account);
                const tokenCount = Number(balance);

                if (tokenCount === 0) {
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                // Get all token IDs owned by user
                // Note: This is inefficient for large collections
                // In production, use events or indexer
                const totalMinted = await contract.totalMinted();
                const ownedTokens = [];

                for (let i = 0; i < Number(totalMinted); i++) {
                    try {
                        const owner = await contract.ownerOf(i);
                        if (owner.toLowerCase() === account.toLowerCase()) {
                            ownedTokens.push(i);
                        }
                    } catch (err) {
                        // Token might not exist or burned
                        continue;
                    }
                }

                // Load metadata for each token
                const nftPromises = ownedTokens.map(async (tokenId) => {
                    try {
                        const uri = await contract.tokenURI(tokenId);
                        const [version, lastEvolved, nextEvolveTime] =
                            await contract.getEvolutionInfo(tokenId);
                        const canEvolve = await contract.canEvolve(tokenId);

                        // Fetch metadata
                        const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        const response = await fetch(metadataUrl);
                        const metadata = await response.json();

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
                        console.error(`Error loading NFT ${tokenId}:`, err);
                        return null;
                    }
                });

                const loadedNFTs = await Promise.all(nftPromises);
                setNfts(loadedNFTs.filter(nft => nft !== null));
                setLoading(false);
            } catch (err) {
                console.error('Error loading NFTs:', err);
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
        if (!contract) return;

        async function loadStats() {
            try {
                const [totalMinted, maxSupply, mintPrice, cooldown] = await Promise.all([
                    contract.totalMinted(),
                    contract.maxSupply(),
                    contract.mintPrice(),
                    contract.cooldown()
                ]);

                setStats({
                    totalMinted: Number(totalMinted),
                    maxSupply: Number(maxSupply),
                    mintPrice: ethers.formatEther(mintPrice),
                    cooldown: Number(cooldown)
                });

                setLoading(false);
            } catch (err) {
                console.error('Error loading stats:', err);
                setLoading(false);
            }
        }

        loadStats();
    }, [contract]);

    return { stats, loading };
}
