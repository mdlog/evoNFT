# 🧬 Breeding System - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Deploy Contract (2 min)

```bash
cd evonft-contracts
npx hardhat run scripts/deploy-breeding.js --network amoy
```

Copy the breeding contract address from output.

### Step 2: Grant Minter Role (1 min)

```bash
npx hardhat console --network amoy
```

```javascript
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D")
const breedingAddress = "0xYOUR_BREEDING_ADDRESS" // From step 1

const MINTER_ROLE = await nft.MINTER_ROLE()
await nft.grantRole(MINTER_ROLE, breedingAddress)
console.log("✅ Done!")
```

### Step 3: Update Frontend (1 min)

Add to `evonft-app/.env`:
```
VITE_BREEDING_CONTRACT=0xYOUR_BREEDING_ADDRESS
```

### Step 4: Restart Frontend (1 min)

```bash
cd evonft-app
rm -rf node_modules/.vite
npm run dev
```

### Step 5: Test Breeding

1. Go to http://localhost:5173/breeding
2. Select two NFTs
3. Click "Start Breeding"
4. Confirm transaction
5. Done! 🎉

## ✅ Verification

Check if working:

1. **Browser Console** should show:
```
🧬 Initializing Breeding Contract: 0x...
✅ Breeding read contract initialized
```

2. **Breeding Page** should show:
- Your NFTs in selection modal
- Breeding info (breed count, cooldown)
- Predicted offspring stats
- "Start Breeding" button active

3. **After Breeding**:
- Success modal appears
- Offspring ID shown
- Can view new NFT

## 🐛 Troubleshooting

### Contract not connected
```bash
# Check .env
cat evonft-app/.env | grep BREEDING

# Should show:
VITE_BREEDING_CONTRACT=0x...
```

### Minter role not granted
```bash
# Check in console
npx hardhat console --network amoy
```
```javascript
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D")
const breedingAddress = "0xYOUR_ADDRESS"
const MINTER_ROLE = await nft.MINTER_ROLE()
const hasRole = await nft.hasRole(MINTER_ROLE, breedingAddress)
console.log("Has minter role:", hasRole) // Should be true
```

### NFTs not showing
- Make sure you own at least 2 NFTs
- Check network (must be Polygon Amoy)
- Refresh page

## 📊 Expected Behavior

### Before Breeding:
```
Parent 1: Level 10, Breed Count 0/3
Parent 2: Level 8, Breed Count 1/3
Cost: 0.01 MATIC
```

### After Breeding:
```
Parent 1: Level 10, Breed Count 1/3, Cooldown 24h
Parent 2: Level 8, Breed Count 2/3, Cooldown 24h
Offspring: Level 1, Breed Count 0/3, Gen 1
```

## 💡 Quick Tips

- Each NFT can breed 3 times max
- 24 hour cooldown between breeds
- Offspring gets 70% of parents' average stats
- Higher level parents = better offspring
- Generation increases with each breeding

---

**Total Time:** ~5 minutes
**Cost:** ~0.02 MATIC (deployment + test breeding)
**Status:** Production Ready ✅
