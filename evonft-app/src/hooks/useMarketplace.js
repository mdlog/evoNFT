import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/RainbowWeb3Context';
import { MARKETPLACE_CONTRACT, MARKETPLACE_ABI } from '../config/contractsExtended';

/**
 * Hook for Marketplace Contract
 */
export function useMarketplace() {
    const { provider, signer } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!MARKETPLACE_CONTRACT) {
            console.warn('⚠️ MARKETPLACE_CONTRACT not set');
            return;
        }

        console.log('🏪 Initializing Marketplace Contract:', MARKETPLACE_CONTRACT);

        if (provider) {
            const readContract = new ethers.Contract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI, provider);
            setContract(readContract);
            console.log('✅ Marketplace read contract initialized');
        }

        if (signer) {
            const writeContract = new ethers.Contract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI, signer);
            setContractWithSigner(writeContract);
            console.log('✅ Marketplace write contract initialized');
        }
    }, [provider, signer]);

    // Load marketplace stats
    useEffect(() => {
        if (!contract) return;

        async function loadStats() {
            try {
                const statsData = await contract.getMarketplaceStats();
                setStats({
                    totalListings: Number(statsData[0]),
                    totalSales: Number(statsData[1]),
                    totalVolume: ethers.formatEther(statsData[2]),
                    marketplaceFee: Number(statsData[3]) / 100 // Convert basis points to percentage
                });
                setLoading(false);
            } catch (error) {
                console.error('Error loading marketplace stats:', error);
                setLoading(false);
            }
        }

        loadStats();
    }, [contract]);

    return { contract, contractWithSigner, stats, loading };
}

/**
 * Hook for NFT Listing Info
 */
export function useListing(tokenId) {
    const { contract } = useMarketplace();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract || tokenId === undefined) return;

        async function loadListing() {
            try {
                const isListed = await contract.isListed(tokenId);

                if (isListed) {
                    const listingData = await contract.getListing(tokenId);
                    setListing({
                        seller: listingData[0],
                        price: ethers.formatEther(listingData[1]),
                        priceWei: listingData[1],
                        listedAt: Number(listingData[2]),
                        active: listingData[3]
                    });
                } else {
                    setListing(null);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading listing:', error);
                setListing(null);
                setLoading(false);
            }
        }

        loadListing();
    }, [contract, tokenId]);

    return { listing, loading };
}

/**
 * Hook for All Active Listings
 */
export function useListings() {
    const { contract } = useMarketplace();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract) return;

        async function loadListings() {
            try {
                console.log('📋 Loading all listings...');
                console.log('   Contract address:', contract.target || contract.address);

                // Strategy: Get all active listings by checking contract state
                // This is more reliable than relying on events
                const activeListings = [];

                // Query events and check each one
                console.log('   Using event-based approach to find listings...');

                // Get current block
                const currentBlock = await contract.runner.provider.getBlockNumber();
                console.log('   Current block:', currentBlock);

                // Try to query from deployment block or last 50000 blocks
                const fromBlock = Math.max(0, currentBlock - 50000);
                console.log('   Querying from block:', fromBlock, 'to', currentBlock);

                // Get Listed events
                const filter = contract.filters.Listed();
                const events = await contract.queryFilter(filter, fromBlock, currentBlock);
                console.log(`   ✅ Found ${events.length} listing events`);

                // Get unique token IDs from events
                const tokenIds = [...new Set(events.map(e => Number(e.args.tokenId)))];
                console.log(`   Checking ${tokenIds.length} unique tokens...`);

                // Check which listings are still active
                for (const tokenId of tokenIds) {
                    try {
                        const isListed = await contract.isListed(tokenId);

                        if (isListed) {
                            const listingData = await contract.getListing(tokenId);
                            const listing = {
                                tokenId,
                                seller: listingData[0],
                                price: ethers.formatEther(listingData[1]),
                                priceWei: listingData[1],
                                listedAt: Number(listingData[2]),
                                active: listingData[3]
                            };
                            activeListings.push(listing);
                            console.log(`   ✅ Token ${tokenId} is listed:`, listing.price, 'MATIC');
                        }
                    } catch (err) {
                        console.warn(`   ⚠️ Error checking token ${tokenId}:`, err.message);
                    }
                }

                console.log(`   ✅ Total active listings: ${activeListings.length}`);
                setListings(activeListings);
                setLoading(false);

            } catch (error) {
                console.error('❌ Error loading listings:', error);
                console.error('   Error details:', {
                    message: error.message,
                    code: error.code,
                    data: error.data
                });
                setListings([]);
                setLoading(false);
            }
        }

        loadListings();

        // Refresh listings every 30 seconds
        const interval = setInterval(loadListings, 30000);
        return () => clearInterval(interval);
    }, [contract]);

    return { listings, loading };
}
