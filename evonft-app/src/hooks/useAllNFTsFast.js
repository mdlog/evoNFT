import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';

// Add Transfer event to ABI
const EXTENDED_ABI = [
    ...CONTRACT_ABI,
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
];

// Fallback RPC provider - use reliable public RPC
const FALLBACK_RPC = 'https://rpc-amoy.polygon.technology';
const fallbackProvider = new ethers.JsonRpcProvider(FALLBACK_RPC);

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
        async function loadAllNFTs() {
            try {
                console.log('⚡ Loading NFTs (ultra-fast mode)...');
                console.log('📍 Contract:', CONTRACT_ADDRESS);

                const startTime = Date.now();
                setLoading(true);

                // Disable cache temporarily to debug
                // const cacheKey = `nfts_${CONTRACT_ADDRESS}`;
                // const cached = nftCache.get(cacheKey);
                // if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                //     console.log('✅ Loaded from cache');
                //     setNfts(cached.data);
                //     setTotalMinted(cached.data.length);
                //     setLoading(false);
                //     return;
                // }

                // Use fallback provider for reliability
                const fastContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    EXTENDED_ABI,
                    fallbackProvider
                );

                // Get total minted
                const total = await fastContract.totalMinted();
                const totalNum = Number(total);
                setTotalMinted(totalNum);

                console.log(`   Total minted: ${totalNum}`);

                if (totalNum === 0) {
                    console.log('   No NFTs minted yet');
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                // Load NFTs one by one (no batch to avoid RPC limits)
                console.log('   Loading tokens 0 to', totalNum - 1, '...');
                const validNFTs = [];
                
                for (let i = 0; i < totalNum; i++) {
                    try {
                        const owner = await fastContract.ownerOf(i);
                        const version = await fastContract.version(i);
                        
                        const commonCreatures = ['cat', 'rabbit'];
                        const randomCreature = commonCreatures[i % commonCreatures.length];
                        
                        validNFTs.push({
                            id: i,
                            owner,
                            level: Number(version),
                            name: `EvoNFT #${i}`,
                            description: 'An evolving NFT',
                            rarity: 'common',
                            creatureType: randomCreature,
                            xp: 0,
                            uri: '',
                            nextEvolveTime: 0,
                            canEvolve: false,
                            attributes: []
                        });
                        
                        console.log('   ✅ Loaded NFT #' + i);
                        
                        // Small delay to avoid rate limits
                        if (i < totalNum - 1) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    } catch (error) {
                        console.warn(`   ⚠️ Skip NFT #${i}:`, error.message);
                        // Still add to array with default data to prevent disappearing
                        validNFTs.push({
                            id: i,
                            owner: '0x0000000000000000000000000000000000000000',
                            level: 1,
                            name: `EvoNFT #${i}`,
                            description: 'An evolving NFT',
                            rarity: 'common',
                            creatureType: 'cat',
                            xp: 0,
                            uri: '',
                            nextEvolveTime: 0,
                            canEvolve: false,
                            attributes: []
                        });
                    }
                }

                const loadTime = Date.now() - startTime;
                console.log(`   ✅ Loaded ${validNFTs.length} NFTs in ${loadTime}ms`);

                // Disable cache temporarily
                // nftCache.set(cacheKey, {
                //     data: validNFTs,
                //     timestamp: Date.now()
                // });

                setNfts(validNFTs);
                setLoading(false);

            } catch (error) {
                console.error('❌ Error loading NFTs:', error);
                setLoading(false);
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
