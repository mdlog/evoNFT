import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { CONTRACT_ADDRESS } from '../config/contracts';

// Simple in-memory cache
const nftCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Ultra-fast NFT loading hook with caching
 * Only loads essential data, skips IPFS entirely for initial load
 */
export function useAllNFTsFast() {
    const { contract } = useContract();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalMinted, setTotalMinted] = useState(0);

    useEffect(() => {
        if (!contract) {
            console.log('⏸️ useAllNFTsFast: Waiting for contract');
            return;
        }

        async function loadAllNFTs() {
            try {
                console.log('⚡ Loading NFTs (ultra-fast mode)...');
                console.log('📍 Contract:', CONTRACT_ADDRESS);

                const startTime = Date.now();
                setLoading(true);

                // Check cache first
                const cacheKey = `nfts_${CONTRACT_ADDRESS}`;
                const cached = nftCache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                    console.log('✅ Loaded from cache');
                    setNfts(cached.data);
                    setTotalMinted(cached.data.length);
                    setLoading(false);
                    return;
                }

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

                // Load only owner and level (2 calls per NFT)
                const nftPromises = [];
                for (let i = 0; i < totalNum; i++) {
                    nftPromises.push(loadMinimalNFT(i));
                }

                const loadedNFTs = await Promise.all(nftPromises);
                const validNFTs = loadedNFTs.filter(nft => nft !== null);

                const loadTime = Date.now() - startTime;
                console.log(`   ✅ Loaded ${validNFTs.length} NFTs in ${loadTime}ms`);

                // Cache the results
                nftCache.set(cacheKey, {
                    data: validNFTs,
                    timestamp: Date.now()
                });

                setNfts(validNFTs);
                setLoading(false);

            } catch (error) {
                console.error('❌ Error loading NFTs:', error);
                setLoading(false);
            }
        }

        // Load absolute minimum data
        async function loadMinimalNFT(tokenId) {
            try {
                // Only 2 calls: owner and level
                const [owner, version] = await Promise.all([
                    contract.ownerOf(tokenId),
                    contract.version(tokenId)
                ]);

                // Generate random creature type for placeholder (lowercase)
                const commonCreatures = ['cat', 'rabbit'];
                const randomCreature = commonCreatures[tokenId % commonCreatures.length];

                return {
                    id: tokenId,
                    owner,
                    level: Number(version),
                    // Default display data (will be updated from metadata)
                    name: `EvoNFT #${tokenId}`,
                    description: 'An evolving NFT',
                    rarity: 'common',
                    creatureType: randomCreature, // lowercase for SVG
                    xp: 0,
                    uri: '',
                    nextEvolveTime: 0,
                    canEvolve: false,
                    attributes: []
                };

            } catch (error) {
                console.warn(`   ⚠️ Skip NFT #${tokenId}`);
                return null;
            }
        }

        loadAllNFTs();
    }, [contract]);

    return { nfts, loading, totalMinted };
}

// Clear cache function (export for manual cache clearing)
export function clearNFTCache() {
    nftCache.clear();
    console.log('🗑️ NFT cache cleared');
}
