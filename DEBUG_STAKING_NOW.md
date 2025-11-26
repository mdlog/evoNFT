# Debug Staking - Langkah Cepat

## Yang Sudah Saya Tambahkan

### 1. ✅ Debug Logs di contractsExtended.js
Sekarang akan menampilkan:
```
🔍 Extended Contracts Config:
  NFT_CONTRACT: 0xe31d18Fb9925f677451845997f64806a88264b3D
  STAKING_CONTRACT: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
  BREEDING_CONTRACT: 0x39d6b4ba1CDe6A43Fa6A3a63Df38b299041A2986
```

### 2. ✅ Debug Logs di usePoolStats
Sekarang akan menampilkan:
```
🔍 usePoolStats - contract: Available
🔍 usePoolStats - account: 0x...
🔄 Loading pool stats...
✅ Total staked: X
✅ User stakes: Y
✅ Contract balance: Z MATIC
```

### 3. ✅ Debug Logs di StakingIntegrated
Sekarang akan menampilkan:
```
📊 Pool Stats State: {poolStats: {...}, poolLoading: false}
📊 Pool Stats (Real Data): {...}
```

### 4. ✅ Null Safety
Menambahkan optional chaining untuk mencegah error:
```javascript
poolStats?.userStakedCount?.toString() || '0'
```

## Langkah Troubleshoot SEKARANG

### 1. Restart Dev Server
```bash
# Stop server (Ctrl+C)
cd evonft-app
npm run dev
```

### 2. Buka Halaman Staking
```
http://localhost:3020/staking
```

### 3. Buka Console (F12)

### 4. Cari Log Ini

#### ✅ Jika Bekerja dengan Benar:
```
🔍 Extended Contracts Config:
  STAKING_CONTRACT: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838

🔧 Initializing Staking Contract: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
✅ Staking read contract initialized

🔍 usePoolStats - contract: Available
🔄 Loading pool stats...
✅ Total staked: 3
✅ User stakes: 2
✅ Contract balance: 0.05 MATIC

📊 Pool Stats (Real Data): {totalStaked: 3, userStakedCount: 2, contractBalance: "0.05"}
```

#### ❌ Jika Ada Masalah:
```
🔍 Extended Contracts Config:
  STAKING_CONTRACT:    ← KOSONG!

// Atau
⚠️ STAKING_CONTRACT not set

// Atau
⚠️ usePoolStats: No contract available
```

## Jika STAKING_CONTRACT Kosong

### Cek .env:
```bash
cat evonft-app/.env | grep STAKING
```

### Harus ada:
```
VITE_STAKING_CONTRACT=0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
```

### Jika tidak ada atau salah:
1. Edit `evonft-app/.env`
2. Tambahkan/perbaiki line di atas
3. Restart server: `npm run dev`

## Test Contract Langsung

### Jalankan test script:
```bash
node test-staking-contract.js
```

### Expected output:
```
✅ Provider connected
✅ Contract instance created
✅ Total Staked: 3
✅ User Stakes: [0, 1, 2]
✅ Contract Balance: 0.05 MATIC
```

## Quick Verification

### Di Browser Console:
```javascript
// Cek env variable
console.log(import.meta.env.VITE_STAKING_CONTRACT)

// Harus output: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
```

## Apa yang Harus Anda Lakukan SEKARANG

1. **Restart dev server** (penting!)
2. **Buka http://localhost:3020/staking**
3. **Buka console (F12)**
4. **Screenshot console logs**
5. **Kirim screenshot ke saya**

Dengan log yang baru, saya bisa tahu persis di mana masalahnya!

---

**Files Modified:**
- ✅ `evonft-app/src/config/contractsExtended.js` - Added debug logs
- ✅ `evonft-app/src/hooks/useExtendedContract.js` - Added debug logs
- ✅ `evonft-app/src/pages/StakingIntegrated.jsx` - Added null safety & debug logs

**New Files:**
- ✅ `test-staking-contract.js` - Test script
- ✅ `STAKING_TROUBLESHOOT.md` - Detailed troubleshooting guide
