# ⏱️ Breeding Time Information

## Quick Answer

**NFT offspring lahir LANGSUNG setelah breeding transaction confirmed!**

Tidak ada waktu tunggu atau gestation period. Offspring di-mint immediately.

## Breeding Process Timeline

### Step 1: Initiate Breeding (User Action)
```
User clicks "Breed" button
↓
Select Parent 1 & Parent 2
↓
Confirm transaction
```
**Time**: ~5 seconds (user interaction)

### Step 2: Transaction Processing (Blockchain)
```
Transaction sent to blockchain
↓
Smart contract validates:
- Ownership ✓
- Cooldown status ✓
- Breed count ✓
- Payment ✓
↓
Mint offspring NFT
↓
Update parent breeding info
↓
Transaction confirmed
```
**Time**: ~10-30 seconds (blockchain confirmation)

### Step 3: Offspring Ready (Immediate)
```
Transaction confirmed
↓
Offspring NFT minted
↓
Appears in wallet immediately
↓
Can be viewed in My NFTs
```
**Time**: Immediate (0 seconds wait)

## Total Time

| Phase | Duration |
|-------|----------|
| User interaction | ~5 seconds |
| Blockchain confirmation | ~10-30 seconds |
| Waiting period | **0 seconds** |
| **TOTAL** | **~15-35 seconds** |

## Cooldown Period

### What is Cooldown?
After breeding, **both parents** enter a cooldown period before they can breed again.

### Cooldown Duration
```
Default: 24 hours
```

### Cooldown Rules
- ✅ Offspring is born immediately
- ⏳ Parents cannot breed again for 24 hours
- 🔄 Each parent has independent cooldown
- 📊 Cooldown starts after transaction confirms

### Example Timeline
```
Day 1, 10:00 AM - Breed NFT #1 + NFT #2
Day 1, 10:00 AM - Offspring #10 born (immediate)
Day 1, 10:00 AM - NFT #1 & #2 enter cooldown
Day 2, 10:00 AM - NFT #1 & #2 can breed again
```

## Breeding Limits

### Per NFT
```
Max Breed Count: 3 times
```

Each NFT can only breed 3 times in its lifetime.

### Example
```
NFT #1 breeds with NFT #2 → Offspring #10 (Count: 1/3)
NFT #1 breeds with NFT #3 → Offspring #11 (Count: 2/3)
NFT #1 breeds with NFT #4 → Offspring #12 (Count: 3/3)
NFT #1 cannot breed anymore (Max reached)
```

## Breeding Costs

### Fees
```
Breeding Fee: 0.01 MATIC
Mint Price: 0.001 MATIC (from NFT contract)
Gas Fee: ~0.001-0.005 MATIC
---
Total: ~0.012-0.016 MATIC
```

### Payment Breakdown
1. **Breeding Fee** (0.01 MATIC) → Goes to breeding contract
2. **Mint Price** (0.001 MATIC) → Goes to NFT contract
3. **Gas Fee** (variable) → Goes to validators

## Smart Contract Logic

### Breeding Function
```solidity
function breed(uint256 parent1Id, uint256 parent2Id) 
    external 
    payable 
    returns (uint256 offspringId) 
{
    // Validate parents
    require(parent1Id != parent2Id, "Cannot breed with self");
    require(ownerOf(parent1Id) == msg.sender, "Not owner");
    
    // Check cooldown
    require(
        block.timestamp >= lastBreedTime + breedingCooldown,
        "In cooldown"
    );
    
    // Check breed count
    require(breedCount < maxBreedCount, "Max breeds reached");
    
    // Mint offspring IMMEDIATELY
    offspringId = nftContract.mint(msg.sender, uri);
    
    // Update breeding info
    breedCount++;
    lastBreedTime = block.timestamp;
    
    return offspringId;
}
```

### Key Points
- ✅ Offspring minted in same transaction
- ✅ No waiting period
- ✅ Immediate ownership transfer
- ✅ Cooldown starts immediately

## Offspring Stats

### Inheritance
```
Offspring stats = Average of parents + Random variation
```

### Example
```
Parent 1: Strength 50
Parent 2: Strength 60
Offspring: Strength 55 ± 5 (50-60 range)
```

### Generation
```
Offspring Generation = Max(Parent1 Gen, Parent2 Gen) + 1
```

### Example
```
Parent 1: Generation 0
Parent 2: Generation 1
Offspring: Generation 2
```

## User Experience

### What User Sees

**1. Before Breeding**
```
[Select Parent 1] [Select Parent 2]
[Breed Button]
```

**2. During Transaction**
```
⏳ Breeding in progress...
Waiting for blockchain confirmation...
```

**3. After Confirmation**
```
✅ Breeding successful!
🎉 Offspring #10 has been born!
[View Offspring]
```

**4. Immediate Access**
```
- Offspring appears in My NFTs
- Can view stats immediately
- Can use in all features (stake, train, etc)
- Parents show cooldown timer
```

## Comparison with Other Systems

### Traditional Breeding Games
```
Initiate → Wait 24-48 hours → Claim offspring
```

### EvoNFT Breeding
```
Initiate → Offspring born immediately ✅
```

### Why Instant?
- ✅ Better UX (no waiting)
- ✅ Simpler smart contract
- ✅ Lower gas costs
- ✅ Immediate gratification
- ✅ No claim transaction needed

## FAQ

### Q: Do I need to wait for offspring to be born?
**A:** No! Offspring is minted immediately when transaction confirms.

### Q: When can I use my offspring?
**A:** Immediately after breeding transaction confirms.

### Q: Can I breed the same NFT multiple times?
**A:** Yes, up to 3 times total, with 24-hour cooldown between breeds.

### Q: What happens during cooldown?
**A:** Parents cannot breed, but offspring is already born and usable.

### Q: Can I cancel breeding?
**A:** No, once transaction is sent, it cannot be cancelled.

### Q: Do I need to claim offspring?
**A:** No, offspring is automatically minted to your wallet.

### Q: Can offspring breed immediately?
**A:** Yes! Offspring has no cooldown and can breed right away (if you have another NFT).

## Technical Details

### Contract: NFTBreeding.sol
```
Location: evonft-contracts/contracts/NFTBreeding.sol
Function: breed(uint256 parent1Id, uint256 parent2Id)
Returns: uint256 offspringId
```

### Configuration
```solidity
breedingFee = 0.01 ether;        // 0.01 MATIC
breedingCooldown = 24 hours;     // 24 hours
maxBreedCount = 3;               // 3 times per NFT
```

### Events
```solidity
event Bred(
    uint256 indexed parent1Id,
    uint256 indexed parent2Id,
    uint256 indexed offspringId,
    address breeder,
    uint256 timestamp
);
```

## Summary

| Aspect | Value |
|--------|-------|
| **Birth Time** | Immediate (0 wait) |
| **Transaction Time** | ~10-30 seconds |
| **Cooldown** | 24 hours |
| **Max Breeds** | 3 per NFT |
| **Cost** | ~0.012 MATIC |
| **Offspring Usability** | Immediate |

---

**Key Takeaway**: Breeding in EvoNFT is **instant**! No waiting period, no claiming needed. Offspring is born and ready to use as soon as the transaction confirms.

**Status**: ✅ Documented
**Last Updated**: 2025-11-06
