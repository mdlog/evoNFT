# 🧬 Breeding System - Complete Implementation

## ✅ What Has Been Created

### 1. Smart Contract
**File:** `evonft-contracts/contracts/NFTBreeding.sol`

**Features:**
- ✅ Breed two NFTs to create offspring
- ✅ Offspring inherits 70% of parents' average stats
- ✅ Generation tracking (Gen 1, Gen 2, etc.)
- ✅ Breed count limit (max 3 breeds per NFT)
- ✅ Cooldown system (24 hours between breeds)
- ✅ Breeding fee (0.01 MATIC default)
- ✅ Predict offspring stats before breeding
- ✅ Security (ReentrancyGuard, ownership checks)

### 2. Deployment Script
**File:** `evonft-contracts/scripts/deploy-breeding.js`

**Usage:**
```bash
cd evonft-contracts
npx hardhat run scripts/deploy-breeding.js --network amoy
```

### 3. Frontend Integration

**Files Created:**
- `evonft-app/src/hooks/useBreeding.js` - Breeding hooks
- `evonft-app/src/pages/BreedingLabIntegrated.jsx` - Breeding UI
- Updated `evonft-app/src/config/contractsExtended.js` - Breeding ABI

**Hooks:**
- `useBreeding()` - Connect to breeding contract
- `useNFTBreedingInfo(tokenId)` - Get breeding info for NFT
- `useOffspringPrediction(parent1, parent2)` - Predict offspring stats
- `useBreedingActions()` - Breed action
- `useCanBreedPair(parent1, parent2)` - Check if pair can breed

## 🚀 Deployment Steps

### Step 1: Deploy Breeding Contract

```bash
cd evonft-contracts

# Make sure .env has NFT_CONTRACT address
cat .env | grep VITE_NFT_CONTRACT

# Deploy breeding contract
npx hardhat run scripts/deploy-breeding.js --network amoy
```

**Expected Output:**
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

✅ Deployment complete!
```

### Step 2: Grant Minter Role (IMPORTANT!)

The breeding contract needs permission to mint new NFTs:

```bash
cd evonft-contracts
npx hardhat console --network amoy
```

In console:
```javascript
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D")
const breedingAddress = "0x..." // Your breeding contract address

// Grant MINTER_ROLE
const MINTER_ROLE = await nft.MINTER_ROLE()
await nft.grantRole(MINTER_ROLE, breedingAddress)

console.log("✅ Minter role granted!")
```

### Step 3: Update .env

Add breeding address to `evonft-app/.env`:
```bash
VITE_BREEDING_CONTRACT=0x... # Address from deployment
```

### Step 4: Restart Frontend

```bash
cd evonft-app
rm -rf node_modules/.vite
npm run dev
```

### Step 5: Verify Contract (Optional)

```bash
npx hardhat verify --network amoy <BREEDING_ADDRESS> <NFT_CONTRACT>
```

## 🎮 How Breeding Works

### Breeding Mechanics

```
PARENT 1 (Level 10)          PARENT 2 (Level 8)
Stats: 80/100            +    Stats: 60/100
Generation: 0                 Generation: 0
Breed Count: 0/3              Breed Count: 1/3
         ↓                            ↓
              BREEDING (0.01 MATIC)
                      ↓
              OFFSPRING (Gen 1)
              Level: 1
              Stats: 49/100 (70% of avg)
              Breed Count: 0/3
              Generation: 1
```

### Stats Calculation

```javascript
// Offspring stats = 70% of parents' average
offspringStrength = ((parent1Strength + parent2Strength) * 70) / 200

Example:
Parent 1 Strength: 80
Parent 2 Strength: 60
Average: (80 + 60) / 2 = 70
Offspring: 70 * 0.7 = 49
```

### Generation System

```
Gen 0 (Minted) → Gen 1 (Bred from Gen 0)
Gen 1 → Gen 2 (Bred from Gen 1)
Gen 2 → Gen 3 (Bred from Gen 2)
...

Offspring generation = max(parent1Gen, parent2Gen) + 1
```

### Breeding Rules

1. **Ownership**: Must own both parent NFTs
2. **Different NFTs**: Cannot breed NFT with itself
3. **Breed Limit**: Each NFT can breed max 3 times
4. **Cooldown**: 24 hours between breeds per NFT
5. **Fee**: 0.01 MATIC per breeding
6. **Stats**: Offspring gets 70% of parents' average stats

## 📊 Frontend Features

### Breeding Lab Page (`/breeding`)

**Features:**
- ✅ Select two parent NFTs from your collection
- ✅ View breeding info (breed count, cooldown, generation)
- ✅ Predict offspring stats before breeding
- ✅ See breeding cost and cooldown
- ✅ Confirm breeding with modal
- ✅ Success notification with offspring ID
- ✅ Real-time data from blockchain

**UI Components:**
1. **Parent Cards** - Select and view parent NFTs
2. **Offspring Preview** - Predicted stats and generation
3. **NFT Selection Modal** - Choose from your collection
4. **Confirm Modal** - Review before breeding
5. **Success Modal** - View offspring after breeding

### User Flow

```
1. Go to /breeding
   ↓
2. Click "Select NFT" for Parent 1
   ↓
3. Choose NFT from collection
   ↓
4. Click "Select NFT" for Parent 2
   ↓
5. Choose second NFT
   ↓
6. View predicted offspring stats
   ↓
7. Click "Start Breeding"
   ↓
8. Review in confirmation modal
   ↓
9. Click "Confirm"
   ↓
10. Approve transaction in MetaMask
   ↓
11. Wait for confirmation
   ↓
12. Success! View offspring
```

## 🔒 Security Features

### Smart Contract:
- ✅ ReentrancyGuard on breed function
- ✅ Ownership verification
- ✅ Breed count checks
- ✅ Cooldown enforcement
- ✅ Fee validation
- ✅ Same NFT prevention

### Frontend:
- ✅ Transaction confirmations
- ✅ Error handling
- ✅ Loading states
- ✅ Input validation
- ✅ Eligibility checks

## 💰 Economics

### Breeding Costs

```
Base Fee: 0.01 MATIC
Gas Fee: ~0.01 MATIC (estimate)
Total: ~0.02 MATIC per breeding
```

### Revenue Model

```
Breeding Fee → Contract Owner
Can be adjusted by owner
Default: 0.01 MATIC
```

### ROI Example

```
Scenario: Breed two Level 10 NFTs

Cost:
- Breeding fee: 0.01 MATIC
- Gas: 0.01 MATIC
- Total: 0.02 MATIC

Offspring:
- Level 1 with 70% of parents' stats
- Can be trained to increase value
- Can be sold on marketplace
- Can breed 3 more times

Potential Value:
- Sell immediately: 0.05-0.1 MATIC
- Train to Level 5: 0.2-0.5 MATIC
- Breed offspring: 3x breeding revenue
```

## 🧪 Testing Checklist

### Smart Contract:
- [ ] Deploy successfully
- [ ] Grant minter role
- [ ] Breed two NFTs
- [ ] Check offspring stats
- [ ] Verify breed count increments
- [ ] Test cooldown enforcement
- [ ] Test max breed limit
- [ ] Test fee collection
- [ ] Verify generation tracking

### Frontend:
- [ ] Connect to contract
- [ ] Load user's NFTs
- [ ] Select parent NFTs
- [ ] View breeding info
- [ ] Predict offspring stats
- [ ] Breed successfully
- [ ] View offspring
- [ ] Handle errors
- [ ] Check cooldown display
- [ ] Verify breed count display

## 📝 API Reference

### Smart Contract Functions

#### breed(uint256 parent1Id, uint256 parent2Id)
```solidity
function breed(uint256 parent1Id, uint256 parent2Id) 
    external 
    payable 
    returns (uint256 offspringId)
```
Breeds two NFTs to create offspring.

**Parameters:**
- `parent1Id`: Token ID of first parent
- `parent2Id`: Token ID of second parent

**Returns:**
- `offspringId`: Token ID of new offspring

**Requires:**
- msg.value >= breedingFee
- Caller owns both parents
- Parents not at max breed count
- Parents not in cooldown

#### canBreed(uint256 tokenId)
```solidity
function canBreed(uint256 tokenId) external view returns (bool)
```
Check if NFT can breed now.

#### getBreedingInfo(uint256 tokenId)
```solidity
function getBreedingInfo(uint256 tokenId) 
    external 
    view 
    returns (
        uint256 breedCount,
        uint256 lastBreedTime,
        uint256 generation,
        bool canBreedNow,
        uint256 timeUntilBreedable
    )
```
Get complete breeding info for NFT.

#### predictOffspringStats(uint256 parent1Id, uint256 parent2Id)
```solidity
function predictOffspringStats(uint256 parent1Id, uint256 parent2Id)
    external
    view
    returns (
        uint256 strength,
        uint256 speed,
        uint256 intelligence,
        uint256 defense,
        uint256 luck,
        uint256 generation
    )
```
Calculate predicted offspring stats.

### Frontend Hooks

#### useBreeding()
```javascript
const { contract, contractWithSigner, config, loading } = useBreeding()
```
Connect to breeding contract and get configuration.

#### useNFTBreedingInfo(tokenId)
```javascript
const { info, loading } = useNFTBreedingInfo(tokenId)
```
Get breeding info for specific NFT.

#### useOffspringPrediction(parent1Id, parent2Id)
```javascript
const { prediction, loading } = useOffspringPrediction(parent1Id, parent2Id)
```
Predict offspring stats.

#### useBreedingActions()
```javascript
const { breed, breeding } = useBreedingActions()

await breed(parent1Id, parent2Id, breedingFee)
```
Perform breeding action.

## 🎯 Future Enhancements

### Phase 1 (Current):
- ✅ Basic breeding
- ✅ Stats inheritance
- ✅ Generation tracking
- ✅ Cooldown system

### Phase 2 (Planned):
- 🔄 Trait inheritance (visual traits)
- 🔄 Rarity inheritance
- 🔄 Mutation chance
- 🔄 Special breeding events

### Phase 3 (Advanced):
- 📅 Cross-rarity breeding
- 📅 Breeding marketplace
- 📅 Breeding tournaments
- 📅 Genetics system

### Phase 4 (Future):
- 🌟 DNA system
- 🌟 Breeding guilds
- 🌟 Offspring prediction AI
- 🌟 Breeding analytics

## 💡 Tips

### For Breeders:
- Breed high-level NFTs for better offspring
- Check cooldown before planning breeds
- Each NFT can only breed 3 times - use wisely
- Higher generation = more valuable

### For Collectors:
- Gen 0 (minted) NFTs are most valuable
- Low generation offspring can breed more
- High-stat offspring can be trained further
- Breeding creates scarcity

### For Traders:
- Offspring can be sold immediately
- High-stat offspring sell for more
- Low breed count = more valuable
- Generation matters for collectors

## 🆘 Troubleshooting

### Issue: "Parent in cooldown"
**Solution:** Wait 24 hours since last breed

### Issue: "Max breeds reached"
**Solution:** NFT has bred 3 times, cannot breed anymore

### Issue: "Not owner of parent"
**Solution:** You must own both NFTs

### Issue: "Insufficient breeding fee"
**Solution:** Send at least 0.01 MATIC with transaction

### Issue: "Contract not connected"
**Solution:** 
1. Check VITE_BREEDING_CONTRACT in .env
2. Restart frontend
3. Verify contract deployed

## 📚 Resources

- Smart Contract: `evonft-contracts/contracts/NFTBreeding.sol`
- Frontend: `evonft-app/src/pages/BreedingLabIntegrated.jsx`
- Hooks: `evonft-app/src/hooks/useBreeding.js`
- Config: `evonft-app/src/config/contractsExtended.js`

---

**Status:** Ready for deployment ✅
**Next:** Deploy contract and grant minter role
**Time Estimate:** 30 minutes for deployment + testing
