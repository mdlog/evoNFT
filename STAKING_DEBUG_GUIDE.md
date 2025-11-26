# Staking Page - Debug Guide

## Cara Memverifikasi Data Real

### 1. Buka Browser Console
Saat membuka halaman staking, Anda harus melihat log berikut:

```
🔧 Initializing Staking Contract: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
✅ Staking read contract initialized
✅ Staking write contract initialized
🔍 Loading user stakes for: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
✅ User stakes loaded: [0, 1, 2] // atau [] jika belum ada
🔄 Loading pool stats...
✅ Total staked: 5
✅ User stakes: 3
✅ Contract balance: 0.05 MATIC
📊 Pool Stats (Real Data): {totalStaked: 5, userStakedCount: 3, contractBalance: "0.05"}
```

### 2. Verifikasi Data di UI

#### Pool Statistics Cards
Periksa 4 kartu statistik di bagian atas:

1. **Your Staked** 
   - Harus menampilkan jumlah NFT yang Anda stake
   - Jika 0, berarti Anda belum stake NFT apapun
   - ✅ Real data dari `getUserStakes(account).length`

2. **Total Staked NFTs**
   - Harus menampilkan total NFT yang di-stake di pool
   - Jika 0, berarti belum ada yang stake
   - ✅ Real data dari `totalStaked()`

3. **Daily Base Rate**
   - Selalu menampilkan "50 XP"
   - ✅ Ini adalah konstanta dari smart contract

4. **Reward Pool**
   - Menampilkan balance MATIC di contract
   - Format: "X.XX MATIC"
   - ✅ Real data dari `getBalance(contractAddress)`

### 3. Verifikasi Staked NFT Cards

Jika Anda sudah stake NFT, setiap card harus menampilkan:
- Token ID (contoh: #0, #1, #2)
- Tier (Bronze/Silver/Gold/Diamond)
- Days staked (contoh: "5 days staked")
- Pending XP (contoh: "250 XP")
- Pending MATIC (contoh: "0.0500 MATIC")

Semua data ini real-time dari smart contract.

### 4. Test Rewards Calculation

1. Stake sebuah NFT
2. Tunggu beberapa menit
3. Refresh halaman
4. Pending rewards harus bertambah

**Formula:**
```
Base: 50 XP/day + 0.01 MATIC/day
Tier Bonus:
- Bronze (0-7 days): 0%
- Silver (8-30 days): +20%
- Gold (31-89 days): +50%
- Diamond (90+ days): +100%

Example (1 day, Bronze tier):
XP = 50 * 1 * (1 + 0%) = 50 XP
MATIC = 0.01 * 1 * (1 + 0%) = 0.01 MATIC
```

## Troubleshooting

### Problem: Pool stats menampilkan 0 semua

**Kemungkinan penyebab:**
1. Contract belum di-deploy atau address salah
2. Contract tidak memiliki fungsi yang diperlukan
3. Network tidak sesuai (harus Polygon Amoy)

**Solusi:**
```bash
# Cek contract address di .env
cat evonft-app/.env | grep STAKING

# Verifikasi contract di blockchain explorer
# Buka: https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
```

### Problem: "STAKING_CONTRACT not set" di console

**Solusi:**
```bash
# Pastikan .env file ada dan benar
cd evonft-app
cat .env

# Restart dev server
npm run dev
```

### Problem: User stakes tidak muncul padahal sudah stake

**Kemungkinan penyebab:**
1. Transaksi stake belum confirmed
2. Account yang digunakan berbeda
3. Contract getUserStakes() error

**Solusi:**
1. Cek transaksi di explorer
2. Pastikan wallet address sama
3. Lihat error di console

### Problem: Pending rewards tidak bertambah

**Kemungkinan penyebab:**
1. Belum cukup waktu berlalu (minimal beberapa menit)
2. Contract getPendingRewards() error
3. lastClaimAt belum di-update

**Solusi:**
1. Tunggu lebih lama (minimal 1 jam untuk melihat perubahan signifikan)
2. Cek console untuk error
3. Coba claim rewards untuk reset lastClaimAt

## Verifikasi Smart Contract

### Cek di Blockchain Explorer

1. Buka: https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838

2. Klik tab "Contract" → "Read Contract"

3. Test fungsi-fungsi berikut:
   - `totalStaked()` - Harus return angka
   - `getUserStakes(yourAddress)` - Harus return array token IDs
   - `getPendingRewards(tokenId)` - Harus return (xp, matic)
   - `getStakeTier(tokenId)` - Harus return (tier, bonus)

### Test dengan Hardhat Console

```bash
cd evonft-contracts
npx hardhat console --network amoy

# Load contract
const StakingPool = await ethers.getContractFactory("StakingPool");
const staking = await StakingPool.attach("0xB7d914D84d6b5f21ef53B4B56DCB56508115C838");

# Test functions
await staking.totalStaked();
await staking.getUserStakes("0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4");
```

## Expected Console Output

Saat halaman staking load dengan benar:

```
🔧 Initializing Staking Contract: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
✅ Staking read contract initialized
✅ Staking write contract initialized
🔍 Loading user stakes for: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
🔄 Loading pool stats...
✅ Total staked: 3
✅ User stakes: 2
✅ Contract balance: 0.1 MATIC
✅ User stakes loaded: [0, 1]
📊 Pool Stats (Real Data): {
  totalStaked: 3,
  userStakedCount: 2,
  contractBalance: "0.1"
}
```

## Data Mock vs Real

### ❌ Data Mock (Sebelum fix)
```javascript
{ value: '2,156', label: 'Total Stakers' }  // Hardcoded
{ value: '125%', label: 'Current APY' }     // Hardcoded
Expected: 50+ XP/day                         // Tidak spesifik
```

### ✅ Data Real (Setelah fix)
```javascript
{ value: poolStats.totalStaked, label: 'Total Staked NFTs' }
{ value: poolStats.contractBalance + ' MATIC', label: 'Reward Pool' }
Base Rate: 50 XP/day + 0.01 MATIC/day       // Dari contract constant
```

## Checklist Verifikasi

- [ ] Console menampilkan log initialization
- [ ] Pool stats menampilkan angka (bukan 0 semua)
- [ ] Your Staked sesuai dengan jumlah NFT yang di-stake
- [ ] Total Staked NFTs bertambah saat ada yang stake
- [ ] Reward Pool menampilkan balance MATIC
- [ ] Staked NFT cards menampilkan tier dan days
- [ ] Pending rewards bertambah seiring waktu
- [ ] Claim rewards berhasil dan balance berubah

Jika semua checklist ✅, maka data sudah real dari smart contract!
