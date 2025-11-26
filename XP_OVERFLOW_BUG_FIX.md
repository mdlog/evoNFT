# XP Overflow Bug - Fix ✅

## Problem

XP berhasil di-update di contract (100 XP), tapi UI menampilkan 0 karena error OVERFLOW.

## Root Cause

### Error Message:
```
Panic due to OVERFLOW(17)
execution reverted: Panic due to OVERFLOW(17)
```

### Bug Location:
**Contract:** `EvolvableNFTExtended.sol`
**Function:** `getTokenProgress()`

```solidity
function getTokenProgress(uint256 tokenId) external view returns (...) {
    currentXP = tokenXP[tokenId];           // 100
    currentLevel = version[tokenId];         // 1
    xpForNextLevel = _getXPForLevel(currentLevel + 1);  // 2000
    
    if (currentXP >= xpForNextLevel) {
        xpProgress = 100;
    } else {
        uint256 xpForCurrentLevel = _getXPForLevel(currentLevel);  // 1000
        uint256 xpInLevel = currentXP - xpForCurrentLevel;  // 100 - 1000 = UNDERFLOW! ❌
        // ...
    }
}
```

### Why It Happens:
- XP = 100
- Level = 1
- xpForCurrentLevel = 1000 (level 1 requires 1000 XP)
- **100 - 1000 = UNDERFLOW** (can't subtract bigger number from smaller in uint)

### The Logic Error:
Formula assumes XP starts from `xpForCurrentLevel`, but actually XP starts from 0.

**Correct logic should be:**
- Level 0: 0 XP
- Level 1: 1000 XP
- Level 2: 2000 XP

But contract uses:
- Level 1: 1000 XP (wrong, should be 0)
- Level 2: 2000 XP

## Solution

### Frontend Workaround (Immediate Fix)

**File:** `evonft-app/src/hooks/useExtendedContract.js`

```javascript
catch (err) {
    console.warn('⚠️ Could not load extended stats, using defaults:', err.message);

    // Try to get XP directly even if progress fails
    let currentXP = 0;
    let currentLevel = 1;
    try {
        currentXP = Number(await contract.tokenXP(tokenId));
        currentLevel = Number(await contract.version(tokenId));
    } catch (xpErr) {
        console.warn('Could not get XP:', xpErr.message);
    }

    // Calculate progress manually (correct formula)
    const xpForNextLevel = (currentLevel + 1) * 1000;
    const xpProgress = Math.min(100, Math.floor((currentXP / xpForNextLevel) * 100));

    setProgress({
        currentXP,
        currentLevel,
        xpForNextLevel,
        xpProgress
    });
}
```

### Contract Fix (Proper Solution)

**File:** `evonft-contracts/contracts/EvolvableNFTExtended.sol`

```solidity
function getTokenProgress(uint256 tokenId)
    external
    view
    returns (
        uint256 currentXP,
        uint256 currentLevel,
        uint256 xpForNextLevel,
        uint256 xpProgress
    )
{
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    
    currentXP = tokenXP[tokenId];
    currentLevel = version[tokenId];
    xpForNextLevel = _getXPForLevel(currentLevel + 1);
    
    // FIX: Calculate progress from 0, not from xpForCurrentLevel
    if (currentXP >= xpForNextLevel) {
        xpProgress = 100;
    } else {
        // Simple formula: (currentXP / xpForNextLevel) * 100
        xpProgress = (currentXP * 100) / xpForNextLevel;
    }
}
```

**Or better, fix the level system:**

```solidity
function _getXPForLevel(uint256 level) internal pure returns (uint256) {
    // Level 0 = 0 XP
    // Level 1 = 1000 XP
    // Level 2 = 2000 XP
    if (level == 0) return 0;
    return level * 1000;
}

function getTokenProgress(uint256 tokenId)
    external
    view
    returns (...)
{
    currentXP = tokenXP[tokenId];
    currentLevel = version[tokenId];
    xpForNextLevel = _getXPForLevel(currentLevel + 1);
    
    if (currentXP >= xpForNextLevel) {
        xpProgress = 100;
    } else {
        uint256 xpForCurrentLevel = _getXPForLevel(currentLevel);
        
        // Now this won't underflow
        if (currentXP < xpForCurrentLevel) {
            xpProgress = 0;
        } else {
            uint256 xpInLevel = currentXP - xpForCurrentLevel;
            uint256 xpNeeded = xpForNextLevel - xpForCurrentLevel;
            xpProgress = (xpInLevel * 100) / xpNeeded;
        }
    }
}
```

## Testing

### Before Fix:
```
✅ XP from contract: 100
❌ Could not load extended stats: Panic due to OVERFLOW(17)
❌ UI shows: XP: 0 / 1000 (0%)
```

### After Fix:
```
✅ XP from contract: 100
✅ Got XP directly: 100
✅ Got Level directly: 1
✅ UI shows: XP: 100 / 2000 (5%)
```

## Current Status

### ✅ Frontend Fix Applied
- XP now fetched directly from contract
- Progress calculated manually
- No more OVERFLOW error
- UI displays correct XP

### ⚠️ Contract Still Has Bug
- Contract `getTokenProgress()` still has overflow bug
- But frontend works around it
- Should fix contract in next deployment

## How to Deploy Contract Fix

### 1. Update Contract
Edit `evonft-contracts/contracts/EvolvableNFTExtended.sol`

### 2. Test Locally
```bash
cd evonft-contracts
npx hardhat test
```

### 3. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network amoy
```

### 4. Update Frontend Config
Update contract address in `.env`

### 5. Verify Contract
```bash
npx hardhat verify --network amoy <NEW_ADDRESS> "EvoNFT" "EVONFT" <AI_SIGNER>
```

## Workaround for Current Contract

Since contract is already deployed, we use frontend workaround:

1. ✅ Fetch XP directly with `tokenXP()`
2. ✅ Fetch level directly with `version()`
3. ✅ Calculate progress manually
4. ✅ Display in UI

## Prevention

### For Future Contracts:

1. **Always check for underflow**
   ```solidity
   if (a < b) {
       // Handle case
   } else {
       uint256 result = a - b;
   }
   ```

2. **Use SafeMath or Solidity 0.8+**
   - Solidity 0.8+ has built-in overflow/underflow checks
   - But still need logical checks

3. **Test edge cases**
   - Test with XP = 0
   - Test with XP < level requirement
   - Test with XP = level requirement
   - Test with XP > level requirement

4. **Add require statements**
   ```solidity
   require(currentXP >= xpForCurrentLevel, "XP calculation error");
   ```

## Summary

| Item | Status |
|------|--------|
| **Bug** | OVERFLOW in getTokenProgress() |
| **Cause** | Wrong XP calculation formula |
| **Impact** | UI shows 0 XP instead of real value |
| **Frontend Fix** | ✅ Applied - Fetch XP directly |
| **Contract Fix** | ⚠️ Needed for next deployment |
| **Current Status** | ✅ Working with workaround |

## Result

✅ **XP now displays correctly in UI**
✅ **Progress bar works**
✅ **Level calculation works**
✅ **Feed/Train updates XP correctly**

---

**Note:** Contract bug doesn't affect XP storage, only the progress calculation view function. XP is stored correctly and updates work fine.
