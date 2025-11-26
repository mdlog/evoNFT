# 🛒 List for Sale Troubleshooting

## Common Error: "Failed to list NFT"

### Possible Causes & Solutions

#### 1. Wallet Not Connected
**Error**: Missing required data
**Solution**: 
- Connect wallet first
- Refresh page
- Try again

#### 2. Not NFT Owner
**Error**: "You are not the owner of this NFT"
**Solution**:
- Only owner can list NFT
- Check ownership in My NFTs page
- Verify correct wallet connected

#### 3. Insufficient Gas
**Error**: "Insufficient MATIC for gas"
**Solution**:
- Get MATIC from faucet: https://faucet.polygon.technology
- Need ~0.01 MATIC for gas

#### 4. Already Listed
**Error**: "NFT is already listed"
**Solution**:
- NFT already on marketplace
- Cancel existing listing first
- Then create new listing

#### 5. Approval Failed
**Error**: Error during approval step
**Solution**:
- Approve marketplace contract
- Confirm transaction in wallet
- Wait for confirmation
- Try listing again

#### 6. Contract Not Initialized
**Error**: Missing contractWithSigner
**Solution**:
- Wait for contracts to load
- Refresh page
- Check network (Polygon Amoy)

## Listing Process

### Step 1: Input Price
```
Enter price in MATIC
Minimum: 0.01 MATIC
```

### Step 2: Approve Marketplace (First Time Only)
```
Transaction 1: Approve
- Allows marketplace to transfer your NFT
- One-time approval per NFT
- Gas cost: ~0.001-0.005 MATIC
```

### Step 3: List NFT
```
Transaction 2: List for Sale
- Creates listing on marketplace
- Sets price
- Gas cost: ~0.001-0.005 MATIC
```

## Debug Steps

### 1. Check Console Logs
Open browser console (F12) and look for:
```
User address: 0x...
Checking approval for token: X
Approved address: 0x...
Is approved for all: true/false
```

### 2. Verify Contracts
```javascript
// Check if contracts loaded
console.log('Marketplace contract:', marketplaceContract)
console.log('NFT contract:', nftContract)
```

### 3. Check Ownership
```javascript
// Verify you own the NFT
const owner = await nftContract.ownerOf(tokenId)
console.log('NFT owner:', owner)
console.log('Your address:', userAddress)
```

### 4. Check Approval
```javascript
// Check if marketplace approved
const approved = await nftContract.getApproved(tokenId)
console.log('Approved:', approved)
console.log('Marketplace:', MARKETPLACE_CONTRACT)
```

## Error Messages Explained

### "Transaction cancelled by user"
- User clicked "Reject" in wallet
- Solution: Try again and click "Confirm"

### "Insufficient MATIC for gas"
- Not enough MATIC for transaction
- Solution: Get MATIC from faucet

### "NFT is already listed"
- NFT already on marketplace
- Solution: Cancel existing listing first

### "You are not the owner of this NFT"
- Wrong wallet connected
- Solution: Connect correct wallet

### "Failed to list NFT: [error]"
- Generic error with details
- Solution: Check console for full error

## Marketplace Fees

### Fee Structure
```
Sale Price: 10 MATIC
Marketplace Fee: 2.5% (0.25 MATIC)
You Receive: 9.75 MATIC
```

### Gas Costs
```
Approval: ~0.001-0.005 MATIC (one-time)
Listing: ~0.001-0.005 MATIC
Total: ~0.002-0.01 MATIC
```

## Best Practices

### Before Listing
1. ✅ Connect wallet
2. ✅ Check MATIC balance
3. ✅ Verify NFT ownership
4. ✅ Check network (Polygon Amoy)
5. ✅ Set reasonable price

### During Listing
1. ✅ Approve marketplace (first time)
2. ✅ Confirm approval transaction
3. ✅ Wait for confirmation
4. ✅ Confirm listing transaction
5. ✅ Wait for confirmation

### After Listing
1. ✅ Check marketplace for listing
2. ✅ Verify price is correct
3. ✅ NFT appears in "For Sale" filter
4. ✅ Can cancel anytime

## Contract Addresses

### Polygon Amoy Testnet
```
NFT Contract: 0xe31d18Fb9925f677451845997f64806a88264b3D
Marketplace: 0x4fe6d4C271300BB796f8F00751aA46f93667D677
```

## Testing Checklist

### Test Listing
- [ ] Connect wallet
- [ ] Go to My NFTs
- [ ] Click "List for Sale"
- [ ] Enter price
- [ ] Approve marketplace
- [ ] Confirm listing
- [ ] Check marketplace

### Test Approval
- [ ] First listing requires approval
- [ ] Subsequent listings skip approval
- [ ] Approval persists across sessions

### Test Errors
- [ ] Try listing without wallet
- [ ] Try listing someone else's NFT
- [ ] Try listing with 0 MATIC
- [ ] Try listing already listed NFT

## Quick Fixes

### Fix 1: Refresh Page
```
Ctrl+F5 (hard refresh)
Reconnect wallet
Try again
```

### Fix 2: Clear Approval
```
If stuck on approval:
1. Cancel transaction
2. Refresh page
3. Try again
```

### Fix 3: Check Network
```
Verify you're on Polygon Amoy:
Chain ID: 80002
RPC: https://rpc-amoy.polygon.technology
```

### Fix 4: Get MATIC
```
Visit faucet:
https://faucet.polygon.technology

Request MATIC for Polygon Amoy
Wait for confirmation
Try listing again
```

## Support

### If Still Having Issues
1. Check console logs
2. Copy error message
3. Check transaction on explorer
4. Verify contract addresses
5. Test with different NFT

### Useful Links
- Faucet: https://faucet.polygon.technology
- Explorer: https://amoy.polygonscan.com
- NFT Contract: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
- Marketplace: https://amoy.polygonscan.com/address/0x4fe6d4C271300BB796f8F00751aA46f93667D677

---

**Status**: ✅ Improved Error Handling
**Last Updated**: 2025-11-06
