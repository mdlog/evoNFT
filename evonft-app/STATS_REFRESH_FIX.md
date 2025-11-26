# Fix: Stats & Attributes Tidak Update Setelah Training

## Masalah
Stats & Attributes tidak berubah setelah training berhasil dan terkonfirmasi di blockchain.

## Root Cause
`useNFTStats` hook hanya fetch data sekali saat component mount dengan dependency `[contract, tokenId]`. Tidak ada mekanisme untuk refresh data setelah training berhasil.

## Solusi yang Diimplementasikan

### 1. Tambahkan Refresh Key ke useNFTStats Hook
**File**: `evonft-app/src/hooks/useExtendedContract.js`

```javascript
// Sebelum:
export function useNFTStats(tokenId) {
    // ...
    useEffect(() => {
        loadStats();
    }, [contract, tokenId]);
}

// Sesudah:
export function useNFTStats(tokenId, refreshKey = 0) {
    // ...
    useEffect(() => {
        console.log(`📊 Loading stats for NFT #${tokenId}... (refresh: ${refreshKey})`);
        loadStats();
    }, [contract, tokenId, refreshKey]); // ✅ Tambah refreshKey dependency
}
```

### 2. Pass Refresh Key dari NFTDetailIntegrated
**File**: `evonft-app/src/pages/NFTDetailIntegrated.jsx`

```javascript
// State untuk trigger refresh
const [refreshKey, setRefreshKey] = useState(0)

// Pass refreshKey ke hook
const { stats, progress, loading: statsLoading } = useNFTStats(id, refreshKey)

// Function untuk refresh data
const refreshData = () => {
    console.log('🔄 Refreshing NFT data...')
    setRefreshKey(prev => prev + 1) // ✅ Increment key untuk trigger re-fetch
}
```

### 3. Modal Callbacks Sudah Terhubung
**File**: `evonft-app/src/pages/NFTDetailIntegrated.jsx`

```javascript
<TrainModal
    isOpen={showTrainModal}
    onClose={() => setShowTrainModal(false)}
    onSuccess={() => {
        console.log('✅ Train successful, refreshing data...');
        refreshData(); // ✅ Trigger refresh
    }}
    tokenId={id}
    nftName={nft.name}
/>

<FeedModal
    isOpen={showFeedModal}
    onClose={() => setShowFeedModal(false)}
    onSuccess={() => {
        console.log('✅ Feed successful, refreshing data...');
        refreshData(); // ✅ Trigger refresh
    }}
    tokenId={id}
    nftName={nft.name}
/>
```

### 4. TrainModal & FeedModal Sudah Memanggil onSuccess
**File**: `evonft-app/src/components/TrainModal.jsx` & `FeedModal.jsx`

```javascript
// Setelah transaksi berhasil
const receipt = await tx.wait();
console.log('Train transaction confirmed:', receipt);

// Wait untuk blockchain update
await new Promise(resolve => setTimeout(resolve, 2000));

// Call onSuccess callback
if (onSuccess) {
    onSuccess(); // ✅ Trigger refresh di parent
}

onClose();
```

## Cara Kerja

1. User klik tombol **Train** atau **Feed**
2. Modal terbuka dan user pilih stat/food
3. Transaksi dikirim ke blockchain
4. Setelah transaksi confirmed:
   - Modal memanggil `onSuccess()` callback
   - Parent component (`NFTDetailIntegrated`) memanggil `refreshData()`
   - `refreshKey` di-increment dari 0 → 1
   - `useNFTStats` hook detect perubahan `refreshKey` di dependency array
   - Hook fetch ulang data stats dari smart contract
   - UI update dengan stats terbaru

## Testing

1. Buka NFT detail page
2. Klik **Train** dan pilih stat
3. Confirm transaksi di wallet
4. Tunggu transaksi confirmed
5. ✅ Stats & Attributes akan otomatis update tanpa perlu reload page

## Console Logs untuk Debugging

```
✅ Train successful, refreshing data...
🔄 Refreshing NFT data...
📊 Loading stats for NFT #1... (refresh: 1)
✅ Stats loaded from contract for NFT #1
   📊 Stats: { strength: 6, intelligence: 5, speed: 5, endurance: 5, luck: 5 }
   📈 Progress: { currentXP: 100, currentLevel: 1, ... }
```

## Files Modified

1. ✅ `evonft-app/src/hooks/useExtendedContract.js` - Tambah refreshKey parameter
2. ✅ `evonft-app/src/pages/NFTDetailIntegrated.jsx` - Pass refreshKey & implement refreshData
3. ✅ `evonft-app/src/components/TrainModal.jsx` - Sudah ada onSuccess callback
4. ✅ `evonft-app/src/components/FeedModal.jsx` - Sudah ada onSuccess callback

## Status
✅ **FIXED** - Stats akan otomatis refresh setelah training berhasil
