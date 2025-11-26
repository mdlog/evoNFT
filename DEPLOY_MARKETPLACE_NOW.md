# Deploy Marketplace - Quick Start 🚀

## ✅ What's Ready

1. ✅ **Smart Contract** - `NFTMarketplace.sol` created
2. ✅ **Deployment Script** - `deploy-marketplace.js` ready
3. ✅ **Documentation** - Implementation guide complete

## 🚀 Deploy NOW (5 Minutes)

### Step 1: Deploy Contract

```bash
cd evonft-contracts

# Deploy to Amoy testnet
npx hardhat run scripts/deploy-marketplace.js --network amoy
```

**You'll see:**
```
🏪 Deploying NFT Marketplace...
✅ NFTMarketplace deployed to: 0x...
```

**Copy the address!**

### Step 2: Update .env

```bash
cd ../evonft-app

# Add to .env file
echo "VITE_MARKETPLACE_CONTRACT=0x..." >> .env
```

Replace `0x...` with your deployed address.

### Step 3: Verify Contract (Optional)

```bash
cd ../evonft-contracts

npx hardhat verify --network amoy <MARKETPLACE_ADDRESS> 0xe31d18Fb9925f677451845997f64806a88264b3D
```

## 📋 What You Get

### Smart Contract Features:
- ✅ List NFT for sale
- ✅ Buy NFT
- ✅ Cancel listing
- ✅ Update price
- ✅ 2.5% marketplace fee
- ✅ Stats tracking
- ✅ Security features

### Contract Functions:
```solidity
listForSale(tokenId, price)     // List NFT
buyNFT(tokenId)                 // Buy NFT
cancelListing(tokenId)          // Cancel
updatePrice(tokenId, newPrice)  // Update price
getListing(tokenId)             // Get info
isListed(tokenId)               // Check status
getMarketplaceStats()           // Get stats
```

## 🎯 Next Steps (Frontend)

After deployment, you need to create frontend integration:

### 1. Add Config (5 min)
Update `evonft-app/src/config/contractsExtended.js`:
- Add MARKETPLACE_CONTRACT
- Add MARKETPLACE_ABI

### 2. Create Hooks (30 min)
- `useMarketplace.js` - Main marketplace hook
- `useListings.js` - Fetch listings

### 3. Create Components (1 hour)
- `ListForSaleModal.jsx` - List NFT
- `BuyNFTModal.jsx` - Buy NFT
- `ListingBadge.jsx` - Show price

### 4. Update Pages (1 hour)
- `Marketplace.jsx` - Show listings
- `NFTDetail.jsx` - Buy/list buttons
- `MyCollection.jsx` - Manage listings

**Total Time:** ~3 hours for full frontend

## 💰 Fee Structure

- **Marketplace Fee:** 2.5%
- **Example:** 
  - Sale: 10 MATIC
  - Fee: 0.25 MATIC
  - Seller gets: 9.75 MATIC

## 🧪 Test After Deploy

### Test Listing:
```bash
# In Hardhat console
const marketplace = await ethers.getContractAt("NFTMarketplace", "0x...");
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D");

// Approve marketplace
await nft.approve(marketplace.address, 0);

// List NFT #0 for 1 MATIC
await marketplace.listForSale(0, ethers.parseEther("1"));

// Check listing
await marketplace.getListing(0);
```

### Test Buying:
```bash
# Buy NFT #0
await marketplace.buyNFT(0, { value: ethers.parseEther("1") });
```

## 📊 Monitor

### Check Stats:
```bash
const stats = await marketplace.getMarketplaceStats();
console.log("Total Listings:", stats[0].toString());
console.log("Total Sales:", stats[1].toString());
console.log("Total Volume:", ethers.formatEther(stats[2]), "MATIC");
```

### Check Fees:
```bash
const balance = await ethers.provider.getBalance(marketplace.address);
console.log("Accumulated Fees:", ethers.formatEther(balance), "MATIC");
```

## 🔧 Admin Functions

### Withdraw Fees:
```bash
await marketplace.withdrawFees();
```

### Update Fee:
```bash
// Set to 5% (500 basis points)
await marketplace.setMarketplaceFee(500);
```

## 📝 Deployment Checklist

- [ ] Deploy marketplace contract
- [ ] Copy contract address
- [ ] Update .env file
- [ ] Verify contract (optional)
- [ ] Test listing
- [ ] Test buying
- [ ] Test canceling
- [ ] Check stats
- [ ] Create frontend integration

## 🎉 Benefits

### For Users:
- ✅ Buy and sell NFTs
- ✅ Set own prices
- ✅ Secure transactions
- ✅ Low fees (2.5%)

### For Project:
- ✅ More engaging
- ✅ NFT utility
- ✅ Revenue from fees
- ✅ Active marketplace

### For Ecosystem:
- ✅ Price discovery
- ✅ Liquidity
- ✅ Community trading
- ✅ Value creation

## 🚨 Important Notes

1. **Approval Required** - Users must approve marketplace before listing
2. **Gas Costs** - Users pay gas for all transactions
3. **Fees** - 2.5% fee on each sale
4. **Security** - Contract uses ReentrancyGuard
5. **Ownership** - Only owner can list their NFTs

## 📞 Support

If you encounter issues:
1. Check console logs
2. Verify contract address
3. Check network (must be Amoy)
4. Ensure sufficient MATIC for gas
5. Check NFT approval status

---

**Ready to deploy?** Run the command above! 🚀

**Questions?** Check `MARKETPLACE_IMPLEMENTATION_GUIDE.md` for details.
