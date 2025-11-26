# Deploy Marketplace - Manual Steps 🚀

## ✅ Prerequisites Done

- ✅ Smart contract created
- ✅ Deployment script ready
- ✅ .env updated with NFT_CONTRACT

## 🚀 Deploy Command

```bash
cd evonft-contracts
npx hardhat run scripts/deploy-marketplace.js --network amoy
```

## 📋 Expected Output

```
🏪 Deploying NFT Marketplace...

👤 Deploying with account: 0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4
💰 Account balance: 0.127213917935437307 MATIC

📍 NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D

🚀 Deploying NFTMarketplace...
✅ NFTMarketplace deployed to: 0x... [COPY THIS ADDRESS]

📊 Initial Configuration:
   Marketplace Fee: 2.5 %
   NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D

💾 Saving deployment info...

📝 Next Steps:
1. Update .env file:
   VITE_MARKETPLACE_CONTRACT=0x...

2. Verify contract:
   npx hardhat verify --network amoy 0x... 0xe31d18Fb9925f677451845997f64806a88264b3D

3. Test marketplace:
   - List an NFT for sale
   - Buy an NFT
   - Cancel a listing

✅ Deployment complete!
```

## 📝 After Deployment

### Step 1: Copy Marketplace Address

From the output above, copy the address after:
```
✅ NFTMarketplace deployed to: 0x...
```

### Step 2: Update Frontend .env

```bash
cd ../evonft-app

# Add to .env file
echo "VITE_MARKETPLACE_CONTRACT=0x..." >> .env
```

Replace `0x...` with your actual marketplace address.

### Step 3: Verify Contract (Optional but Recommended)

```bash
cd ../evonft-contracts

npx hardhat verify --network amoy <MARKETPLACE_ADDRESS> 0xe31d18Fb9925f677451845997f64806a88264b3D
```

Replace `<MARKETPLACE_ADDRESS>` with your deployed address.

## 🧪 Test Deployment

### Quick Test in Hardhat Console

```bash
npx hardhat console --network amoy
```

Then run:

```javascript
// Load contracts
const marketplace = await ethers.getContractAt(
    "NFTMarketplace", 
    "YOUR_MARKETPLACE_ADDRESS"
);

const nft = await ethers.getContractAt(
    "EvolvableNFTExtended",
    "0xe31d18Fb9925f677451845997f64806a88264b3D"
);

// Check marketplace info
const stats = await marketplace.getMarketplaceStats();
console.log("Total Listings:", stats[0].toString());
console.log("Total Sales:", stats[1].toString());
console.log("Marketplace Fee:", stats[3].toString(), "basis points");

// Check NFT contract
const nftAddress = await marketplace.nftContract();
console.log("NFT Contract:", nftAddress);

// Test listing (if you own NFT #0)
// First approve
await nft.approve(marketplace.target, 0);

// Then list for 1 MATIC
await marketplace.listForSale(0, ethers.parseEther("1"));

// Check listing
const listing = await marketplace.getListing(0);
console.log("Seller:", listing[0]);
console.log("Price:", ethers.formatEther(listing[1]), "MATIC");
console.log("Active:", listing[3]);
```

## 📊 Deployment Info

The script saves deployment info to:
```
evonft-contracts/deployments/marketplace-amoy.json
```

This file contains:
- Marketplace address
- NFT contract address
- Deployer address
- Timestamp
- Network info

## 🔍 Verify on Explorer

After deployment, check your contract on Polygonscan:

```
https://amoy.polygonscan.com/address/YOUR_MARKETPLACE_ADDRESS
```

You should see:
- Contract creation transaction
- Contract code (after verification)
- Read/Write functions

## ⚠️ Troubleshooting

### Error: "NFT_CONTRACT not set"
**Solution:** .env file already updated, try running deploy again

### Error: "Insufficient funds"
**Solution:** Get more MATIC from faucet:
- https://faucet.polygon.technology

### Error: "Nonce too high"
**Solution:** Reset MetaMask account or wait a few minutes

### Error: "Contract already deployed"
**Solution:** This is fine! Use the existing address

## 📋 Deployment Checklist

- [x] Smart contract created
- [x] Deployment script ready
- [x] .env updated with NFT_CONTRACT
- [ ] Run deployment command
- [ ] Copy marketplace address
- [ ] Update frontend .env
- [ ] Verify contract
- [ ] Test listing
- [ ] Test buying

## 🎯 What's Next

After successful deployment:

1. **Update Frontend Config** (5 min)
   - Add marketplace ABI to `contractsExtended.js`
   - Add marketplace address to config

2. **Create Hooks** (30 min)
   - `useMarketplace.js` - Main hook
   - `useListings.js` - Fetch listings

3. **Create Components** (1 hour)
   - `ListForSaleModal.jsx`
   - `BuyNFTModal.jsx`
   - `ListingBadge.jsx`

4. **Update Pages** (1 hour)
   - `Marketplace.jsx` - Show listings
   - `NFTDetail.jsx` - Buy/list buttons
   - `MyCollection.jsx` - Manage listings

**Total:** ~3 hours for complete frontend integration

## 💡 Tips

- Keep the marketplace address safe
- Test on testnet first
- Monitor gas costs
- Check contract on explorer
- Verify contract for transparency

## 📞 Support

If deployment fails:
1. Check console output for errors
2. Verify .env file has NFT_CONTRACT
3. Ensure sufficient MATIC for gas
4. Check network connection
5. Try again after a few minutes

---

**Ready?** Run the deployment command above! 🚀

**Success?** Continue with frontend integration!
