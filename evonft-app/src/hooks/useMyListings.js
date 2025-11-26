import { useState, useEffect } from 'react';
import { useMarketplace } from './useMarketplace';

/**
 * Hook to get all listings for user's NFTs
 */
export function useMyListings(nfts) {
    const [listings, setListings] = useState({});
    const [loading, setLoading] = useState(true);
    const { contractWithSigner } = useMarketplace();

    useEffect(() => {
        async function fetchListings() {
            if (!nfts || nfts.length === 0 || !contractWithSigner) {
                setLoading(false);
                return;
            }

            try {
                const listingsMap = {};

                // Fetch listing for each NFT
                for (const nft of nfts) {
                    try {
                        const listing = await contractWithSigner.getListing(nft.id);
                        if (listing && listing.active) {
                            listingsMap[nft.id] = {
                                price: listing.price.toString(),
                                seller: listing.seller,
                                active: listing.active
                            };
                        }
                    } catch (error) {
                        // NFT not listed, skip
                        continue;
                    }
                }

                setListings(listingsMap);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [nfts, contractWithSigner]);

    const listedCount = Object.keys(listings).length;
    const isListed = (tokenId) => !!listings[tokenId];
    const getListingPrice = (tokenId) => listings[tokenId]?.price;

    return {
        listings,
        listedCount,
        isListed,
        getListingPrice,
        loading
    };
}
