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

                // Get current block
                const currentBlock = await contract.runner.provider.getBlockNumber();
                console.log('   Current block:', currentBlock);

                // Query last 10000 blocks (about 1 week on Polygon)
                // This prevents timeout on large block ranges
                const fromBlock = Math.max(0, currentBlock - 10000);
                console.log('   Querying from block:', fromBlock, 'to', currentBlock);

                // Get Listed events with limited block range
                const filter = contract.filters.Listed();
                const events = await contract.queryFilter(filter, fromBlock, currentBlock);
                console.log(`   ✅ Found ${events.length} listing events`);

                if (events.length === 0) {
                    console.warn('   ⚠️ No listing events found in recent blocks.');
                    console.warn('   💡 Tip: If NFT was listed long ago, increase block range.');
                    setListings([]);
                    setLoading(false);
                    return;
                }

                // Check which listings are still active
                const activeListings = [];

                for (const event of events) {
                    const tokenId = Number(event.args.tokenId);
                    console.log(`   Checking tokenId ${tokenId}...`);

                    const isListed = await contract.isListed(tokenId);
                    console.log(`   - isListed: ${isListed}`);

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
                        console.log(`   - Listing data:`, listing);
                        activeListings.push(listing);
                    }
                }

                console.log(`   ✅ Found ${activeListings.length} active listings:`, activeListings);
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
    }, [contract]);

    return { listings, loading };
}
