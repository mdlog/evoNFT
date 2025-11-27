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
 * Strategy: Query all minted NFTs from NFT contract, then check marketplace status
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
                console.log('   Marketplace Contract:', contract.target || contract.address);

                const activeListings = [];

                // Get NFT contract address from marketplace
                const nftContractAddress = await contract.nftContract();
                console.log('   NFT Contract:', nftContractAddress);

                // Create NFT contract instance
                const nftContract = new ethers.Contract(
                    nftContractAddress,
                    [
                        'function totalSupply() view returns (uint256)',
                        'function tokenByIndex(uint256 index) view returns (uint256)',
                        'function ownerOf(uint256 tokenId) view returns (address)'
                    ],
                    contract.runner
                );

                // Get total supply of NFTs
                const totalSupply = await nftContract.totalSupply();
                const totalNFTs = Number(totalSupply);
                console.log(`   Total NFTs minted: ${totalNFTs}`);

                if (totalNFTs === 0) {
                    console.log('   ℹ️ No NFTs minted yet');
                    setListings([]);
                    setLoading(false);
                    return;
                }

                // Check each NFT if it's listed
                console.log(`   Checking ${totalNFTs} NFTs for listings...`);

                for (let i = 0; i < totalNFTs; i++) {
                    try {
                        // Get token ID at index
                        const tokenId = await nftContract.tokenByIndex(i);
                        const tokenIdNum = Number(tokenId);

                        // Check if listed in marketplace
                        const isListed = await contract.isListed(tokenIdNum);

                        if (isListed) {
                            // Get listing details
                            const listingData = await contract.getListing(tokenIdNum);
                            const listing = {
                                tokenId: tokenIdNum,
                                seller: listingData[0],
                                price: ethers.formatEther(listingData[1]),
                                priceWei: listingData[1],
                                listedAt: Number(listingData[2]),
                                active: listingData[3]
                            };

                            // Only add if still active
                            if (listing.active) {
                                activeListings.push(listing);
                                console.log(`   ✅ NFT #${tokenIdNum} listed for ${listing.price} MATIC`);
                            }
                        }
                    } catch (err) {
                        console.warn(`   ⚠️ Error checking NFT at index ${i}:`, err.message);
                    }
                }

                console.log(`   ✅ Found ${activeListings.length} active listings`);
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
