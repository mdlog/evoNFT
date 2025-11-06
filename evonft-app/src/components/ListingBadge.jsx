import { useListing } from '../hooks/useMarketplace';

export default function ListingBadge({ tokenId, variant = 'default' }) {
    const { listing, loading } = useListing(tokenId);

    if (loading || !listing) return null;

    if (variant === 'compact') {
        return (
            <div className="absolute top-2 right-2 px-3 py-1 bg-primary-500 rounded-lg text-sm font-semibold shadow-lg">
                💰 {listing.price} Ⓜ
            </div>
        );
    }

    if (variant === 'card') {
        return (
            <div className="mt-3 p-3 bg-primary-500/20 border border-primary-500/50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Listed for:</span>
                    <span className="text-lg font-bold text-primary-400">{listing.price} MATIC</span>
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 border border-primary-500/50 rounded-lg">
            <span className="text-sm font-semibold text-primary-400">
                💰 {listing.price} MATIC
            </span>
        </div>
    );
}
