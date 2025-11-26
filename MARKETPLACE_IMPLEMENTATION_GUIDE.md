# Marketplace Trading - Implementation Guide 🏪

## ✅ What's Been Created

### 1. Smart Contract
**File:** `evonft-contracts/contracts/NFTMarketplace.sol`

**Features:**
- ✅ List NFT for sale
- ✅ Buy NFT
- ✅ Cancel listing
- ✅ Update price
- ✅ Marketplace fee (2.5%)
- ✅ Stats tracking (total sales, volume)
- ✅ Security (ReentrancyGuard, ownership checks)

### 2. Deployment Script
**File:** `evonft-contracts/scripts/deploy-marketplace.js`

**Usage:**
```bash
cd evonft-contracts
npx hardhat run scripts/deploy-marketplace.js --network amoy
```

## 🚀 Deployment Steps

### Step 1: Deploy Contract

```bash
cd evonft-contracts

# Make sure .env has NFT_CONTRACT address
cat .env | grep VITE_NFT_CONTRACT

# Deploy marketplace
npx hardhat run scripts/deploy-marketplace.js --network amoy
```

**Expected Output:**
```
🏪 Deploying NFT Marketplace...
👤 Deploying with account: 0x...
💰 Account balance: X MATIC

📍 NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D
🚀 Deploying NFTMarketplace...
✅ NFTMarketplace deployed to: 0x...

📊 Initial Configuration:
   Marketplace Fee: 2.5 %
   NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D

✅ Deployment complete!
```

### Step 2: Update .env

Add marketplace address to `evonft-app/.env`:
```bash
VITE_MARKETPLACE_CONTRACT=0x... # Address from deployment
```

### Step 3: Verify Contract

```bash
npx hardhat verify --network amoy <MARKETPLACE_ADDRESS> <NFT_CONTRACT>
```

### Step 4: Create Frontend Integration

I'll create the necessary files in the next steps:

1. **Config** - Add marketplace ABI and address
2. **Hooks** - Create useMarketplace hooks
3. **Components** - Create UI components
4. **Pages** - Update Marketplace page

## 📋 Frontend Files to Create

### 1. Config Update
**File:** `evonft-app/src/config/contractsExtended.js`

Add:
```javascript
export const MARKETPLACE_CONTRACT = import.meta.env.VITE_MARKETPLACE_CONTRACT || '';

export const MARKETPLACE_ABI = [
    "function listForSale(uint256 tokenId, uint256 price) external",
    "function buyNFT(uint256 tokenId) external payable",
    "function cancelListing(uint256 tokenId) external",
    "function updatePrice(uint256 tokenId, uint256 newPrice) external",
    "function getListing(uint256 tokenId) view returns (address, uint256, uint256, bool)",
    "function isListed(uint256 tokenId) view returns (bool)",
    "function getMarketplaceStats() view returns (uint256, uint256, uint256, uint256)",
    "event Listed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 timestamp)",
    "event Sold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price, uint256 timestamp)",
    "event Cancelled(uint256 indexed tokenId, address indexed seller, uint256 timestamp)"
];
```

### 2. Marketplace Hook
**File:** `evonft-app/src/hooks/useMarketplace.js`

Features:
- Connect to marketplace contract
- List NFT for sale
- Buy NFT
- Cancel listing
- Update price
- Get listing info
- Get marketplace stats

### 3. Listings Hook
**File:** `evonft-app/src/hooks/useListings.js`

Features:
- Fetch all active listings
- Filter listings
- Sort by price/date
- Search listings

### 4. Components

**ListForSaleModal.jsx**
- Input: price
- Approve marketplace
- List NFT
- Success feedback

**BuyNFTModal.jsx**
- Show NFT details
- Show price
- Confirm purchase
- Handle transaction

**ListingBadge.jsx**
- Show "For Sale" badge
- Display price
- Quick actions

### 5. Update Pages

**Marketplace.jsx**
- Filter: Show only listed NFTs
- Display prices
- Add "Buy Now" buttons
- Show marketplace stats

**NFTDetail.jsx**
- Add "List for Sale" button (if owner)
- Add "Buy Now" button (if listed)
- Show listing info
- Cancel listing option

**MyCollection.jsx**
- Show which NFTs are listed
- Quick list/cancel buttons
- Listing management

## 🎯 User Flow

### Selling Flow:
```
1. User owns NFT
   ↓
2. Click "List for Sale"
   ↓
3. Enter price
   ↓
4. Approve marketplace (one-time)
   ↓
5. Confirm listing
   ↓
6. NFT appears in marketplace
```

### Buying Flow:
```
1. Browse marketplace
   ↓
2. Find NFT to buy
   ↓
3. Click "Buy Now"
   ↓
4. Review details
   ↓
5. Confirm purchase
   ↓
6. NFT transferred to buyer
   ↓
7. Payment sent to seller
```

### Cancel Flow:
```
1. Go to My Collection
   ↓
2. Find listed NFT
   ↓
3. Click "Cancel Listing"
   ↓
4. Confirm cancellation
   ↓
5. NFT removed from marketplace
```

## 💰 Fee Structure

### Marketplace Fee: 2.5%
- Charged on each sale
- Deducted from seller's payment
- Goes to marketplace owner

### Example:
```
Sale Price: 10 MATIC
Marketplace Fee: 0.25 MATIC (2.5%)
Seller Receives: 9.75 MATIC
Buyer Pays: 10 MATIC + gas
```

### Gas Fees:
- List: ~50,000 gas
- Buy: ~100,000 gas
- Cancel: ~30,000 gas
- Update Price: ~30,000 gas

## 🔒 Security Features

### Smart Contract:
- ✅ ReentrancyGuard on buy function
- ✅ Ownership verification
- ✅ Approval checks
- ✅ Price validation
- ✅ Active listing checks

### Frontend:
- ✅ Transaction confirmations
- ✅ Error handling
- ✅ Loading states
- ✅ Input validation

## 📊 Marketplace Stats

Track:
- Total listings
- Total sales
- Total volume (MATIC)
- Average price
- Floor price
- Highest sale

Display on marketplace page.

## 🧪 Testing Checklist

### Smart Contract:
- [ ] Deploy successfully
- [ ] List NFT
- [ ] Buy NFT
- [ ] Cancel listing
- [ ] Update price
- [ ] Fee calculation correct
- [ ] Refund excess payment
- [ ] Events emitted correctly

### Frontend:
- [ ] Connect to contract
- [ ] List modal works
- [ ] Buy modal works
- [ ] Cancel works
- [ ] Price update works
- [ ] Listings display correctly
- [ ] Stats display correctly
- [ ] Error handling works

### Integration:
- [ ] Approve marketplace
- [ ] List NFT from My Collection
- [ ] Buy NFT from Marketplace
- [ ] Cancel from My Collection
- [ ] Update price
- [ ] View listing history

## 📝 Next Steps

### Immediate (Required):
1. ✅ Deploy marketplace contract
2. ⏳ Update .env with address
3. ⏳ Add marketplace ABI to config
4. ⏳ Create useMarketplace hook
5. ⏳ Create UI components
6. ⏳ Update pages

### Short-term (Nice to have):
- Sales history
- Price history chart
- Offer system
- Favorites/watchlist
- Email notifications

### Long-term (Advanced):
- Auction system
- Bundle sales
- Royalties
- Analytics dashboard
- Mobile app

## 🎨 UI Mockup

### Marketplace Page:
```
┌─────────────────────────────────────┐
│ 🏪 NFT Marketplace                  │
├─────────────────────────────────────┤
│ Stats: 24 Listed | 156 Sales | ...  │
├─────────────────────────────────────┤
│ [Search] [Filter: Price] [Sort]     │
├─────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │ NFT  │ │ NFT  │ │ NFT  │         │
│ │ #1   │ │ #2   │ │ #3   │         │
│ │ 5 Ⓜ  │ │ 8 Ⓜ  │ │ 12 Ⓜ │         │
│ │[Buy] │ │[Buy] │ │[Buy] │         │
│ └──────┘ └──────┘ └──────┘         │
└─────────────────────────────────────┘
```

### NFT Detail (Listed):
```
┌─────────────────────────────────────┐
│ EvoNFT #1                           │
├─────────────────────────────────────┤
│ [Image]          Price: 5 MATIC     │
│                  Seller: 0x...      │
│                  Listed: 2h ago     │
│                                     │
│                  [Buy Now]          │
│                  [Make Offer]       │
└─────────────────────────────────────┘
```

### My Collection (Owner):
```
┌─────────────────────────────────────┐
│ My NFTs                             │
├─────────────────────────────────────┤
│ ┌──────┐ ┌──────┐                  │
│ │ NFT  │ │ NFT  │                  │
│ │ #1   │ │ #2   │                  │
│ │Listed│ │      │                  │
│ │5 Ⓜ   │ │      │                  │
│ │[Edit]│ │[List]│                  │
│ └──────┘ └──────┘                  │
└─────────────────────────────────────┘
```

## 💡 Tips

### For Sellers:
- Price competitively
- Include good description
- Highlight unique features
- Update price if not selling

### For Buyers:
- Check NFT stats (XP, level)
- Compare prices
- Verify seller reputation
- Act fast on good deals

### For Developers:
- Test thoroughly on testnet
- Handle all error cases
- Provide clear feedback
- Monitor gas costs

## 📚 Resources

- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts
- Ethers.js Docs: https://docs.ethers.org
- Hardhat Docs: https://hardhat.org/docs

---

**Status:** Smart contract ready ✅
**Next:** Deploy and create frontend integration
**Time Estimate:** 2-3 days for full implementation
