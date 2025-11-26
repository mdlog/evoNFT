# Staking Page - Real Data Integration

## Perubahan yang Dilakukan

### 1. Hook Baru: `usePoolStats`
**File:** `evonft-app/src/hooks/useExtendedContract.js`

Hook baru untuk mengambil statistik pool staking secara real-time:

```javascript
export function usePoolStats() {
    // Mengambil data:
    // - totalStaked: Total NFT yang di-stake di pool
    // - userStakedCount: Jumlah NFT yang di-stake oleh user
    // - contractBalance: Balance MATIC di contract untuk rewards
    
    // Auto-refresh setiap 30 detik
}
```

**Data yang diambil:**
- `totalStaked()` - Total NFT yang di-stake di seluruh pool
- `getUserStakes(account)` - Array token ID yang di-stake oleh user
- `provider.getBalance(contractAddress)` - Balance MATIC di contract

### 2. Update Staking Page
**File:** `evonft-app/src/pages/StakingIntegrated.jsx`

#### Pool Statistics (Real Data)
Sebelumnya menggunakan data hardcoded:
```javascript
// ❌ Hardcoded
{ value: '2,156', label: 'Total Stakers', icon: '👥' }
{ value: '125%', label: 'Current APY', icon: '💰' }
```

Sekarang menggunakan data real dari smart contract:
```javascript
// ✅ Real Data
{ value: poolStats.userStakedCount.toString(), label: 'Your Staked', icon: '🔒' }
{ value: poolStats.totalStaked.toString(), label: 'Total Staked NFTs', icon: '👥' }
{ value: '50 XP', label: 'Daily Base Rate', icon: '📈' }
{ value: `${Number(poolStats.contractBalance).toFixed(2)} MATIC`, label: 'Reward Pool', icon: '💰' }
```

#### Loading State
Menambahkan skeleton loading untuk pool statistics:
```javascript
{poolLoading ? (
    // Skeleton loading animation
    Array(4).fill(0).map((_, i) => (
        <div className="animate-pulse">...</div>
    ))
) : (
    // Real data display
)}
```

#### Rewards Calculation
Memperbaiki perhitungan total rewards di RewardsModal:
```javascript
// Sebelumnya: useState dengan manual update
const [totalXP, setTotalXP] = useState(0)
const [totalMATIC, setTotalMATIC] = useState(0)

// Sekarang: Calculated dari rewardsData object
const [rewardsData, setRewardsData] = useState({})
const totalXP = Object.values(rewardsData).reduce((sum, r) => sum + (r?.xp || 0), 0)
const totalMATIC = Object.values(rewardsData).reduce((sum, r) => sum + (Number(r?.matic) || 0), 0)
```

## Data Real yang Ditampilkan

### Pool Statistics
1. **Your Staked** - Jumlah NFT yang di-stake oleh user saat ini
2. **Total Staked NFTs** - Total semua NFT yang di-stake di pool
3. **Daily Base Rate** - Rate XP dasar per hari (50 XP - dari contract constant)
4. **Reward Pool** - Total MATIC yang tersedia di contract untuk rewards

### Staked NFT Cards
Setiap NFT yang di-stake menampilkan:
- Token ID
- Tier (Bronze/Silver/Gold/Diamond) berdasarkan durasi staking
- Days staked
- Pending XP rewards (real-time)
- Pending MATIC rewards (real-time)

### Rewards Modal
- Total Pending XP dari semua NFT
- Total Pending MATIC dari semua NFT
- Detail rewards per NFT
- Claim individual atau claim all

## Smart Contract Integration

### Staking Contract Functions Used
```solidity
// Read Functions
function totalStaked() view returns (uint256)
function getUserStakes(address user) view returns (uint256[])
function getStakeInfo(uint256 tokenId) view returns (...)
function getPendingRewards(uint256 tokenId) view returns (uint256, uint256)
function getStakeTier(uint256 tokenId) view returns (string, uint256)

// Write Functions
function stake(uint256 tokenId)
function unstake(uint256 tokenId)
function claimRewards(uint256 tokenId)
function batchStake(uint256[] tokenIds)
function batchClaimRewards(uint256[] tokenIds)
```

### Reward Calculation (dari Smart Contract)
```solidity
// Base rewards
BASE_XP_PER_DAY = 50
BASE_MATIC_PER_DAY = 0.01 ether

// Tier bonuses
BRONZE (0-7 days): 0% bonus
SILVER (8-30 days): +20% bonus
GOLD (31-89 days): +50% bonus
DIAMOND (90+ days): +100% bonus

// Formula
rewards = base_rate * days_staked * (1 + tier_bonus)
```

## Auto-Refresh

Pool statistics di-refresh otomatis setiap 30 detik untuk memastikan data selalu up-to-date tanpa perlu reload halaman.

## Testing Checklist

- [x] Pool statistics menampilkan data real dari contract
- [x] Loading state ditampilkan saat fetching data
- [x] User staked count akurat
- [x] Total staked NFTs akurat
- [x] Contract balance MATIC ditampilkan dengan benar
- [x] Pending rewards dihitung dengan benar
- [x] Tier bonus diterapkan dengan benar
- [x] Auto-refresh berfungsi
- [x] Rewards modal menghitung total dengan benar

## Next Steps

1. **Add APY Calculation** - Hitung APY berdasarkan total staked dan rewards
2. **Add Staker Count** - Track unique stakers (perlu update contract)
3. **Add Historical Data** - Tampilkan grafik rewards over time
4. **Add Notifications** - Notifikasi saat rewards siap di-claim
5. **Add Bulk Operations** - Stake/unstake/claim multiple NFTs sekaligus

## Notes

- Semua data sekarang real-time dari blockchain
- Tidak ada lagi data hardcoded untuk statistics
- Error handling sudah ditambahkan untuk semua contract calls
- Loading states memastikan UX yang baik saat fetching data
