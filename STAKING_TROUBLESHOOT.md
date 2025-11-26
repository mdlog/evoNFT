# Staking Page Troubleshooting

## Problem: Halaman Staking Masih Menampilkan Data Hardcode

### Step 1: Buka Halaman Staking
```
http://localhost:3020/staking
```

### Step 2: Buka Browser Console (F12)

### Step 3: Cari Log Berikut

#### ✅ Expected Logs (Jika Bekerja dengan Benar)

```javascript
// 1. Extended Contracts Config
🔍 Extended Contracts Config:
  NFT_CONTRACT: 0xe31d18Fb9925f677451845997f64806a88264b3D
  STAKING_CONTRACT: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
  BREEDING_CONTRACT: 0x39d6b4ba1CDe6A43Fa6A3a63Df38b299041A2986

// 2. Staking Contract Initialization
🔧 Initializing Staking Contract: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
✅ Staking read contract initialized
✅ Staking write contract initialized

// 3. Loading User Stakes
🔍 Loading user stakes for: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
✅ User stakes loaded: [0, 1, 2]  // atau []

// 4. Loading Pool Stats
🔍 usePoolStats - contract: Available
🔍 usePoolStats - account: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
🔄 Loading pool stats...
✅ Total staked: 3
✅ User stakes: 2
✅ Contract balance: 0.05 MATIC

// 5. Pool Stats State
📊 Pool Stats State: {poolStats: {…}, poolLoading: false}
📊 Pool Stats (Real Data): {totalStaked: 3, userStakedCount: 2, contractBalance: "0.05"}
```

#### ❌ Problem Logs (Jika Ada Masalah)

```javascript
// Missing STAKING_CONTRACT
🔍 Extended Contracts Config:
  STAKING_CONTRACT:   // ← KOSONG!

// Or
⚠️ STAKING_CONTRACT not set

// Or
⚠️ usePoolStats: No contract available

// Or
❌ Error loading pool stats: ...
```

### Step 4: Diagnose the Problem

#### Problem A: STAKING_CONTRACT Kosong

**Cek .env file:**
```bash
cat evonft-app/.env | grep STAKING
```

**Expected output:**
```
VITE_STAKING_CONTRACT=0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
```

**Jika kosong atau salah:**
1. Edit `evonft-app/.env`
2. Pastikan ada line: `VITE_STAKING_CONTRACT=0xB7d914D84d6b5f21ef53B4B56DCB56508115C838`
3. Restart dev server: `npm run dev`

#### Problem B: Contract Tidak Initialize

**Cek di console:**
```javascript
// Paste di browser console
console.log('STAKING_CONTRACT:', import.meta.env.VITE_STAKING_CONTRACT)
```

**Jika undefined:**
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)
- Hard reload (Ctrl+Shift+R)

#### Problem C: usePoolStats Tidak Berjalan

**Cek logs:**
- Jika tidak ada log `🔍 usePoolStats - contract: ...`
- Berarti hook tidak dipanggil atau ada error

**Solusi:**
1. Pastikan Anda di halaman `/staking`
2. Cek apakah ada error di console
3. Cek apakah Web3 sudah terkoneksi

#### Problem D: Contract Call Error

**Jika ada error:**
```
❌ Error loading pool stats: execution reverted
```

**Kemungkinan:**
1. Contract tidak di-deploy di network yang benar
2. Contract address salah
3. Network tidak sesuai (harus Polygon Amoy)

**Verifikasi contract:**
```bash
# Test contract dengan script
node test-staking-contract.js
```

### Step 5: Manual Verification

#### Test di Browser Console

```javascript
// 1. Import ethers (jika belum)
const { ethers } = window;

// 2. Get provider
const provider = new ethers.BrowserProvider(window.ethereum);

// 3. Create contract
const STAKING_ABI = [
    "function totalStaked() view returns (uint256)",
    "function getUserStakes(address) view returns (uint256[])"
];
const contract = new ethers.Contract(
    '0xB7d914D84d6b5f21ef53B4B56DCB56508115C838',
    STAKING_ABI,
    provider
);

// 4. Test functions
const total = await contract.totalStaked();
console.log('Total Staked:', Number(total));

const stakes = await contract.getUserStakes('YOUR_ADDRESS');
console.log('Your Stakes:', stakes.map(s => Number(s)));
```

### Step 6: Verify on Blockchain Explorer

1. Buka: https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838

2. Klik tab "Contract" → "Read Contract"

3. Test fungsi:
   - `totalStaked()` - Harus return angka
   - `getUserStakes(yourAddress)` - Harus return array

### Common Issues & Solutions

#### Issue 1: Pool Stats Menampilkan 0 Semua

**Penyebab:**
- Contract belum ada yang stake
- Contract address salah
- Network tidak sesuai

**Solusi:**
1. Stake minimal 1 NFT untuk test
2. Verifikasi contract address di .env
3. Pastikan network = Polygon Amoy (Chain ID: 80002)

#### Issue 2: "Your Staked" Tidak Update

**Penyebab:**
- Transaksi stake belum confirmed
- Account berbeda
- Cache browser

**Solusi:**
1. Tunggu konfirmasi transaksi
2. Refresh halaman (F5)
3. Clear cache dan hard reload

#### Issue 3: Pending Rewards Tidak Bertambah

**Penyebab:**
- Belum cukup waktu berlalu
- lastClaimAt belum update

**Solusi:**
1. Tunggu minimal 1 jam
2. Cek di blockchain explorer
3. Claim rewards untuk reset timer

### Debug Checklist

- [ ] .env file ada dan benar
- [ ] VITE_STAKING_CONTRACT di-set
- [ ] Dev server sudah restart
- [ ] Browser cache sudah clear
- [ ] Web3 sudah terkoneksi
- [ ] Network = Polygon Amoy
- [ ] Console menampilkan log initialization
- [ ] Console menampilkan log pool stats
- [ ] Tidak ada error di console

### Quick Fix Commands

```bash
# 1. Verify .env
cat evonft-app/.env | grep STAKING

# 2. Restart dev server
cd evonft-app
npm run dev

# 3. Test contract
node test-staking-contract.js

# 4. Clear node_modules (jika perlu)
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Expected UI After Fix

#### Pool Statistics Cards
- **Your Staked**: Angka real (bukan 0 jika sudah stake)
- **Total Staked NFTs**: Angka real dari blockchain
- **Daily Base Rate**: "50 XP" (constant)
- **Reward Pool**: "X.XX MATIC" (real balance)

#### Console Logs
```
✅ All initialization logs present
✅ Pool stats loaded successfully
✅ No errors in console
```

### Still Not Working?

1. **Check React DevTools**
   - Install React DevTools extension
   - Check component props and state
   - Verify `poolStats` value

2. **Check Network Tab**
   - Open Network tab in DevTools
   - Look for RPC calls
   - Check for failed requests

3. **Try Different Browser**
   - Test in Chrome/Firefox
   - Disable extensions
   - Use incognito mode

4. **Contact Support**
   - Provide console logs
   - Provide network tab screenshot
   - Provide contract address

---

**Last Updated:** After adding debug logs and error handling
