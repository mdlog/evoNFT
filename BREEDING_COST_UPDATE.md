# 🧬 Breeding Cost Update

## 💰 Total Breeding Cost

Breeding sekarang memerlukan **2 biaya**:

### 1. Breeding Fee: 0.01 MATIC
- Dibayar ke breeding contract
- Untuk service breeding
- Configurable oleh owner

### 2. Mint Price: 0.01 MATIC  
- Dibayar ke NFT contract
- Untuk mint offspring baru
- Same as regular mint price

### Total Cost: **0.02 MATIC + Gas**

```
Breeding Fee:  0.01 MATIC
Mint Price:    0.01 MATIC
Gas Fee:      ~0.01 MATIC
─────────────────────────
Total:        ~0.03 MATIC
```

## 🔄 Payment Flow

```
User pays 0.02 MATIC
        ↓
Breeding Contract
        ├─→ 0.01 MATIC (breeding fee) → Contract owner
        └─→ 0.01 MATIC (mint price) → NFT Contract → Mint offspring
```

## 📝 Contract Changes

### Before:
```solidity
// Only breeding fee
require(msg.value >= breedingFee, "Insufficient breeding fee");
offspringId = nftContract.mint(msg.sender, uri);
```

### After:
```solidity
// Breeding fee + mint price
uint256 mintPrice = nftContract.mintPrice();
require(msg.value >= breedingFee + mintPrice, "Insufficient payment");
offspringId = nftContract.mint{value: mintPrice}(msg.sender, uri);
```

## 🎯 Frontend Update

Update `useBreeding.js` to show total cost:

```javascript
const totalCost = parseFloat(config.breedingFee) + 0.01; // breeding + mint
```

Update UI to show breakdown:

```
Breeding Fee:  0.01 MATIC
Mint Price:    0.01 MATIC
Gas (est):    ~0.01 MATIC
─────────────────────────
Total:        ~0.03 MATIC
```

## ✅ Benefits

1. **Fair Pricing**: Offspring minting costs same as regular mint
2. **Revenue Split**: Breeding fee goes to contract owner, mint fee to NFT contract
3. **Transparent**: Users see exact cost breakdown
4. **Flexible**: Both fees can be adjusted independently

## 🔧 Configuration

### Change Breeding Fee:
```javascript
// In breeding contract
await breedingContract.setBreedingFee(ethers.parseEther("0.02"))
```

### Change Mint Price:
```javascript
// In NFT contract
await nftContract.setMintPrice(ethers.parseEther("0.02"))
```

## 📊 Economics

### Scenario: Breed 2 Level 10 NFTs

**Cost:**
- Breeding: 0.02 MATIC
- Gas: 0.01 MATIC
- Total: 0.03 MATIC

**Result:**
- Offspring Level 1
- Stats: 70% of parents avg
- Can be trained
- Can breed 3 times
- Can be sold

**Potential Value:**
- Immediate sale: 0.05-0.1 MATIC
- After training: 0.2-0.5 MATIC
- Breeding revenue: 3x 0.02 = 0.06 MATIC

**ROI:** 67% - 1567% depending on strategy

---

**Updated:** 2025-01-05
**Status:** Ready for deployment
