# 🔧 Mint Troubleshooting Guide

## Common Mint Errors & Solutions

### 1. "Transaction failed. Please try again."

#### Possible Causes:

**A. Insufficient MATIC Balance**
```
Error: insufficient funds for intrinsic transaction cost
```
**Solution:**
- Check MATIC balance di wallet
- Get test MATIC dari faucet: https://faucet.polygon.technology
- Minimum needed: ~0.01 MATIC untuk gas + mint price

**B. Wrong Network**
```
Error: Contract not found on [network]
```
**Solution:**
- Switch ke Polygon Amoy Testnet (Chain ID: 80002)
- Click network switcher di navbar
- Atau manual add network di wallet

**C. Contract Sold Out**
```
Error: Max supply reached
```
**Solution:**
- Check total minted vs max supply
- Wait for new supply atau secondary market

**D. Signer Not Available**
```
Error: Signer is null or undefined
```
**Solution:**
- Disconnect dan reconnect wallet
- Refresh page
- Check wallet connection status

**E. Gas Estimation Failed**
```
Error: cannot estimate gas
```
**Solution:**
- Check contract is deployed
- Verify contract address
- Check network connection

### 2. Transaction Pending Forever

**Causes:**
- Network congestion
- Gas price too low
- RPC node issues

**Solutions:**
1. Wait 2-3 minutes
2. Check transaction on explorer
3. Try different RPC URL
4. Increase gas price (if wallet allows)
5. Cancel and retry

### 3. Wallet Not Connecting

**Solutions:**
1. Refresh page
2. Clear browser cache
3. Try different wallet
4. Check wallet extension enabled
5. Update wallet extension

## Debug Steps

### Step 1: Check Console Logs

Open browser console (F12) dan check:

```javascript
// Should see:
🎯 Mint clicked
👤 Account: 0x...
📝 Contract with signer: Contract { ... }
🔧 Creating contract with signer...
✅ Contract with signer initialized
```

### Step 2: Verify Contract

```javascript
// In console:
console.log('Contract Address:', '0xe31d18Fb9925f677451845997f64806a88264b3D')
console.log('Network:', await provider.getNetwork())
console.log('Balance:', await provider.getBalance(account))
```

### Step 3: Check Transaction

If transaction sent:
```
Transaction sent: 0x...
```

Check on explorer:
https://amoy.polygonscan.com/tx/0x...

### Step 4: Test Contract Calls

```javascript
// Test read functions
const totalMinted = await contract.totalMinted()
const maxSupply = await contract.maxSupply()
const mintPrice = await contract.mintPrice()

console.log('Total Minted:', totalMinted.toString())
console.log('Max Supply:', maxSupply.toString())
console.log('Mint Price:', ethers.formatEther(mintPrice), 'MATIC')
```

## Quick Fixes

### Fix 1: Reconnect Wallet
```
1. Click wallet address di navbar
2. Click "Disconnect"
3. Click "Connect Wallet"
4. Select wallet
5. Approve connection
```

### Fix 2: Switch Network
```
1. Click network indicator
2. Select "Polygon Amoy"
3. Approve network switch
4. Wait for confirmation
```

### Fix 3: Clear Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Reconnect wallet
```

### Fix 4: Increase Gas
```
1. When MetaMask popup appears
2. Click "Edit" on gas fee
3. Increase gas limit by 20%
4. Confirm transaction
```

### Fix 5: Use Different RPC
```javascript
// In .env, try different RPC:
VITE_RPC_URL=https://rpc-amoy.polygon.technology
// or
VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
```

## Contract Verification

### Check Contract Deployed
```bash
# Visit block explorer:
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D

# Should show:
- Contract verified ✓
- Contract source code
- Read/Write functions
```

### Test Contract Functions
```javascript
// In browser console:
const provider = new ethers.BrowserProvider(window.ethereum)
const contract = new ethers.Contract(
  '0xe31d18Fb9925f677451845997f64806a88264b3D',
  CONTRACT_ABI,
  provider
)

// Test read
const name = await contract.name()
console.log('Contract name:', name) // Should be "EvoNFT"
```

## Error Messages Explained

### "Please connect your wallet first"
- Wallet not connected
- Click "Connect Wallet" button

### "Contract address not configured"
- Missing VITE_NFT_CONTRACT in .env
- Check .env file exists

### "Contract not found on [network]"
- Wrong network selected
- Switch to Polygon Amoy

### "Insufficient funds"
- Not enough MATIC for gas + mint price
- Get MATIC from faucet

### "Max supply reached"
- All NFTs minted
- Check secondary market

### "User rejected transaction"
- User clicked "Reject" in wallet
- Try again and click "Confirm"

### "Nonce too high"
- Transaction queue issue
- Reset account in wallet settings

## Prevention Tips

### Before Minting:
1. ✅ Check MATIC balance (>0.01 MATIC)
2. ✅ Verify network (Polygon Amoy)
3. ✅ Check contract address
4. ✅ Test wallet connection
5. ✅ Check console for errors

### During Minting:
1. ✅ Don't close browser
2. ✅ Don't switch networks
3. ✅ Wait for confirmation
4. ✅ Check transaction status

### After Minting:
1. ✅ Wait for blockchain confirmation
2. ✅ Check transaction on explorer
3. ✅ Refresh page to see NFT
4. ✅ Check My NFTs page

## Still Having Issues?

### Check These:
1. Browser console for errors
2. Network tab for failed requests
3. Wallet for pending transactions
4. Block explorer for transaction status
5. Contract on explorer for verification

### Get Help:
1. Check documentation files
2. Review console logs
3. Check transaction hash on explorer
4. Verify contract address
5. Test with different wallet

## Common Solutions Summary

| Error | Solution |
|-------|----------|
| Insufficient funds | Get MATIC from faucet |
| Wrong network | Switch to Polygon Amoy |
| Wallet not connected | Reconnect wallet |
| Transaction failed | Check gas, retry |
| Signer null | Refresh page, reconnect |
| Contract not found | Verify network & address |
| Gas estimation failed | Check contract deployed |
| Pending forever | Wait or cancel & retry |

---

**Need More Help?**
- Check console logs (F12)
- Visit block explorer
- Review contract on Polygonscan
- Test with small amount first

**Status**: Updated for RainbowKit
**Last Updated**: 2025-11-06
