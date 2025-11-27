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

        if (provider) {
            const readContract = new ethers.Contract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI, provider);
            setContract(readContract);
        }

        if (signer) {
            const writeContract = new ethers.Contract(MARKETPLACE_CONTRACT, MARKETPLACE_ABI, signer);
            setContractWithSigner(writeContract);
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
 * Strategy: Scan known NFT range and check marketplace status
 */
export function useListings() {
    const { contract } = useMarketplace();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contract) return;

        async function loadListings() {
            try {
                const activeListings = [];
                
                // Use the correct NFT contract address from env
                const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT;
                
                // Create NFT contract instance with correct ABI
                const nftContract = new ethers.Contract(
                    NFT_CONTRACT_ADDRESS,
                    [
                        'function totalMinted() view returns (uint256)',
                        'function ownerOf(uint256 tokenId) view returns (address)'
                    ],
                    contract.runner
                );

                // Get total minted NFTs
                const totalMinted = await nftContract.totalMinted();
                const totalNFTs = Number(totalMinted);

                if (totalNFTs === 0) {
                    setListings([]);
                    setLoading(false);
                    return;
                }

                // Check each NFT ID from 0 to totalMinted-1
                for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
                    try {
                        // Check if this token exists and is listed
                        const isListed = await contract.isListed(tokenId);

                        if (isListed) {
                            // Get listing details
                            const listingData = await contract.getListing(tokenId);
                            const listing = {
                                tokenId: tokenId,
                                seller: listingData[0],
                                price: ethers.formatEther(listingData[1]),
                                priceWei: listingData[1],
                                listedAt: Number(listingData[2]),
                                active: listingData[3]
                            };

                            // Only add if still active
                            if (listing.active) {
                                activeListings.push(listing);
                            }
                        }
                    } catch (err) {
                        // Token might not exist or other error, continue
                        continue;
                    }
                }

                setListings(activeListings);
                setLoading(false);

            } catch (error) {
                console.error('❌ Error loading listings:', error);
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
