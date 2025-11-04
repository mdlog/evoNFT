# 📖 EvoNFT - Panduan Pengguna Lengkap

## 🎮 Apa itu EvoNFT?

**EvoNFT** adalah platform NFT revolusioner di mana NFT Anda **tidak statis** - mereka **tumbuh, belajar, dan berevolusi** berdasarkan interaksi Anda!

### 🌟 Konsep Utama

Bayangkan NFT Anda seperti **digital pet** atau **karakter game** yang:
- 📈 **Naik level** seiring waktu
- 🎨 **Berubah visual** saat berevolusi
- ⭐ **Unlock traits baru** berdasarkan aktivitas
- 💪 **Meningkat stats** dengan interaksi
- 🧬 **Bisa dibreeding** untuk create generasi baru

## 🎯 Cara Kerja Sistem

### 1️⃣ Mint NFT (Awal)

```
Anda → Mint NFT → Dapat NFT Level 1
                   ├─ Visual awal
                   ├─ Stats dasar
                   └─ Metadata di IPFS
```

**Yang Terjadi:**
- Smart contract create NFT baru
- Metadata disimpan di IPFS (permanent storage)
- NFT muncul di wallet Anda
- Dimulai dengan Level 1, rarity "Common"

### 2️⃣ Interaksi & Aktivitas

```
Aktivitas Anda → AI Engine Monitor → Hitung Score
                                      ↓
                                  Score ≥ 50?
                                      ↓
                                    YES!
                                      ↓
                              Trigger Evolution
```

**Aktivitas yang Dipantau:**

| Aktivitas | Poin | Max Poin |
|-----------|------|----------|
| 🔄 Transaksi on-chain | 2 per tx | 30 |
| 🔒 Staking (per hari) | 3 per hari | 30 |
| 💰 Trading volume | 1 per 100 MATIC | 20 |
| 💬 Discord activity | 1 per post | 10 |
| 🐦 Twitter mentions | 1 per mention | 10 |

**Total Score:** 0-100 poin

### 3️⃣ Evolution Process

```
Score ≥ 50 → AI Engine:
              ├─ Generate metadata baru
              ├─ Create/update image
              ├─ Upload ke IPFS
              ├─ Sign EIP-712 message
              └─ Call smart contract
                  ↓
            Smart Contract:
              ├─ Verify signature ✓
              ├─ Check cooldown ✓
              ├─ Update tokenURI
              ├─ Increment version
              └─ Emit Evolved event
                  ↓
            NFT Berevolusi! 🎉
              ├─ Level naik
              ├─ Visual berubah
              ├─ Stats meningkat
              └─ Unlock traits baru
```

### 4️⃣ Evolution Tiers

| Score | Tier | Visual | Stat Boost | Traits |
|-------|------|--------|------------|--------|
| 90-100 | 🌟 Legendary | Epic glow | +5 | 4-5 traits |
| 70-89 | 💜 Epic | Strong aura | +3 | 3-4 traits |
| 50-69 | 💙 Rare | Glowing | +2 | 2-3 traits |
| 0-49 | ⚪ Common | Basic | +1 | 1-2 traits |

## 🎮 Cara Main / Menggunakan

### 📱 Setup Awal

#### 1. Install MetaMask
```
1. Download MetaMask extension
2. Create wallet atau import existing
3. Backup seed phrase (PENTING!)
```

#### 2. Add Polygon Amoy Network
```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology
Chain ID: 80002
Currency: MATIC
Explorer: https://amoy.polygonscan.com
```

**Quick Add:** https://chainlist.org/chain/80002

#### 3. Get Testnet MATIC
```
1. Visit: https://faucet.polygon.technology/
2. Select "Polygon Amoy"
3. Paste your wallet address
4. Request 0.5 MATIC (gratis!)
```

### 🎨 Mint NFT Pertama

#### Step 1: Connect Wallet
```
1. Buka aplikasi EvoNFT
2. Click "Connect Wallet"
3. Pilih MetaMask
4. Approve connection
```

#### Step 2: Mint
```
1. Click "Mint Your First NFT"
2. Review mint price (0.01 MATIC)
3. Click "Confirm"
4. Approve di MetaMask
5. Wait ~2 seconds
6. NFT muncul di collection!
```

**Yang Anda Dapat:**
- ✅ NFT unik dengan ID
- ✅ Level 1, Common rarity
- ✅ Random starting traits
- ✅ Base stats (Strength, Intelligence, Speed, dll)

### 📊 Lihat NFT Detail

```
My Collection → Click NFT → Detail Page

Anda akan lihat:
├─ 3D/2D visual NFT
├─ Level & XP progress bar
├─ Stats (Strength, Intelligence, etc)
├─ Traits yang sudah unlock
├─ Evolution history
└─ Quick actions (Feed, Train, Stake)
```

### 🍖 Feed NFT (Gain XP)

```
1. Buka NFT Detail
2. Click "Feed" button
3. Pilih food type:
   ├─ Basic Food: +50 XP (0.1 MATIC)
   ├─ Premium Food: +200 XP (0.5 MATIC)
   └─ Legendary Food: +500 XP (1.0 MATIC)
4. Confirm transaction
5. XP bertambah!
```

**Tips:** Feed regularly untuk level up lebih cepat!

### 💪 Train NFT (Increase Stats)

```
1. Buka NFT Detail
2. Click "Train" button
3. Pilih training type:
   ├─ Strength Training: +1 STR
   ├─ Speed Training: +1 SPD
   └─ Intelligence Training: +1 INT
4. Pay 0.3 MATIC
5. Stat meningkat + gain XP!
```

### 🔒 Stake NFT (Passive Income)

```
1. Go to Staking page
2. Click "Stake New"
3. Select NFT(s) to stake
4. Confirm transaction
5. Earn passive rewards:
   ├─ 50 XP per day (base)
   ├─ 0.01 MATIC per day
   └─ Bonus based on tier
```

**Staking Tiers:**

| Tier | Days | XP/Day | Bonus |
|------|------|--------|-------|
| 🥉 Bronze | 1-7 | 50 | - |
| 🥈 Silver | 8-30 | 60 | +20% |
| 🥇 Gold | 31-90 | 75 | +50% |
| 💎 Diamond | 90+ | 100 | +100% |

**Note:** Staked NFT tidak bisa di-trade atau breed sampai unstake!

### 🧬 Breeding (Create New NFT)

```
1. Go to Breeding Lab
2. Select Parent 1 (your NFT)
3. Select Parent 2 (your NFT)
4. View offspring preview:
   ├─ Predicted traits
   ├─ Compatibility score
   └─ Success rate
5. Pay breeding fee (1.0 MATIC)
6. Wait 24 hours
7. New NFT hatches! 🥚→🐣
```

**Breeding Rules:**
- ✅ Each NFT can breed max 3 times
- ✅ Both parents must not be staked/listed
- ✅ Higher level parents = better offspring
- ✅ Offspring inherits traits from both

**Offspring Stats:**
- Generation: Parent gen + 1
- Starting Level: 1
- Traits: Mix dari kedua parents
- Rarity: Based on parents' rarity

### 📈 Evolution (Automatic)

Evolution terjadi **otomatis** ketika:

```
Kondisi:
├─ Evolution score ≥ 50 poin
├─ Cooldown sudah lewat (24 jam)
└─ AI Engine detect eligibility

Process:
1. AI Engine scan aktivitas Anda
2. Calculate evolution score
3. Generate new metadata
4. Create new visual
5. Upload to IPFS
6. Sign & submit to blockchain
7. NFT berevolusi! 🎉

Result:
├─ Level naik (+1)
├─ Visual berubah
├─ Stats meningkat
├─ Unlock traits baru
└─ Rarity bisa naik
```

**Notification:**
- 🔔 Push notification (jika enabled)
- 📧 Email alert (optional)
- 🎊 Confetti animation di app

### 💰 Trading NFT

#### List for Sale
```
1. Go to My Collection
2. Click NFT → "List for Sale"
3. Set price (in MATIC)
4. Set duration (7/14/30 days)
5. Confirm listing
6. NFT muncul di Marketplace
```

#### Buy NFT
```
1. Browse Marketplace
2. Filter by:
   ├─ Level
   ├─ Rarity
   ├─ Price
   └─ Traits
3. Click NFT → "Buy Now"
4. Confirm purchase
5. NFT masuk ke collection Anda!
```

## 🎯 Strategi & Tips

### 🏆 Maximize Evolution

**Fast Track (Aggressive):**
```
1. Feed NFT daily (Premium Food)
2. Train multiple stats
3. Stake for passive XP
4. Active trading (volume++)
5. Engage di Discord/Twitter
→ Evolution dalam 1-2 minggu
```

**Slow & Steady (Conservative):**
```
1. Stake NFT long-term
2. Feed occasionally
3. Let it grow naturally
→ Evolution dalam 1-2 bulan
```

### 💎 Breeding Strategy

**Quality Breeding:**
```
Parent 1: High level + Rare traits
Parent 2: High level + Different traits
→ Offspring: Best of both worlds
```

**Quantity Breeding:**
```
Breed multiple pairs
→ More chances for legendary offspring
```

### 💰 Trading Strategy

**Buy Low, Evolve, Sell High:**
```
1. Buy low-level NFT (cheap)
2. Evolve to higher tier
3. Sell at premium price
→ Profit!
```

**Long-term Hold:**
```
1. Mint/buy early
2. Evolve to max level
3. Rare traits + high stats
→ Valuable collectible
```

## 📊 Understanding Stats

### Base Stats (0-100)

| Stat | Affects | How to Increase |
|------|---------|-----------------|
| 💪 Strength | Combat power | Strength training |
| 🧠 Intelligence | Learning speed | Intelligence training |
| ⚡ Speed | Action speed | Speed training |
| 🛡️ Endurance | Durability | Feed + stake |
| 🍀 Luck | Rare drops | Random events |

### Traits

**Common Traits:**
- 🔥 Fire Breath
- 💧 Water Shield
- 🌍 Earth Armor
- 💨 Wind Speed

**Rare Traits:**
- ⚡ Lightning Strike
- 🌟 Star Power
- 🗡️ Sword Master
- 🛡️ Iron Skin

**Legendary Traits:**
- 💎 Diamond Body
- 🌌 Cosmic Energy
- 👑 Royal Aura
- 🔮 Magic Mastery

## 🎨 Visual Evolution

### Level 1-5 (Common)
```
Visual: Basic form
Colors: Muted
Effects: None
Glow: No glow
```

### Level 6-10 (Rare)
```
Visual: Enhanced form
Colors: Vibrant
Effects: Subtle particles
Glow: Soft glow
```

### Level 11-20 (Epic)
```
Visual: Advanced form
Colors: Rich & deep
Effects: Animated particles
Glow: Strong glow
```

### Level 21+ (Legendary)
```
Visual: Ultimate form
Colors: Radiant
Effects: Complex animations
Glow: Intense glow + aura
```

## 📱 Interface Guide

### Home Page
```
├─ Hero section (mint CTA)
├─ Stats overview
├─ How it works
├─ Recent activity feed
└─ Featured evolutions
```

### Marketplace
```
├─ Search bar
├─ Filters (level, rarity, price)
├─ NFT grid
├─ Sort options
└─ Pagination
```

### My Collection
```
├─ Portfolio stats
├─ Filter tabs (All, Staked, Listed)
├─ NFT grid/list view
├─ Quick actions
└─ Breeding lab CTA
```

### NFT Detail
```
├─ 3D/2D viewer
├─ Level & XP bar
├─ Stats display
├─ Traits list
├─ Evolution timeline
├─ Action buttons
└─ History tabs
```

### Staking Pool
```
├─ Pool statistics
├─ Your staking summary
├─ Staked NFTs list
├─ Tier information
└─ Claim rewards button
```

### Profile
```
├─ User info
├─ Portfolio stats
├─ Activity feed
├─ Achievements
└─ Settings
```

## 🔔 Notifications

### Evolution Complete
```
🎉 Your EvoNFT #123 has evolved!
   Level 5 → Level 6
   New trait unlocked: Fire Breath
   [View NFT]
```

### Breeding Complete
```
🥚 Your breeding is complete!
   Parents: #123 + #456
   Offspring: #789 (Epic!)
   [View New NFT]
```

### Staking Rewards
```
💰 Staking rewards available!
   150 XP + 0.05 MATIC
   [Claim Now]
```

## 🎮 Gamification

### Achievements

**Collector:**
- 🏆 First Mint
- 🎯 Own 10 NFTs
- ⭐ Own 50 NFTs
- 👑 Own 100 NFTs

**Evolver:**
- 📈 First Evolution
- 🔥 Reach Level 10
- 💎 Reach Level 50
- 🌟 Reach Max Level

**Breeder:**
- 🧬 First Breed
- 👨‍👩‍👧 Breed 10 times
- 🏭 Breed 50 times
- 🧪 Create Legendary offspring

**Trader:**
- 💰 First Sale
- 📊 Trade 10 NFTs
- 💎 Trade 100 NFTs
- 🏆 Top Trader

### Leaderboard

**Categories:**
- 🏆 Highest Level NFT
- 💎 Most Valuable Collection
- 🔥 Most Evolutions
- 🧬 Best Breeder
- 💰 Top Trader

## 🆘 Troubleshooting

### NFT tidak muncul
```
Solution:
1. Refresh page
2. Check wallet connection
3. Switch network ke Amoy
4. Clear cache
```

### Evolution tidak trigger
```
Possible reasons:
1. Score < 50 poin
2. Cooldown belum lewat (24h)
3. AI Engine sedang process
4. Network congestion

Solution: Wait atau increase activity
```

### Transaction failed
```
Common causes:
1. Insufficient MATIC
2. Gas price too low
3. Network congestion
4. Contract paused

Solution: Check balance, increase gas, retry
```

## 💡 Pro Tips

1. **Feed Strategically:** Feed sebelum cooldown habis untuk maximize XP
2. **Stake Long-term:** Diamond tier (90+ days) = 2x rewards
3. **Breed Smart:** High level + rare traits = valuable offspring
4. **Trade Timing:** Sell setelah evolution untuk max profit
5. **Engage Community:** Discord/Twitter activity = evolution points
6. **Diversify:** Own multiple NFTs untuk multiple evolution chances
7. **Track History:** Monitor evolution patterns untuk predict next
8. **Set Alerts:** Enable notifications untuk tidak miss evolution

## 📞 Support

**Need Help?**
- 📖 Docs: docs.evonft.io
- 💬 Discord: discord.gg/evonft
- 🐦 Twitter: @evonft
- 📧 Email: support@evonft.io

**Report Bugs:**
- GitHub Issues
- Discord #bug-reports
- Email dengan screenshot

---

## 🎊 Selamat Bermain!

Sekarang Anda siap untuk memulai journey dengan EvoNFT!

**Remember:**
- 🎨 Mint NFT unik
- 📈 Evolve dengan aktivitas
- 🧬 Breed untuk create generasi baru
- 💰 Trade untuk profit
- 🏆 Collect achievements

**Your NFT, Your Journey, Your Evolution!** 🚀✨
