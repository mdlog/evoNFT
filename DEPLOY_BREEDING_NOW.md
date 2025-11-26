# 🚀 Deploy Breeding Contract - Step by Step

## Prerequisites

✅ NFT Contract deployed: `0xe31d18Fb9925f677451845997f64806a88264b3D`
✅ Wallet has MATIC for gas
✅ .env file configured

## Step 1: Compile Contract

```bash
cd evonft-contracts
npx hardhat compile
```

**Expected output:**
```
Compiled X Solidity files successfully
```

## Step 2: Deploy Contract

```bash
npx hardhat run scripts/deploy-breeding.js --network amoy
```

**Expected output:**
```
🧬 Deploying NFT Breeding Contract...
👤 Deploying with account: 0x...
💰 Account balance: X MATIC

📍 NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D
🚀 Deploying NFTBreeding...
✅ NFTBreeding deployed to: 0x...

📊 Initial Configuration:
   Breeding Fee: 0.01 MATIC
   Cooldown: 24 hours
   Max Breed Count: 3

💾 Deployment info saved to: breeding-amoy.json

📝 Add this to your .env file:
VITE_BREEDING_CONTRACT=0x...

✅ Deployment complete!
```

**IMPORTANT:** Copy the breeding contract address!

## Step 3: Grant Minter Role

The breeding contract needs permission to mint new NFTs.

```bash
npx hardhat console --network amoy
```

In the console, run:

```javascript
// Get contracts
const nft = await ethers.getContractAt(
    "EvolvableNFTExtended", 
    "0xe31d18Fb9925f677451845997f64806a88264b3D"
)

// Your breeding contract address from Step 2
const breedingAddress = "0xYOUR_BREEDING_ADDRESS_HERE"

// Get minter role
const MINTER_ROLE = await nft.MINTER_ROLE()

// Grant role
const tx = await nft.grantRole(MINTER_ROLE, breedingAddress)
await tx.wait()

console.log("✅ Minter role granted!")

// Verify
const hasRole = await nft.hasRole(MINTER_ROLE, breedingAddress)
console.log("Has minter role:", hasRole) // Should be true

// Exit console
.exit
```

## Step 4: Update Frontend .env

Add breeding contract address to `evonft-app/.env`:

```bash
cd evonft-app
echo "VITE_BREEDING_CONTRACT=0xYOUR_BREEDING_ADDRESS_HERE" >> .env
```

Verify:
```bash
cat .env | grep BREEDING
```

Should show:
```
VITE_BREEDING_CONTRACT=0x...
```

## Step 5: Restart Frontend

```bash
# Clear cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

## Step 6: Test Breeding

1. Open browser: http://localhost:5173/breeding
2. Check browser console (F12):
   ```
   🧬 Initializing Breeding Contract: 0x...
   ✅ Breeding read contract initialized
   ```
3. Select two NFTs
4. View predicted offspring
5. Click "Start Breeding"
6. Confirm transaction (cost: ~0.03 MATIC)
7. Wait for confirmation
8. Success! View offspring

## Verification Checklist

- [ ] Contract compiled successfully
- [ ] Contract deployed to Amoy
- [ ] Breeding address copied
- [ ] Minter role granted (verified with hasRole)
- [ ] .env updated with VITE_BREEDING_CONTRACT
- [ ] Frontend restarted
- [ ] Browser console shows contract initialized
- [ ] Can select NFTs in breeding page
- [ ] Can see predicted stats
- [ ] Breeding button active
- [ ] Transaction successful
- [ ] Offspring minted

## Troubleshooting

### Compilation Error
```bash
# Clean and recompile
npx hardhat clean
npx hardhat compile
```

### Deployment Error: "Insufficient funds"
- Check wallet balance
- Need at least 0.1 MATIC for deployment

### Minter Role Error: "AccessControl: account is missing role"
- Make sure you're using the deployer account
- Verify NFT contract address is correct

### Frontend Not Connecting
```bash
# Check .env
cat evonft-app/.env | grep BREEDING

# Should show address
# If not, add it manually
```

### Breeding Transaction Fails
- Check you own both NFTs
- Check NFTs not at max breed count (3)
- Check NFTs not in cooldown (24h)
- Check you sent enough MATIC (0.02 + gas)

## Quick Commands

### Check Deployment
```bash
cat evonft-contracts/deployments/breeding-amoy.json
```

### Check Minter Role
```bash
npx hardhat console --network amoy
```
```javascript
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D")
const breedingAddress = "0xYOUR_ADDRESS"
const MINTER_ROLE = await nft.MINTER_ROLE()
await nft.hasRole(MINTER_ROLE, breedingAddress)
```

### Verify Contract on PolygonScan
```bash
npx hardhat verify --network amoy <BREEDING_ADDRESS> <NFT_CONTRACT>
```

## Cost Summary

| Item | Cost |
|------|------|
| Deployment | ~0.05 MATIC |
| Grant Role | ~0.01 MATIC |
| Test Breeding | ~0.03 MATIC |
| **Total** | **~0.09 MATIC** |

## Success Indicators

✅ Contract deployed
✅ Minter role granted
✅ Frontend shows breeding page
✅ Can select NFTs
✅ Can predict offspring
✅ Can breed successfully
✅ Offspring appears in collection

---

**Estimated Time:** 10-15 minutes
**Difficulty:** Medium
**Status:** Ready to deploy! 🚀
