# 🔧 Fix "Sold Out" Issue - Complete Guide

## 🐛 Problem
Mint page shows "Sold Out" or "Contract Not Connected" even though NFTs are available.

## ✅ Solutions Applied

### 1. **Improved Error Handling in MintNFT Component**

Added fallback values and better loading states:
```javascript
// Before: Could show 0/0 if stats fail to load
{stats.totalMinted}/{stats.maxSupply}

// After: Shows fallback values
{stats.totalMinted || 0}/{stats.maxSupply || 10000}
```

### 2. **Better Button States**

Now shows different states:
- **Loading...** - While fetching stats
- **Contract Not Connected** - If stats fail to load
- **Mint for X MATIC** - Ready to mint
- **Sold Out** - Actually sold out

### 3. **Debug Info Panel**

Added yellow warning panel when contract not connected:
```
⚠️ Contract Connection Issue
The contract stats are not loading. This could be due to:
• Wrong network (should be Polygon Amoy)
• RPC connection issue
• Contract address not configured
```

### 4. **Fixed Duplicate maxSupply**

Removed duplicate line in `useContractStats` hook.

## 🔍 How to Debug

### Step 1: Check Browser Console

Open DevTools (F12) and look for these logs:

**✅ Good (Working):**
```
📊 Loading contract stats...
📍 Contract address: 0xe31d18Fb9925f677451845997f64806a88264b3D
✅ Stats loaded: {
  totalMinted: 0,
  maxSupply: 10000,
  mintPrice: '0.01',
  cooldown: 86400
}
```

**❌ Bad (Not Working):**
```
⚠️ Contract not initialized
❌ Error loading stats: ...
```

### Step 2: Check Network

Make sure MetaMask is on **Polygon Amoy Testnet**:
- Network Name: Polygon Amoy Testnet
- Chain ID: 80002
- RPC URL: https://rpc-amoy.polygon.technology
- Currency: MATIC
- Explorer: https://amoy.polygonscan.com

### Step 3: Verify Contract on PolygonScan

Visit: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D#readContract

Check these values:
- `totalMinted()` → Should be a number (e.g., 0, 5, 10)
- `maxSupply()` → Should be 10000
- `mintPrice()` → Should be 10000000000000000 (0.01 MATIC)

If these values are correct, contract is working fine.

### Step 4: Restart Frontend

Sometimes Vite needs a full restart:

```bash
# Stop frontend (Ctrl+C)
cd evonft-app

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

### Step 5: Clear Browser Cache

**Chrome/Edge:**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

**Firefox:**
1. Ctrl+Shift+Delete
2. Select "Cached Web Content"
3. Click "Clear Now"

## 🚀 Quick Fixes

### Fix 1: Run Debug Script

```bash
chmod +x debug-mint.sh
./debug-mint.sh
```

This will check:
- .env configuration
- Contract address setup
- Frontend status

### Fix 2: Test Contract Directly

Open `evonft-app/test-contract.html` in browser to test contract connection without the app.

### Fix 3: Check RPC Connection

Try different RPC endpoints in MetaMask:
- https://rpc-amoy.polygon.technology (Primary)
- https://polygon-amoy.drpc.org (Alternative)
- https://polygon-amoy-bor-rpc.publicnode.com (Backup)

### Fix 4: Verify Environment Variables

Check `evonft-app/.env`:
```bash
cat evonft-app/.env | grep VITE_NFT_CONTRACT
```

Should show:
```
VITE_NFT_CONTRACT=0xe31d18Fb9925f677451845997f64806a88264b3D
```

If not, add it:
```bash
echo "VITE_NFT_CONTRACT=0xe31d18Fb9925f677451845997f64806a88264b3D" >> evonft-app/.env
```

Then restart frontend.

## 🧪 Test in Browser Console

Run this in browser console (F12) to test directly:

```javascript
// Test 1: Check if ethers is loaded
console.log('Ethers:', typeof ethers !== 'undefined' ? '✅' : '❌');

// Test 2: Check MetaMask
console.log('MetaMask:', typeof window.ethereum !== 'undefined' ? '✅' : '❌');

// Test 3: Test contract call
(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
        '0xe31d18Fb9925f677451845997f64806a88264b3D',
        [
            'function totalMinted() view returns (uint256)',
            'function maxSupply() view returns (uint256)',
            'function mintPrice() view returns (uint256)'
        ],
        provider
    );
    
    try {
        const total = await contract.totalMinted();
        const max = await contract.maxSupply();
        const price = await contract.mintPrice();
        
        console.log('✅ Contract working!');
        console.log('Total Minted:', total.toString());
        console.log('Max Supply:', max.toString());
        console.log('Mint Price:', ethers.formatEther(price), 'MATIC');
    } catch (error) {
        console.error('❌ Contract error:', error);
    }
})();
```

## 📊 Expected Results

### When Working Correctly:

**Mint Page:**
```
┌─────────────────────────┐
│  Mint Your EvoNFT       │
├─────────────────────────┤
│      [NFT Preview]      │
├─────────────────────────┤
│  0/10000      0.01 MATIC│
│  Minted       Price     │
├─────────────────────────┤
│ [Mint for 0.01 MATIC]   │ ← Active button
└─────────────────────────┘
```

**Browser Console:**
```
📊 Loading contract stats...
📍 Contract address: 0xe31d18Fb9925f677451845997f64806a88264b3D
✅ Stats loaded: { totalMinted: 0, maxSupply: 10000, mintPrice: '0.01' }
```

### When Not Working:

**Mint Page:**
```
┌─────────────────────────┐
│  Mint Your EvoNFT       │
├─────────────────────────┤
│      [NFT Preview]      │
├─────────────────────────┤
│  [Loading...]           │
├─────────────────────────┤
│ [⚠️ Contract Not Connected] │ ← Disabled button
├─────────────────────────┤
│ ⚠️ Contract Connection Issue│
│ • Wrong network         │
│ • RPC connection issue  │
│ • Contract not configured│
└─────────────────────────┘
```

**Browser Console:**
```
⚠️ Contract not initialized
❌ Error loading stats: ...
```

## 🔧 Advanced Troubleshooting

### Issue: Stats show 0/0

**Cause:** Contract not returning values

**Fix:**
1. Check network (must be Polygon Amoy)
2. Verify contract address in .env
3. Test contract on PolygonScan
4. Try different RPC endpoint

### Issue: Button says "Contract Not Connected"

**Cause:** useContractStats hook failing

**Fix:**
1. Check browser console for errors
2. Verify MetaMask is connected
3. Restart frontend with cache clear
4. Check if contract is verified on PolygonScan

### Issue: Stats load but button still disabled

**Cause:** Logic error in button disabled condition

**Fix:**
Check MintNFT.jsx line ~199:
```javascript
disabled={minting || statsLoading || (stats && stats.totalMinted >= stats.maxSupply)}
```

Should allow minting when:
- Not currently minting
- Stats finished loading
- totalMinted < maxSupply

### Issue: "Sold Out" but totalMinted < maxSupply

**Cause:** Comparison logic error

**Fix:**
Add console.log to debug:
```javascript
console.log('Mint check:', {
    minting,
    statsLoading,
    totalMinted: stats?.totalMinted,
    maxSupply: stats?.maxSupply,
    isSoldOut: stats?.totalMinted >= stats?.maxSupply
});
```

## 📝 Checklist

Before reporting issue, verify:

- [ ] MetaMask connected to Polygon Amoy (Chain ID: 80002)
- [ ] Contract verified on PolygonScan
- [ ] Browser console shows contract address
- [ ] Stats show correct values (not 0/0)
- [ ] Frontend restarted with cache clear
- [ ] Browser cache cleared
- [ ] .env file has correct contract address
- [ ] Test contract HTML works
- [ ] No errors in browser console

## 🆘 Still Not Working?

If all above steps fail:

1. **Screenshot browser console** (F12 → Console tab)
2. **Screenshot mint page** (showing the error)
3. **Copy .env file content** (hide private keys!)
4. **Note your MetaMask network** (name, chain ID, RPC)

Then share for further debugging.

---

**Last Updated:** 2025-01-05
**Status:** Fixed with improved error handling and debugging
