# Debug XP Issue - Step by Step

## Problem
XP tetap 0 setelah feed, padahal transaksi berhasil.

## Debug Steps

### 1. Cek Transaksi di Blockchain Explorer
Buka: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D

Cari transaksi feed terakhir dan cek:
- ✅ Status: Success
- ✅ Method: feed
- ✅ Value: 0.1 MATIC (untuk basic food)

### 2. Cek Event Logs
Di detail transaksi, cek tab "Logs":
- Harus ada event `Fed(tokenId, foodType, xpGained, totalXP)`
- Cek nilai `totalXP` - ini adalah XP setelah feed

### 3. Cek XP di Contract Langsung
```bash
cd evonft-contracts
npx hardhat console --network amoy
```

```javascript
// Load contract
const nft = await ethers.getContractAt(
    "EvolvableNFTExtended", 
    "0xe31d18Fb9925f677451845997f64806a88264b3D"
);

// Cek XP untuk token ID 0 (ganti dengan token ID Anda)
const xp = await nft.tokenXP(0);
console.log("XP from contract:", xp.toString());

// Cek progress
const progress = await nft.getTokenProgress(0);
console.log("Current XP:", progress[0].toString());
console.log("Current Level:", progress[1].toString());
console.log("XP for next level:", progress[2].toString());
```

### 4. Cek Console Log di Browser
Buka console (F12) dan cari log:
```
✅ XP from contract: 50  ← Harus ada angka, bukan 0
```

Jika masih 0, berarti ada masalah di contract atau transaksi.

### 5. Hard Refresh Browser
- Ctrl + Shift + R (Windows/Linux)
- Cmd + Shift + R (Mac)
- Clear cache dan reload

### 6. Cek Network
Pastikan MetaMask connect ke Polygon Amoy (Chain ID: 80002)
