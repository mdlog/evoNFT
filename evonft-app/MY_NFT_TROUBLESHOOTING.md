# My NFT Page Troubleshooting Guide

## Issue: My NFT Page Appears Blank

### Possible Causes & Solutions

#### 1. **Wallet Not Connected**
**Symptom:** Page shows "Connect Your Wallet" message or is completely blank

**Solution:**
- Click "Connect Wallet" button in the navigation
- Approve the connection in MetaMask
- Make sure you're on the correct network (Polygon Amoy Testnet)

#### 2. **No NFTs Owned**
**Symptom:** Page loads but shows "No NFTs Yet" message

**Solution:**
- This is expected if you haven't minted or purchased any NFTs
- Click "Mint Your First NFT" to create one
- Or visit "Explore Marketplace" to browse available NFTs

#### 3. **Loading State Stuck**
**Symptom:** Spinning loader never completes

**Possible Causes:**
- Network connection issues
- RPC endpoint not responding
- Contract not deployed on current network

**Solutions:**
```bash
# Check browser console for errors (F12)
# Look for messages like:
# - "Failed to fetch"
# - "Contract not deployed"
# - "Network error"

# Try refreshing the page
# Switch networks and switch back
# Check if contracts are deployed (see POLYGON_AMOY_SETUP.md)
```

#### 4. **Error Loading NFTs**
**Symptom:** Error message displayed with retry button

**Solutions:**
- Click "Retry" button
- Check browser console for specific error
- Verify contract addresses in `src/config/contracts.js`
- Ensure you're connected to the correct network

### Debug Mode

The page now includes debug logging. Open browser console (F12) to see:
```javascript
MyCollection Debug: {
    account: "0x...",
    nftsCount: 0,
    visualNFTsCount: 0,
    loading: false,
    visualLoading: false,
    error: null
}
```

### Alternative Simple Version

If the main page has issues, you can temporarily use the simple version:

**File:** `src/pages/MyCollectionSimple.jsx`

To use it, update `src/App.jsx`:
```javascript
// Change this:
import MyCollection from './pages/MyCollectionIntegrated'

// To this:
import MyCollection from './pages/MyCollectionSimple'
```

The simple version:
- ✅ No advanced filtering
- ✅ Simpler rendering logic
- ✅ Easier to debug
- ✅ Same visual system

### Common Error Messages

#### "Failed to resolve import"
**Cause:** Missing dependencies

**Solution:**
```bash
cd evonft-app
npm install
```

#### "Cannot read property 'length' of undefined"
**Cause:** NFTs array is undefined

**Solution:** Already handled with fallback `nfts || []`

#### "useNFTVisuals is not a function"
**Cause:** Hook import issue

**Solution:** Check that `src/hooks/useNFTVisuals.js` exists

### Network Configuration

Make sure you're on Polygon Amoy Testnet:
- **Network Name:** Polygon Amoy Testnet
- **RPC URL:** https://rpc-amoy.polygon.technology/
- **Chain ID:** 80002
- **Currency Symbol:** MATIC
- **Block Explorer:** https://amoy.polygonscan.com/

### Contract Verification

Check if contracts are deployed:
```bash
# In evonft-contracts directory
node scripts/verify-deployment.js
```

### Testing with Mock Data

If you want to test the UI without blockchain connection:

1. Comment out the `useMyNFTs()` hook
2. Use `useMockNFTs(10)` instead
3. This will show 10 sample NFTs

Example:
```javascript
// const { nfts, loading, error } = useMyNFTs()
const mockNFTs = useMockNFTs(10)
const nfts = mockNFTs
const loading = false
const error = null
```

### Performance Issues

If the page is slow:

1. **Reduce NFT count in visual generation**
   - The `useNFTVisuals` hook processes all NFTs
   - For large collections, this might be slow

2. **Disable filters temporarily**
   - Set `showFilters={false}` in NFTGallery

3. **Use simple grid view**
   - Switch to MyCollectionSimple.jsx

### Browser Compatibility

Tested on:
- ✅ Chrome/Brave (Recommended)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (May have Web3 issues)

### Still Having Issues?

1. **Clear browser cache**
   - Ctrl+Shift+Delete (Chrome)
   - Clear site data

2. **Check MetaMask**
   - Update to latest version
   - Reset account if needed
   - Check permissions

3. **Verify installation**
   ```bash
   cd evonft-app
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

4. **Check console logs**
   - Open DevTools (F12)
   - Look for red errors
   - Share error messages for help

### Expected Behavior

**When wallet is connected and you own NFTs:**
- ✅ Statistics cards show your NFT count, avg level, total XP, value
- ✅ NFTs displayed in grid with visual representations
- ✅ Can filter by rarity, creature type, level
- ✅ Can search by name or ID
- ✅ Can switch between grid and list view

**When wallet is connected but no NFTs:**
- ✅ Statistics show zeros
- ✅ "No NFTs Yet" message with action buttons
- ✅ Links to Mint and Explore pages

**When wallet is not connected:**
- ✅ "Connect Your Wallet" message
- ✅ No NFT data loaded

### Files Involved

- `src/pages/MyCollectionIntegrated.jsx` - Main collection page
- `src/pages/MyCollectionSimple.jsx` - Simplified version
- `src/hooks/useContract.js` - Blockchain data fetching
- `src/hooks/useNFTVisuals.js` - Visual generation
- `src/components/NFTGallery.jsx` - Gallery component
- `src/components/NFTCard.jsx` - Individual NFT card

### Quick Fixes

**Page is blank:**
```javascript
// Check if account is connected
console.log('Account:', account)

// Check if NFTs are loading
console.log('Loading:', loading)
console.log('NFTs:', nfts)

// Check for errors
console.log('Error:', error)
```

**NFTs not showing:**
```javascript
// Check visual generation
console.log('Visual NFTs:', visualNFTs)
console.log('Display NFTs:', displayNFTs)
```

**Filters not working:**
- Try disabling filters: `showFilters={false}`
- Check console for filter-related errors
- Use simple version without filters
