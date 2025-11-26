# Marketplace Trading - Status & Roadmap

## Current Status: ❌ NOT IMPLEMENTED

### What Exists Now:

✅ **Explore Page** (`/explore`)
- View all minted NFTs
- Search and filter NFTs
- See NFT details (XP, level, stats)
- **BUT: No buying/selling functionality**

### What's Missing:

❌ **Smart Contract Functions:**
- `listForSale(tokenId, price)` - List NFT for sale
- `buyNFT(tokenId)` - Buy listed NFT
- `cancelListing(tokenId)` - Cancel sale listing
- `updatePrice(tokenId, newPrice)` - Update listing price

❌ **Frontend Features:**
- List NFT button
- Buy NFT button
- Price input
- Listing management
- Sales history
- Offer system

❌ **Backend/Events:**
- Listed event
- Sold event
- Cancelled event
- Price updated event

## Current Features

### What Users CAN Do:
1. ✅ Mint NFTs
2. ✅ Feed NFTs (gain XP)
3. ✅ Train NFTs (increase stats)
4. ✅ Stake NFTs (earn rewards)
5. ✅ Breed NFTs (create offspring)
6. ✅ View all NFTs (explore page)
7. ✅ View own NFTs (my collection)

### What Users CANNOT Do:
1. ❌ List NFT for sale
2. ❌ Buy NFT from others
3. ❌ Set price for NFT
4. ❌ Make offers
5. ❌ Trade NFTs
6. ❌ Transfer NFTs (except through breeding/staking)

## Why "Marketplace" Page Exists?

The page is named "Marketplace" but it's actually just an **Explore/Gallery** page:
- Shows all minted NFTs
- Allows searching and filtering
- Links to NFT detail pages
- **No trading functionality**

It's a placeholder for future marketplace features.

## Roadmap: Adding Marketplace Trading

### Phase 1: Smart Contract (Marketplace.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    IERC721 public nftContract;
    mapping(uint256 => Listing) public listings;
    uint256 public marketplaceFee = 250; // 2.5%
    
    event Listed(uint256 indexed tokenId, address seller, uint256 price);
    event Sold(uint256 indexed tokenId, address buyer, address seller, uint256 price);
    event Cancelled(uint256 indexed tokenId);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    
    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
    }
    
    function listForSale(uint256 tokenId, uint256 price) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        require(nftContract.getApproved(tokenId) == address(this), "Not approved");
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });
        
        emit Listed(tokenId, msg.sender, price);
    }
    
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer NFT
        nftContract.transferFrom(listing.seller, msg.sender, tokenId);
        
        // Transfer payment
        payable(listing.seller).transfer(sellerAmount);
        
        // Mark as sold
        listings[tokenId].active = false;
        
        emit Sold(tokenId, msg.sender, listing.seller, listing.price);
        
        // Refund excess
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }
    
    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].active, "Not active");
        
        listings[tokenId].active = false;
        emit Cancelled(tokenId);
    }
    
    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].active, "Not active");
        require(newPrice > 0, "Price must be > 0");
        
        listings[tokenId].price = newPrice;
        emit PriceUpdated(tokenId, newPrice);
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

### Phase 2: Frontend Integration

#### 1. Hook: `useMarketplace.js`
```javascript
export function useMarketplace() {
    // Get marketplace contract
    // Fetch listings
    // Handle buy/sell/cancel
}

export function useListings() {
    // Fetch all active listings
    // Filter and sort
}

export function useListing(tokenId) {
    // Get specific listing
    // Check if for sale
    // Get price
}
```

#### 2. Components

**ListForSaleModal.jsx**
```javascript
// Modal to list NFT for sale
// Input: price
// Button: List for Sale
```

**BuyNFTModal.jsx**
```javascript
// Modal to buy NFT
// Show: price, seller, NFT details
// Button: Buy Now
```

**ListingCard.jsx**
```javascript
// Display listing info
// Price, seller, time listed
// Buy button
```

#### 3. Update Pages

**Marketplace.jsx**
- Show only listed NFTs
- Display prices
- Add "Buy Now" buttons
- Filter by price range

**NFTDetail.jsx**
- Add "List for Sale" button (if owner)
- Add "Buy Now" button (if listed)
- Show listing info
- Show sales history

**MyCollection.jsx**
- Add "List for Sale" button on each NFT
- Show which NFTs are listed
- Quick cancel listing

### Phase 3: Features

#### Basic Features:
- ✅ List NFT for sale
- ✅ Buy NFT
- ✅ Cancel listing
- ✅ Update price
- ✅ Marketplace fee (2.5%)

#### Advanced Features:
- 🔄 Offers system
- 🔄 Auction system
- 🔄 Bundle sales
- 🔄 Royalties for original minter
- 🔄 Price history
- 🔄 Sales analytics

### Phase 4: Deployment

```bash
# 1. Deploy Marketplace contract
cd evonft-contracts
npx hardhat run scripts/deploy-marketplace.js --network amoy

# 2. Update frontend config
# Add MARKETPLACE_CONTRACT address to .env

# 3. Test
# - List NFT
# - Buy NFT
# - Cancel listing
# - Update price

# 4. Verify contract
npx hardhat verify --network amoy <ADDRESS> <NFT_CONTRACT>
```

## Estimated Development Time

| Phase | Time | Complexity |
|-------|------|------------|
| Smart Contract | 2-3 days | Medium |
| Frontend Hooks | 1-2 days | Medium |
| UI Components | 2-3 days | Medium |
| Integration | 1-2 days | Medium |
| Testing | 2-3 days | High |
| **Total** | **8-13 days** | **Medium-High** |

## Considerations

### Security:
- ✅ ReentrancyGuard for buy function
- ✅ Approval check before listing
- ✅ Owner verification
- ✅ Price validation

### UX:
- Clear listing process
- Easy buying flow
- Transaction confirmations
- Error handling

### Fees:
- Marketplace fee: 2.5%
- Gas fees: User pays
- Royalties: Optional (5-10% to original minter)

### Legal:
- Terms of service
- Trading policies
- Dispute resolution
- KYC/AML (if required)

## Alternative: Use Existing Marketplace

Instead of building custom marketplace, could integrate with:

### OpenSea
- Pros: Established, trusted, large user base
- Cons: Less control, fees, external dependency

### Rarible
- Pros: Multi-chain, good API
- Cons: Fees, less customization

### Custom Solution
- Pros: Full control, custom features, no external fees
- Cons: Development time, security responsibility, need to build user base

## Current Workaround

For now, users can trade NFTs through:
1. **Direct Transfer** - Transfer NFT to buyer, buyer sends MATIC separately
2. **External Marketplaces** - List on OpenSea/Rarible (if supported)
3. **P2P** - Arrange trades off-platform

## Recommendation

### For MVP (Current):
✅ **Keep as Explore page only**
- Focus on core features (feed, train, stake, breed)
- No trading needed for initial launch
- Simpler to maintain

### For Future:
🔄 **Add Marketplace Trading**
- After core features are stable
- When user base grows
- When trading demand exists

## Summary

| Feature | Status | Priority |
|---------|--------|----------|
| **Explore NFTs** | ✅ Implemented | High |
| **View Details** | ✅ Implemented | High |
| **Search/Filter** | ✅ Implemented | Medium |
| **List for Sale** | ❌ Not implemented | Low |
| **Buy NFT** | ❌ Not implemented | Low |
| **Trading** | ❌ Not implemented | Low |

---

**Current Status:** Marketplace page is **Explore/Gallery only**, no trading functionality.

**To Add Trading:** Need to implement smart contract + frontend integration (8-13 days development).

**Recommendation:** Focus on core features first, add trading later when needed.
