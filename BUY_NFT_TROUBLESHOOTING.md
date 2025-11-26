# Buy NFT Troubleshooting Guide

## 🐛 Error: "Failed to buy NFT"

### 🔍 Debugging Steps

#### 1. Check Console Logs

Setelah klik "Buy", cek console browser untuk logs:

```javascript
🛒 Buying NFT: {
  tokenId: 2,
  price: '1.0',
  priceWei: '1000000000000000000',
  seller: '0x...'
}

💰 Your balance: 5.5 MATIC
💵 Required: 1.0 MATIC

📤 Sending transaction...
✅ Transaction sent: 0x...
⏳ Waiting for confirmation...
✅ Transaction confirmed: 0x...
```

#### 2. Common Errors

##### Error: "Insufficient MATIC balance"
**Penyebab:**
- Balance < price + gas fees
- Tidak cukup MATIC di wallet

**Solusi:**
```
1. Cek balance di MetaMask
2. Pastikan punya MATIC cukup:
   - Price: 1.0 MATIC
   - Gas: ~0.01 MATIC
   - Total: ~1.01 MATIC
3. Dapatkan MATIC dari faucet:
   https://faucet.polygon.technology/
```

##### Error: "Transaction cancelled by user"
**Penyebab:**
- User klik "Reject" di MetaMask

**Solusi:**
- Klik "Buy" lagi
- Approve transaction di MetaMask

##### Error: "NFT is no longer for sale"
**Penyebab:**
- NFT sudah di-cancel listing
- NFT sudah dibeli orang lain

**Solusi:**
- Refresh page
- Cari NFT lain

##### Error: "You cannot buy your own NFT"
**Penyebab:**
- Wallet address = seller address

**Solusi:**
- Gunakan wallet lain
- Atau cancel listing jika ingin unlist

##### Error: "Price data is missing"
**Penyebab:**
- `listing.priceWei` undefined
- Listing data tidak lengkap

**Solusi:**
```javascript
// Cek di console:
console.log('Listing data:', listing);

// Harus ada:
{
  tokenId: 2,
  price: '1.0',
  priceWei: BigInt('1000000000000000000'),  // ✅ Harus ada!
  seller: '0x...',
  active: true
}
```

##### Error: "Contract or listing data not available"
**Penyebab:**
- `marketplaceContract` null
- `listing` null

**Solusi:**
```javascript
// Cek contract initialization
console.log('Contract:', marketplaceContract);
console.log('Listing:', listing);

// Pastikan:
- Wallet connected
- Contract address benar di .env
- Network = Polygon Amoy
```

#### 3. Check Smart Contract

##### Verify Contract Deployed
```bash
# Check contract on PolygonScan
https://amoy.polygonscan.com/address/0x4fe6d4C271300BB796f8F00751aA46f93667D677
```

##### Check NFT Listed
```javascript
// Test di console browser
const contract = new ethers.Contract(
    '0x4fe6d4C271300BB796f8F00751aA46f93667D677',
    MARKETPLACE_ABI,
    provider
);

const isListed = await contract.isListed(2);
console.log('Is listed:', isListed);  // Should be true

const listing = await contract.getListing(2);
console.log('Listing:', listing);
```

#### 4. Check Network

```javascript
// Cek network di MetaMask
const network = await provider.getNetwork();
console.log('Network:', network.name);  // Should be 'matic-amoy'
console.log('Chain ID:', network.chainId);  // Should be 80002

// Jika salah network:
- Switch ke Polygon Amoy di MetaMask
- Atau klik network switcher di app
```

#### 5. Check Approval

NFT contract harus approve marketplace:

```javascript
// Check approval
const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
const approved = await nftContract.getApproved(tokenId);
console.log('Approved to:', approved);
// Should be marketplace address

// Atau check operator approval
const isApproved = await nftContract.isApprovedForAll(seller, MARKETPLACE_ADDRESS);
console.log('Is approved for all:', isApproved);
// Should be true
```

## 🔧 Enhanced Error Handling

### Updated BuyNFTModal.jsx

```javascript
async function handleBuy() {
    try {
        // 1. Validate inputs
        if (!marketplaceContract || !listing) {
            throw new Error('Contract or listing data not available');
        }

        if (!listing.priceWei) {
            throw new Error('Price data is missing');
        }

        // 2. Check balance
        const balance = await provider.getBalance(account);
        if (balance < listing.priceWei) {
            throw new Error('Insufficient MATIC balance');
        }

        // 3. Send transaction
        const tx = await marketplaceContract.buyNFT(nft.id, {
            value: listing.priceWei
        });

        // 4. Wait for confirmation
        await tx.wait();

        // 5. Success
        alert('Purchase successful!');
        onSuccess();
        onClose();

    } catch (error) {
        // Enhanced error messages
        let errorMessage = 'Failed to buy NFT';
        
        if (error.code === 'ACTION_REJECTED') {
            errorMessage = 'Transaction cancelled';
        } else if (error.message.includes('insufficient funds')) {
            errorMessage = 'Insufficient MATIC balance';
        } else if (error.reason) {
            errorMessage = error.reason;
        }

        alert(errorMessage);
    }
}
```

## 📊 Testing Checklist

### Before Buy
- [ ] Wallet connected
- [ ] Correct network (Polygon Amoy)
- [ ] Sufficient MATIC balance (price + gas)
- [ ] NFT is listed (check console)
- [ ] Not buying own NFT

### During Buy
- [ ] Modal opens
- [ ] NFT details correct
- [ ] Price displayed correctly
- [ ] MetaMask popup appears
- [ ] Transaction details correct in MetaMask

### After Buy
- [ ] Transaction confirmed
- [ ] Success message shown
- [ ] NFT ownership transferred
- [ ] NFT removed from marketplace
- [ ] Balance updated

## 🚀 Quick Fixes

### Fix 1: Refresh Page
```
1. Close modal
2. Refresh browser (F5)
3. Try buy again
```

### Fix 2: Reconnect Wallet
```
1. Disconnect wallet
2. Connect wallet again
3. Try buy again
```

### Fix 3: Switch Network
```
1. Open MetaMask
2. Switch to Polygon Amoy
3. Try buy again
```

### Fix 4: Clear Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. "Empty Cache and Hard Reload"
4. Try buy again
```

### Fix 5: Check Contract
```bash
# Run test script
node test-listing-nft2.js

# Should show:
✅ isListed: true
✅ Listing Data: {
  seller: '0x...',
  price: '1.0 MATIC',
  active: true
}
```

## 📝 Error Messages Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Insufficient MATIC balance" | Balance < price + gas | Get more MATIC from faucet |
| "Transaction cancelled" | User rejected | Approve in MetaMask |
| "NFT is no longer for sale" | Already sold/cancelled | Refresh page |
| "Cannot buy own NFT" | Buyer = seller | Use different wallet |
| "Price data is missing" | listing.priceWei undefined | Refresh page, check listing |
| "Contract not available" | Contract not initialized | Reconnect wallet |
| "Network mismatch" | Wrong network | Switch to Polygon Amoy |

## ✅ Success Indicators

When buy is successful, you should see:

```
Console:
🛒 Buying NFT: {...}
💰 Your balance: 5.5 MATIC
💵 Required: 1.0 MATIC
📤 Sending transaction...
✅ Transaction sent: 0x...
⏳ Waiting for confirmation...
✅ Transaction confirmed: 0x...

Alert:
"Successfully purchased EvoNFT #2 for 1.0 MATIC!"

Result:
- NFT transferred to your wallet
- MATIC deducted from balance
- NFT removed from marketplace
- Page refreshed
```

## 🆘 Still Not Working?

1. **Check console for detailed error logs**
2. **Copy error message**
3. **Check transaction on PolygonScan**
4. **Verify contract is deployed and working**
5. **Try with different NFT**
6. **Contact support with error details**

## 📞 Support Info

**Contract Addresses:**
- NFT: `0xe31d18Fb9925f677451845997f64806a88264b3D`
- Marketplace: `0x4fe6d4C271300BB796f8F00751aA46f93667D677`

**Network:**
- Name: Polygon Amoy Testnet
- Chain ID: 80002
- RPC: https://rpc-amoy.polygon.technology

**Explorer:**
- https://amoy.polygonscan.com
