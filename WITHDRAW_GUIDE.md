# Panduan Withdraw Biaya Feed & Train 💰

## Quick Start

### 1. Cek Balance Contract
```bash
cd evonft-contracts
npx hardhat run scripts/check-balance.js --network amoy
```

**Output:**
```
💰 Checking NFT Contract Balance

📍 Contract Address: 0xe31d18Fb9925f677451845997f64806a88264b3D
👑 Contract Owner: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4

💰 Contract Balance: 5.5 MATIC
💵 Estimated Value: ~$2.75 (at $0.50/MATIC)

📊 Fee Structure:
   🍖 Basic Food: 0.1 MATIC
   🥩 Premium Food: 0.5 MATIC
   🍗 Legendary Food: 1.0 MATIC
   💪 Train: 0.3 MATIC

📈 Activity Estimate:
   This balance represents approximately:
   - 55 Basic Feeds
   - 11 Premium Feeds
   - 5 Legendary Feeds
   - 18 Training Sessions
```

### 2. Withdraw Balance
```bash
npx hardhat run scripts/withdraw-fees.js --network amoy
```

**Output:**
```
🏦 Withdrawing Fees from NFT Contract

📍 Contract Address: 0xe31d18Fb9925f677451845997f64806a88264b3D
👤 Signer Address: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
👑 Contract Owner: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
✅ You are the owner!

💰 Contract Balance: 5.5 MATIC
💳 Your Balance Before: 10.2 MATIC

🔄 Withdrawing 5.5 MATIC...
📝 Transaction Hash: 0x...
⏳ Waiting for confirmation...
✅ Transaction confirmed in block: 12345678

💰 Withdrawal Summary:
   Amount Withdrawn: 5.5 MATIC
   Gas Used: 0.001 MATIC
   Net Gain: 5.499 MATIC
   Your Balance After: 15.699 MATIC

✅ Withdrawal successful!
```

---

## Cara Lain Withdraw

### Option 1: Via Hardhat Console
```bash
cd evonft-contracts
npx hardhat console --network amoy
```

```javascript
// Load contract
const NFT = await ethers.getContractFactory("EvolvableNFTExtended");
const nft = await NFT.attach("0xe31d18Fb9925f677451845997f64806a88264b3D");

// Check balance
const balance = await ethers.provider.getBalance(nft.target);
console.log("Balance:", ethers.formatEther(balance), "MATIC");

// Withdraw
const tx = await nft.withdraw();
await tx.wait();
console.log("✅ Withdrawn!");
```

### Option 2: Via Blockchain Explorer
1. Buka: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
2. Klik tab "Contract"
3. Klik "Write Contract"
4. Connect wallet (harus owner)
5. Scroll ke fungsi "withdraw"
6. Klik "Write"
7. Confirm di MetaMask

### Option 3: Via Frontend (Coming Soon)
Bisa dibuat admin panel untuk withdraw langsung dari UI.

---

## Keamanan

### ✅ Checks
- Hanya owner yang bisa withdraw
- Contract harus punya balance
- Automatic gas estimation

### ⚠️ Important
- **Simpan private key dengan aman**
- **Jangan share private key**
- **Gunakan hardware wallet untuk production**

### Verify Owner
```bash
npx hardhat console --network amoy

const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D");
const owner = await nft.owner();
console.log("Owner:", owner);
```

---

## Monitoring

### Cek Balance Secara Berkala
```bash
# Setiap hari
npx hardhat run scripts/check-balance.js --network amoy

# Atau setup cron job
0 9 * * * cd /path/to/evonft-contracts && npx hardhat run scripts/check-balance.js --network amoy
```

### Track di Explorer
Bookmark link ini:
```
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
```

### Setup Alerts (Optional)
Bisa setup alert di Polygonscan untuk notifikasi saat balance > threshold.

---

## Best Practices

### 1. Withdraw Secara Berkala
- Jangan biarkan balance terlalu besar di contract
- Withdraw setiap minggu atau bulan
- Simpan di wallet yang lebih aman

### 2. Track Revenue
```bash
# Create log file
npx hardhat run scripts/check-balance.js --network amoy >> balance-log.txt
```

### 3. Backup Private Key
- Simpan di tempat aman
- Gunakan hardware wallet
- Jangan simpan di cloud

### 4. Test di Testnet Dulu
```bash
# Test di Amoy testnet
npx hardhat run scripts/withdraw-fees.js --network amoy

# Baru ke mainnet
npx hardhat run scripts/withdraw-fees.js --network polygon
```

---

## Troubleshooting

### Error: "You are not the contract owner"
**Solusi:**
- Pastikan wallet yang digunakan adalah owner
- Cek dengan: `await nft.owner()`

### Error: "No balance"
**Solusi:**
- Contract belum ada yang feed/train
- Cek balance dengan script check-balance.js

### Error: "Insufficient funds for gas"
**Solusi:**
- Pastikan wallet punya MATIC untuk gas
- Minimal 0.01 MATIC untuk gas

### Transaction Stuck
**Solusi:**
- Tunggu beberapa menit
- Cek di explorer
- Bisa speed up dengan higher gas

---

## Revenue Tracking

### Create Spreadsheet
Track revenue dengan format:

| Date | Balance | Withdrawn | Notes |
|------|---------|-----------|-------|
| 2024-01-01 | 5.5 MATIC | 5.5 MATIC | Weekly withdrawal |
| 2024-01-08 | 3.2 MATIC | 3.2 MATIC | Weekly withdrawal |

### Calculate Metrics
- Daily average revenue
- Monthly revenue
- Revenue per NFT
- Revenue per user

---

## Scripts Reference

### check-balance.js
```bash
npx hardhat run scripts/check-balance.js --network amoy
```
- Cek balance contract
- Tampilkan fee structure
- Estimate activity
- No transaction, read-only

### withdraw-fees.js
```bash
npx hardhat run scripts/withdraw-fees.js --network amoy
```
- Withdraw semua balance
- Hanya owner yang bisa run
- Memerlukan gas fee
- Otomatis transfer ke owner wallet

---

## FAQ

### Q: Berapa sering harus withdraw?
**A:** Tergantung volume. Rekomendasi:
- Low volume: Monthly
- Medium volume: Weekly
- High volume: Daily

### Q: Apakah aman menyimpan balance di contract?
**A:** Ya, tapi lebih baik withdraw secara berkala ke wallet yang lebih aman.

### Q: Bisakah user lain withdraw?
**A:** Tidak, hanya owner contract yang bisa withdraw.

### Q: Apakah ada fee untuk withdraw?
**A:** Hanya gas fee (biasanya < 0.01 MATIC).

### Q: Bagaimana jika lupa private key owner?
**A:** Balance akan stuck di contract selamanya. **Backup private key dengan baik!**

---

## Summary

✅ **Cek balance:** `npx hardhat run scripts/check-balance.js --network amoy`
✅ **Withdraw:** `npx hardhat run scripts/withdraw-fees.js --network amoy`
✅ **Hanya owner:** Yang bisa withdraw
✅ **Aman:** Dengan proper key management
✅ **Track:** Revenue secara berkala

**Contract Address:** 0xe31d18Fb9925f677451845997f64806a88264b3D
**Owner Address:** 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4

---

**Untuk detail lengkap, lihat:** `BIAYA_FEED_TRAIN.md`
