import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { CONTRACT_ADDRESS } from '../config/contracts';

/**
 * Hook to fetch all minted NFTs from blockchain (optimized)
 * Uses contract address directly for faster loading
 */
export function useAllNFTs() {
    const { contract } = useContract();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalMinted, setTotalMinted] = useState(0);

    useEffect(() => {
        if (!contract) {
            console.log('⏸️ useAllNFTs: Waiting for contract');
            return;
        }

        async function loadAllNFTs() {
            try {
                console.log('🌍 Loading all NFTs from blockchain (optimized)...');
                console.log('📍 Contract Address:', CONTRACT_ADDRESS);
                setLoading(true);

                // Get total minted
                const total = await contract.totalMinted();
                const totalNum = Number(total);
                setTotalMinted(totalNum);

                console.log(`   Total minted: ${totalNum}`);

                if (totalNum === 0) {
                    console.log('   No NFTs minted yet');
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                // Fetch all NFTs in parallel (on-chain data only for speed)
                const nftPromises = [];
                for (let i = 0; i < totalNum; i++) {
                    nftPromises.push(loadNFTBasic(i));
                }

                const loadedNFTs = await Promise.all(nftPromises);
                const validNFTs = loadedNFTs.filter(nft => nft !== null);

                console.log(`   ✅ Loaded ${validNFTs.length} NFTs (on-chain data)`);
                setNfts(validNFTs);
                setLoading(false);

                // Load metadata in background (non-blocking)
                loadMetadataInBackground(validNFTs);

            } catch (error) {
                console.error('❌ Error loading all NFTs:', error);
                setLoading(false);
            }
        }

        // Load basic on-chain data only (fast - minimal calls)
        async function loadNFTBasic(tokenId) {
            try {
                // Only fetch essential data: owner and level
                const [owner, version] = await Promise.all([
                    contract.ownerOf(tokenId),
                    contract.version(tokenId)
                ]);

                const level = Number(version);

                // Generate random creature type for placeholder (lowercase)
                const commonCreatures = ['cat', 'rabbit'];
                const randomCreature = commonCreatures[tokenId % commonCreatures.length];

                // Return minimal on-chain data immediately
                return {
                    id: tokenId,
                    owner,
                    xp: 0, // Will be loaded on-demand if needed
                    level,
                    uri: '', // Skip URI fetch for speed
                    nextEvolveTime: 0,
                    canEvolve: false,
                    // Default metadata (will be updated in background)
                    name: `EvoNFT #${tokenId}`,
                    description: 'An evolving NFT',
                    rarity: 'common',
                    creatureType: randomCreature, // lowercase for SVG
                    attributes: []
                };

            } catch (error) {
                console.warn(`   ⚠️ Could not load NFT #${tokenId}:`, error.message);
                return null;
            }
        }

        // Load additional data in background (non-blocking)
        async function loadMetadataInBackground(nftList) {
            console.log('🔄 Loading additional data in background...');

            // Load in batches to avoid overwhelming the network
            const batchSize = 5;
            for (let i = 0; i < nftList.length; i += batchSize) {
                const batch = nftList.slice(i, i + batchSize);

                await Promise.all(batch.map(async (nft) => {
                    try {
                        // Get URI first
                        const uri = await contract.tokenURI(nft.id);

                        // Try to fetch metadata with short timeout
                        const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

                        const response = await fetch(metadataUrl, {
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);

                        if (response.ok) {
                            const metadata = await response.json();

                            // Normalize creatureType to lowercase for SVG compatibility
                            if (metadata.creatureType) {
                                metadata.creatureType = metadata.creatureType.toLowerCase();
                            }

                            // Update NFT with metadata
                            setNfts(prevNfts =>
                                prevNfts.map(n =>
                                    n.id === nft.id
                                        ? { ...n, uri, ...metadata }
                                        : n
                                )
                            );
                        }
                    } catch (err) {
                        // Silently fail for metadata (already have on-chain data)
                    }
                }));

                // Small delay between batches
                if (i + batchSize < nftList.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        }

        loadAllNFTs();
    }, [contract]);

    return { nfts, loading, totalMinted };
}
