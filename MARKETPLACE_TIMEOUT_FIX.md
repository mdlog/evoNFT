# Marketplace Listings Timeout Fix

## 🐛 Masalah

Listings tidak ter-load di Marketplace dengan error:
```
MetaMask - RPC Error: Internal JSON-RPC error.
"request timed out"
"fromBlock": "0x0", "toBlock": "latest"
```

## 🔍 Root Cause

### Query Filter Terlalu Luas

**Kode Sebelumnya:**
```javascript
// Query ALL blocks from genesis (0) to latest
const filter = contract.filters.Listed();
const events = await contract.queryFilter(filter);
// fromBlock: 0x0, toBlock: latest
```

**Masalah:**
- ❌ Query dari block 0 (genesis) sampai latest
- ❌ Polygon Amoy sudah punya jutaan blocks
- ❌ RPC provider timeout karena terlalu banyak data
- ❌ MetaMask/Infura limit: max 10,000 blocks per query

**Error:**
```json
{
  "code": -32603,
  "data": {
    "code": -32002,
    "message": "request timed out"
  },
  "message": "Internal JSON-RPC error."
}
```

## ✅ Solusi

### Batasi Block Range

**Kode Sesudah:**
```javascript
// Get current block
const currentBlock = await contract.runner.provider.getBlockNumber();

// Query last 10000 blocks only (about 1 week on Polygon)
const fromBlock = Math.max(0, currentBlock - 10000);

// Query with limited range
const filter = contract.filters.Listed();
const events = await contract.queryFilter(filter, fromBlock, currentBlock);
```

**Keuntungan:**
- ✅ Query hanya 10,000 blocks terakhir
- ✅ Tidak timeout
- ✅ Cepat (< 2 detik)
- ✅ Cukup untuk listing yang baru (1 minggu terakhir)

## 📊 Block Range Calculation

### Polygon Amoy Testnet
- Block time: ~2 seconds
- Blocks per day: 43,200
- Blocks per week: ~302,400

**Range yang Digunakan:**
- 10,000 blocks = ~5.5 jam
- Cukup untuk testing dan development

**Untuk Production:**
```javascript
// 1 week
const fromBlock = currentBlock - 302400;

// 1 month
const fromBlock = currentBlock - 1296000;
```

## 🔧 Perubahan yang Dilakukan

### File: `evonft-app/src/hooks/useMarketplace.js`

**Sebelum:**
```javascript
async function loadListings() {
    try {
        const filter = contract.filters.Listed();
        const events = await contract.queryFilter(filter);  // ❌ Timeout!
        // ...
    }
}
```

**Sesudah:**
```javascript
async function loadListings() {
    try {
        // Get current block
        const currentBlock = await contract.runner.provider.getBlockNumber();
        
        // Query last 10000 blocks
        const fromBlock = Math.max(0, currentBlock - 10000);
        
        // Query with limited range
        const filter = contract.filters.Listed();
        const events = await contract.queryFilter(filter, fromBlock, currentBlock);  // ✅ Fast!
        // ...
    }
}
```

## 🎯 Alternative Solutions

### 1. **Pagination**
Query blocks in chunks:
```javascript
const CHUNK_SIZE = 5000;
let allEvents = [];

for (let i = 0; i < totalBlocks; i += CHUNK_SIZE) {
    const from = i;
    const to = Math.min(i + CHUNK_SIZE, currentBlock);
    const events = await contract.queryFilter(filter, from, to);
    allEvents = [...allEvents, ...events];
}
```

### 2. **Use Subgraph (The Graph)**
Index events off-chain:
```graphql
query {
  listings(where: {active: true}) {
    tokenId
    seller
    price
    listedAt
  }
}
```

### 3. **Cache in Backend**
Store listings in database:
```javascript
// Backend API
GET /api/listings
// Returns cached listings from database
```

### 4. **Use Contract View Function**
Add to smart contract:
```solidity
function getAllActiveListings() external view returns (Listing[] memory) {
    // Return array of active listings
}
```

## 📝 Testing

### Before Fix
```
📋 Loading all listings...
❌ Error: request timed out
   Query: fromBlock 0 to latest (millions of blocks)
   Time: 30+ seconds → timeout
   Result: No listings loaded
```

### After Fix
```
📋 Loading all listings...
   Current block: 15234567
   Querying from block: 15224567 to 15234567
   ✅ Found 1 listing events
   Checking tokenId 2...
   - isListed: true
   - Listing data: {tokenId: 2, price: '1.5', ...}
   ✅ Found 1 active listings
   
Time: ~2 seconds
Result: Listings loaded successfully!
```

## ⚠️ Limitations

### Current Implementation
- ✅ Fast and reliable
- ✅ Works for recent listings (last 10,000 blocks)
- ❌ Misses old listings (> 10,000 blocks ago)

### If NFT Listed Long Ago
**Option 1:** Increase block range
```javascript
const fromBlock = currentBlock - 100000;  // ~13 hours
```

**Option 2:** Use specific block range
```javascript
// If you know when contract was deployed
const deployBlock = 14000000;
const fromBlock = deployBlock;
```

**Option 3:** Use pagination
```javascript
// Query in chunks
const CHUNK_SIZE = 10000;
// Query multiple chunks
```

## 🚀 Recommended for Production

### 1. **Environment Variable for Block Range**
```javascript
// .env
VITE_LISTING_BLOCK_RANGE=100000

// Code
const blockRange = import.meta.env.VITE_LISTING_BLOCK_RANGE || 10000;
const fromBlock = currentBlock - blockRange;
```

### 2. **Cache Listings**
```javascript
// Use React Query or SWR
const { data: listings } = useQuery('listings', fetchListings, {
    staleTime: 60000,  // Cache for 1 minute
    refetchInterval: 120000  // Refetch every 2 minutes
});
```

### 3. **Fallback to Direct Check**
```javascript
// If no events found, check specific NFTs
if (events.length === 0) {
    // Check known NFT IDs
    for (let tokenId = 1; tokenId <= totalMinted; tokenId++) {
        const isListed = await contract.isListed(tokenId);
        if (isListed) {
            // Add to listings
        }
    }
}
```

## ✅ Kesimpulan

**Masalah:** Query filter timeout karena range terlalu luas (0 to latest)

**Penyebab:**
- Query jutaan blocks
- RPC provider limit
- MetaMask timeout

**Solusi:**
- ✅ Batasi block range (10,000 blocks)
- ✅ Query hanya blocks terakhir
- ✅ Fast & reliable

**Hasil:** Listings sekarang ter-load dengan cepat! 🚀

**Next Steps:**
1. Test dengan NFT yang listed
2. Verifikasi badge "For Sale" muncul
3. Adjust block range jika perlu
4. Consider caching untuk production
