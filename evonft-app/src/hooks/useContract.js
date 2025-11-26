import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/RainbowWeb3Context';
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
        console.log('🔄 useContract effect triggered');
        console.log('📍 CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
        console.log('🌐 Provider:', provider ? 'Available' : 'Not available');
        console.log('✍️  Signer:', signer ? 'Available' : 'Not available');

        if (!CONTRACT_ADDRESS) {
            console.error('❌ Contract address not configured');
            setError('Contract address not configured');
            setLoading(false);
            return;
        }

        async function initContract() {
            try {
                // Read-only contract
                if (provider) {
                    console.log('🔧 Creating read-only contract...');
                    const readContract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        CONTRACT_ABI,
                        provider
                    );

                    // Verify contract exists
                    try {
                        const network = await provider.getNetwork();
                        console.log('🌐 Network:', network.name, 'Chain ID:', network.chainId.toString());

                        const code = await provider.getCode(CONTRACT_ADDRESS);
                        console.log('📝 Contract code length:', code.length);

                        if (code === '0x') {
                            console.error('❌ No contract found at address:', CONTRACT_ADDRESS);
                            console.error('   Network:', network.name, '(Chain ID:', network.chainId.toString(), ')');
                            console.error('   Expected: Polygon Amoy (Chain ID: 80002)');
                            setError(`Contract not found on ${network.name}. Please switch to Polygon Amoy.`);
                            setLoading(false);
                            return;
                        }

                        console.log('✅ Contract verified on', network.name);
                    } catch (verifyErr) {
                        console.error('❌ Contract verification error:', verifyErr);
                    }

                    setContract(readContract);
                    console.log('✅ Read-only contract initialized');
                }

                // Contract with signer (for write operations)
                if (signer) {
                    console.log('🔧 Creating contract with signer...');
                    const writeContract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        CONTRACT_ABI,
                        signer
                    );
                    setContractWithSigner(writeContract);
                    console.log('✅ Contract with signer initialized');
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
            console.log('⏸️ useNFT: Waiting for contract or tokenId');
            return;
        }

        async function loadNFT() {
            try {
                console.log(`🔍 Loading NFT #${tokenId}...`);
                setLoading(true);
                setError(null);

                // Get token URI
                const uri = await contract.tokenURI(tokenId);
                console.log(`   URI: ${uri}`);

                // Get evolution info
                const [version, lastEvolved, nextEvolveTime] =
                    await contract.getEvolutionInfo(tokenId);

                // Get owner
                const owner = await contract.ownerOf(tokenId);

                // Check if can evolve
                const canEvolve = await contract.canEvolve(tokenId);

                // Get XP from contract
                let xp = 0;
                try {
                    const tokenXP = await contract.tokenXP(tokenId);
                    xp = Number(tokenXP);
                    console.log(`   ✅ XP from contract: ${xp}`);
                } catch (xpErr) {
                    console.warn(`   ⚠️ Could not get XP:`, xpErr.message);
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

                // Try to fetch metadata from IPFS
                try {
                    const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    console.log(`   Fetching metadata from: ${metadataUrl}`);

                    const response = await fetch(metadataUrl, { timeout: 10000 });

                    if (response.ok) {
                        const fetchedMetadata = await response.json();
                        metadata = { ...metadata, ...fetchedMetadata };
                        console.log(`   ✅ Metadata loaded`);
                    } else {
                        console.warn(`   ⚠️ IPFS fetch failed (${response.status}), using default`);
                    }
                } catch (metadataErr) {
                    console.warn(`   ⚠️ IPFS error:`, metadataErr.message);
                    console.log(`   ℹ️ Using default metadata`);
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
            console.log('⏸️ useMyNFTs: Waiting for contract and account');
            console.log('   Contract:', contract ? 'Available' : 'Not available');
            console.log('   Account:', account || 'Not connected');
            return;
        }

        async function loadNFTs() {
            try {
                console.log('📦 Loading NFTs for account:', account);
                console.log('📍 Contract address:', contract.target || contract.address);
                console.log('🌐 Provider:', contract.runner ? 'Available' : 'Not available');

                setLoading(true);
                setError(null);

                // Verify contract is deployed
                try {
                    const code = await contract.runner.provider.getCode(contract.target || contract.address);
                    if (code === '0x') {
                        throw new Error('Contract not deployed at this address');
                    }
                    console.log('✅ Contract verified at address');
                } catch (verifyErr) {
                    console.error('❌ Contract verification failed:', verifyErr);
                    throw new Error('Contract not found. Please check network and contract address.');
                }

                // Get balance with retry logic
                console.log('💰 Checking balance...');
                let tokenCount = 0;

                try {
                    const balance = await contract.balanceOf(account);
                    tokenCount = Number(balance);
                    console.log('💰 Balance:', tokenCount, 'NFTs');
                } catch (balanceErr) {
                    console.error('❌ balanceOf failed:', balanceErr.message);

                    // Check if it's a network/RPC issue
                    if (balanceErr.message.includes('missing revert data') ||
                        balanceErr.message.includes('CALL_EXCEPTION')) {
                        throw new Error('Network connection issue. Please check:\n• You are on Polygon Amoy network\n• RPC endpoint is working\n• Contract is deployed');
                    }

                    // For other errors, try to continue with scanning
                    console.warn('⚠️ Falling back to token scanning method');
                    tokenCount = -1; // Flag to use scanning method
                }

                if (tokenCount === 0) {
                    console.log('📭 No NFTs found');
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
                    console.log('🔢 Total minted:', Number(totalMinted));
                } catch (mintErr) {
                    console.error('❌ totalMinted failed:', mintErr.message);
                    throw new Error('Cannot read contract data. Please verify:\n• Network is Polygon Amoy (Chain ID: 80002)\n• Contract address is correct\n• RPC endpoint is responsive');
                }

                const ownedTokens = [];
                const maxToScan = Math.min(Number(totalMinted), 100); // Limit scanning to prevent timeout

                console.log(`🔍 Scanning ${maxToScan} tokens...`);

                for (let i = 0; i < maxToScan; i++) {
                    try {
                        const owner = await contract.ownerOf(i);
                        if (owner.toLowerCase() === account.toLowerCase()) {
                            ownedTokens.push(i);
                            console.log('✅ Found owned token:', i);
                        }
                    } catch (err) {
                        // Token might not exist or burned
                        continue;
                    }
                }

                console.log('📋 Owned tokens:', ownedTokens);

                if (ownedTokens.length === 0) {
                    console.log('📭 No owned NFTs found after scanning');
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                // Load metadata for each token
                console.log('📥 Loading metadata for', ownedTokens.length, 'NFTs...');

                const nftPromises = ownedTokens.map(async (tokenId) => {
                    try {
                        console.log(`🔍 Loading NFT #${tokenId}...`);

                        const uri = await contract.tokenURI(tokenId);
                        console.log(`   URI: ${uri}`);

                        const [version, lastEvolved, nextEvolveTime] =
                            await contract.getEvolutionInfo(tokenId);
                        const canEvolve = await contract.canEvolve(tokenId);

                        // Default metadata in case IPFS fails
                        let metadata = {
                            name: `EvoNFT #${tokenId}`,
                            description: 'An evolving NFT',
                            level: 1,
                            rarity: 'Common',
                            attributes: []
                        };

                        // Try to fetch metadata from IPFS
                        try {
                            const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                            console.log(`   Fetching metadata from: ${metadataUrl}`);

                            const response = await fetch(metadataUrl, { timeout: 10000 });

                            if (response.ok) {
                                const fetchedMetadata = await response.json();
                                metadata = { ...metadata, ...fetchedMetadata };
                                console.log(`   ✅ Loaded metadata:`, metadata.name);
                            } else {
                                console.warn(`   ⚠️ IPFS fetch failed (${response.status}), using default`);
                            }
                        } catch (metadataErr) {
                            console.warn(`   ⚠️ IPFS error:`, metadataErr.message);
                            console.log(`   ℹ️ Using default metadata`);
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

                console.log('✅ Successfully loaded', validNFTs.length, 'NFTs');
                console.log('📦 NFT Data:', validNFTs);
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
        if (!contract) {
            setLoading(true);
            return;
        }

        async function loadStats() {
            try {
                console.log('📊 Loading contract stats...');
                console.log('📍 Contract address:', contract.target || contract.address);

                const [totalMinted, maxSupply, mintPrice, cooldown] = await Promise.all([
                    contract.totalMinted(),
                    contract.maxSupply(),
                    contract.mintPrice(),
                    contract.cooldown()
                ]);

                const statsData = {
                    totalMinted: Number(totalMinted),
                    maxSupply: Number(maxSupply),
                    mintPrice: ethers.formatEther(mintPrice),
                    cooldown: Number(cooldown)
                };

                console.log('✅ Stats loaded:', statsData);

                setStats(statsData);

                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading stats:', err);
                console.error('Contract:', contract);
                setLoading(false);
            }
        }

        loadStats();
    }, [contract]);

    return { stats, loading };
}
