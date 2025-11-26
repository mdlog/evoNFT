# 🔧 TROUBLESHOOT: Sold Out Issue

## 🐛 Masalah
Frontend menampilkan "Sold Out" dengan stats "0/0" dan "0 MATIC"

## ✅ SOLUSI LENGKAP

### Step 1: Verifikasi Contract di Blockchain

Buka browser dan akses:
```
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D#readContract
```

Klik tab "Read Contract" dan cek:
- `totalMinted()` → Seharusnya 0
- `maxSupply()` → Seharusnya 10000
- `mintPrice()` → Seharusnya 10000000000000000 (0.01 MATIC)

Jika nilai-nilai ini benar, berarti contract OK, masalahnya di frontend.

---

### Step 2: Test Contract Connection

Saya sudah membuat file test. Buka file ini di browser:
```
evonft-app/test-contract.html
```

Atau jalankan:
```bash
cd evonft-app
python3 -m http.server 8000
# Kemudian buka: http://localhost:8000/test-contract.html
```

Jika test berhasil, contract bisa diakses. Masalahnya di konfigurasi Vite.

---

### Step 3: Fix Environment Variables

**PENTING:** Vite memerlukan restart PENUH untuk membaca .env

```bash
# 1. Stop frontend (Ctrl+C)

# 2. Clear node cache
rm -rf node_modules/.vite

# 3. Restart
npm run dev
```

---

### Step 4: Verifikasi di Browser Console

Setelah restart, buka browser console (F12) dan cek:

```javascript
// Seharusnya muncul log seperti ini:
🔍 Contract Address: 0xe31d18Fb9925f677451845997f64806a88264b3D
🔍 VITE_NFT_CONTRACT: 0xe31d18Fb9925f677451845997f64806a88264b3D
📊 Loading contract stats...
✅ Stats loaded: { totalMinted: 0, maxSupply: 10000, mintPrice: '0.01' }
```

Jika tidak muncul log ini, environment variable tidak terbaca.

---

### Step 5: Hardcode Address (Temporary Fix)

Jika .env masih tidak terbaca, edit file:
`evonft-app/src/config/contracts.js`

Ganti baris ini:
```javascript
export const CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT || import.meta.env.VITE_CONTRACT_ADDRESS || '0xe31d18Fb9925f677451845997f64806a88264b3D';
```

Menjadi (hardcode):
```javascript
export const CONTRACT_ADDRESS = '0xe31d18Fb9925f677451845997f64806a88264b3D';
```

Save dan restart frontend.

---

### Step 6: Check Network

Pastikan MetaMask terhubung ke **Polygon Amoy Testnet**:
- Network: Polygon Amoy Testnet
- Chain ID: 80002
- RPC: https://rpc-amoy.polygon.technology

Jika salah network, contract tidak akan terbaca.

---

### Step 7: Clear Browser Cache

```bash
# Chrome/Edge
1. Buka DevTools (F12)
2. Klik kanan tombol refresh
3. Pilih "Empty Cache and Hard Reload"

# Atau manual
1. Settings → Privacy → Clear browsing data
2. Pilih "Cached images and files"
3. Clear data
```

---

## 🧪 QUICK TEST

Jalankan ini di browser console untuk test langsung:

```javascript
// Test 1: Check env
console.log('ENV:', import.meta.env.VITE_NFT_CONTRACT);

// Test 2: Check contract address
const { CONTRACT_ADDRESS } = await import('./src/config/contracts.js');
console.log('Address:', CONTRACT_ADDRESS);

// Test 3: Test contract call
const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(
    '0xe31d18Fb9925f677451845997f64806a88264b3D',
    ['function totalMinted() view returns (uint256)', 'function maxSupply() view returns (uint256)'],
    provider
);
const total = await contract.totalMinted();
const max = await contract.maxSupply();
console.log('Minted:', total.toString(), '/', max.toString());
```

---

## 🆘 JIKA MASIH BERMASALAH

### Option A: Gunakan contractsExtended.js

File `evonft-app/src/config/contractsExtended.js` sudah dikonfigurasi dengan benar.

Edit `evonft-app/src/hooks/useContract.js`:

Ganti import:
```javascript
// Dari:
import { CONTRACT_ADDRESS, CONTRACT_ABI, CURRENT_NETWORK } from '../config/contracts';

// Menjadi:
import { NFT_CONTRACT as CONTRACT_ADDRESS, NFT_ABI as CONTRACT_ABI, CURRENT_NETWORK } from '../config/contractsExtended';
```

### Option B: Manual Mint via Hardhat

Jika frontend tidak bisa, mint via Hardhat console:

```bash
cd evonft-contracts
npx hardhat console --network amoy
```

Di console:
```javascript
const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D")
const [signer] = await ethers.getSigners()

// Mint NFT
const uri = "ipfs://QmTest123"
const tx = await nft.mint(signer.address, uri, { value: ethers.parseEther("0.01") })
await tx.wait()
console.log("Minted!")
```

---

## 📊 EXPECTED RESULT

Setelah fix, halaman mint seharusnya menampilkan:
```
0/10000 Minted
0.01 MATIC Price
[Mint for 0.01 MATIC] ← Button aktif
```

---

## 🔍 DEBUG CHECKLIST

- [ ] Contract verified di PolygonScan
- [ ] test-contract.html berhasil
- [ ] Frontend di-restart dengan clear cache
- [ ] Browser console menampilkan contract address
- [ ] MetaMask di network Polygon Amoy
- [ ] Browser cache di-clear
- [ ] Stats menampilkan "0/10000" bukan "0/0"

---

**Jika semua langkah sudah dilakukan dan masih bermasalah, screenshot browser console dan kirim untuk analisis lebih lanjut.** 🔍
