# Quick Test - Staking Real Data

## Test Steps

### 1. Buka Halaman Staking
```
http://localhost:3020/staking
```

### 2. Buka Browser Console (F12)

### 3. Cari Log Berikut

#### ✅ Contract Initialization
```
🔧 Initializing Staking Contract: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
✅ Staking read contract initialized
✅ Staking write contract initialized
```

#### ✅ Loading User Stakes
```
🔍 Loading user stakes for: 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
✅ User stakes loaded: [0, 1, 2]  // atau [] jika belum stake
```

#### ✅ Loading Pool Stats
```
🔄 Loading pool stats...
✅ Total staked: 3
✅ User stakes: 2
✅ Contract balance: 0.05 MATIC
```

#### ✅ Pool Stats Object
```
📊 Pool Stats (Real Data): {
  totalStaked: 3,
  userStakedCount: 2,
  contractBalance: "0.05"
}
```

### 4. Verifikasi UI

#### Pool Statistics Cards (4 cards di atas)
- [ ] **Your Staked**: Menampilkan angka (bukan "0" jika sudah stake)
- [ ] **Total Staked NFTs**: Menampilkan angka (bukan "2,156" hardcoded)
- [ ] **Daily Base Rate**: Menampilkan "50 XP"
- [ ] **Reward Pool**: Menampilkan "X.XX MATIC" (bukan "125%" hardcoded)

#### Staked NFT Cards (jika ada)
- [ ] Menampilkan Token ID
- [ ] Menampilkan Tier (Bronze/Silver/Gold/Diamond)
- [ ] Menampilkan "X days staked"
- [ ] Menampilkan "X XP" pending
- [ ] Menampilkan "X.XXXX MATIC" pending

### 5. Test Interaksi

#### Test Stake
1. Klik "Stake NFTs"
2. Pilih NFT
3. Klik "Stake NFT"
4. Approve di MetaMask
5. Tunggu konfirmasi
6. Halaman reload
7. "Your Staked" harus bertambah ✅

#### Test Rewards
1. Tunggu beberapa menit
2. Refresh halaman
3. Pending rewards harus bertambah ✅

#### Test Claim
1. Klik "View All Rewards"
2. Lihat total pending XP dan MATIC
3. Klik "Claim" pada salah satu NFT
4. Approve di MetaMask
5. Tunggu konfirmasi
6. Pending rewards harus reset ✅

## Expected Results

### ✅ PASS - Data Real
- Pool stats menampilkan angka dari blockchain
- User staked count sesuai dengan NFT yang di-stake
- Pending rewards bertambah seiring waktu
- Console menampilkan log yang benar

### ❌ FAIL - Data Mock
- Pool stats menampilkan "2,156" atau "125%"
- Angka tidak berubah saat stake/unstake
- Console menampilkan error atau warning
- Pending rewards tidak bertambah

## Troubleshooting

### Jika Pool Stats = 0 semua
```bash
# Cek contract address
cat evonft-app/.env | grep STAKING

# Verifikasi di explorer
# https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
```

### Jika Console Error
```javascript
// Cek apakah contract sudah di-set
console.log(import.meta.env.VITE_STAKING_CONTRACT)

// Cek network
// Harus: Polygon Amoy (Chain ID: 80002)
```

### Jika Pending Rewards = 0
- Tunggu minimal 1 jam setelah stake
- Atau stake sudah lama tapi baru di-claim
- Cek lastClaimAt di contract

## Quick Verification Commands

### Browser Console
```javascript
// Cek pool stats
console.log('Pool Stats:', poolStats)

// Cek user stakes
console.log('User Stakes:', userStakes)

// Cek contract address
console.log('Staking Contract:', import.meta.env.VITE_STAKING_CONTRACT)
```

### Hardhat Console
```bash
cd evonft-contracts
npx hardhat console --network amoy

const staking = await ethers.getContractAt(
  "StakingPool",
  "0xB7d914D84d6b5f21ef53B4B56DCB56508115C838"
)

await staking.totalStaked()
await staking.getUserStakes("YOUR_ADDRESS")
```

## Success Criteria

✅ All 4 pool statistics show real numbers
✅ Console logs show successful data loading
✅ Staked NFT cards show real tier and rewards
✅ Rewards increase over time
✅ Stake/unstake/claim operations work correctly

Jika semua ✅, maka staking page sudah menampilkan **DATA REAL** dari smart contract!
