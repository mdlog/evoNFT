<div align="center">
  <img src="evoNFT-logo11.png" alt="EvoNFT Logo" width="200"/>
  
  # 🎮 EvoNFT - Evolving Digital Companions
  
 
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Network](https://img.shields.io/badge/Network-Polygon%20Amoy-8247E5)](https://amoy.polygonscan.com)
</div>

---

## ✨ Features

- 🎨 **Mint NFTs** - Create unique evolving NFTs with IPFS metadata
- 📈 **Level Up** - Feed & train to increase stats and XP
- 🧬 **Evolution System** - NFTs transform appearance with 24h cooldown & AI signatures
- 🧬 **Breeding** - Combine 2 NFTs to create offspring with inherited traits
- 💎 **Staking** - Stake NFTs to earn 0.01-0.02 MATIC/day with tier bonuses (MATIC only, no XP)
- 🛒 **Marketplace** - Buy and sell NFTs peer-to-peer with 2.5% platform fee
- 🌈 **Multi-Wallet** - RainbowKit integration (MetaMask, WalletConnect, Coinbase, etc.)

## 🎯 NFT System

### Level Progression
Your EvoNFT grows stronger as you interact with it:

| Level | XP Required | Unlock |
|-------|-------------|--------|
| 1 | 0 XP | Starting level |
| 2 | 100 XP | Basic training unlocked |
| 3 | 250 XP | Breeding available |
| 4 | 500 XP | Advanced stats boost |
| 5 | 1000 XP | Elite status |
| 6+ | +500 XP per level | Master tier |

**Gain XP by:**
- 🍖 **Feeding** - +10 XP, increases Health
- 💪 **Training** - +20 XP, increases Strength
- 🧬 **Breeding** - +50 XP (both parents)

**Note:** Staking earns MATIC rewards, not XP. To gain XP, use Feed/Train/Breed actions.

### Rarity Tiers
NFTs are categorized by their base stats and potential:

| Rarity | Base Stats Range | Breeding Bonus | Market Value |
|--------|------------------|----------------|--------------|
| ⚪ **Common** | 10-20 | Standard | 💰 |
| 🟢 **Uncommon** | 21-35 | +5% stats | 💰💰 |
| 🔵 **Rare** | 36-50 | +10% stats | 💰💰💰 |
| 🟣 **Epic** | 51-70 | +15% stats | 💰💰💰💰 |
| 🟠 **Legendary** | 71-90 | +25% stats | 💰💰💰💰💰 |
| 🔴 **Mythic** | 91-100 | +50% stats | 💰💰💰💰💰💰 |

**Rarity affects:**
- Initial stat distribution (Health, Strength, Intelligence)
- Breeding offspring quality
- Staking reward multiplier
- Marketplace demand

### Stats Explained
Each NFT has 3 core attributes:

- ❤️ **Health** - Determines survival in future PvP, increased by feeding
- ⚔️ **Strength** - Combat power, increased by training
- 🧠 **Intelligence** - Breeding success rate, naturally grows with level

**Stat Growth:**
- Feed: +5 Health, +10 XP (Cost: 0.001 MATIC)
- Train: +5 Strength, +20 XP (Cost: 0.002 MATIC)
- Breed: +50 XP for both parents (Cost: 0.01 MATIC, 24h cooldown)
- Stake: Earn MATIC rewards (no XP)
- Level Up: +2 to all stats automatically

## 🧬 Evolution System

### How Evolution Works

Evolution is different from leveling up - it **transforms your NFT's appearance** and increases its version number.

**Evolution Process:**
1. **Cooldown Period** - 24 hours between evolutions
2. **AI Analysis** - AI engine monitors your NFT activity
3. **Metadata Generation** - New image and attributes created
4. **Signature Required** - AI signs evolution request (EIP-712)
5. **User Confirmation** - Click "Evolve Now" button
6. **Transformation** - NFT appearance changes, version increases

**Evolution Status:**
- ✅ **Ready** - Cooldown complete, can evolve now
- ⏳ **Cooldown** - Must wait (shows countdown timer)
- **Version** - Tracks evolution stage (1 → 2 → 3 → ...)

**Key Features:**
- 🔒 24-hour cooldown between evolutions
- 🤖 AI-driven metadata generation
- 🎨 Appearance changes with each evolution
- 📈 Version tracking (Baby → Teen → Adult → Elder)
- 🔐 Secure with EIP-712 signatures

## 💎 Staking System

### Earn Passive Rewards

Stake your NFTs to earn XP and MATIC rewards automatically!

**Base Rewards:**
- 50 XP per day
- 0.01 MATIC per day

**Tier Bonuses (Based on Staking Duration):**

| Tier | Days Staked | Bonus | Daily Rewards |
|------|-------------|-------|---------------|
| 🥉 Bronze | 1-7 days | 0% | 50 XP + 0.01 MATIC |
| 🥈 Silver | 8-30 days | +20% | 60 XP + 0.012 MATIC |
| 🥇 Gold | 31-90 days | +50% | 75 XP + 0.015 MATIC |
| 💎 Diamond | 90+ days | +100% | 100 XP + 0.02 MATIC |

**How to Stake:**
1. Go to Staking page
2. Click "Stake NFTs"
3. Select NFT from your collection
4. Approve NFT (transaction 1)
5. Stake NFT (transaction 2)
6. Start earning rewards immediately!

**Claiming Rewards:**
- Claim anytime without unstaking
- Rewards accumulate based on time staked
- Unstaking automatically claims all pending rewards

**Important Notes:**
- NFT is locked in staking contract while staked
- Cannot trade, breed, or level up staked NFTs
- Tier bonus based on total staking duration
- MATIC rewards require contract funding by platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Wallet (MetaMask recommended)
- Polygon Amoy testnet MATIC ([Get from faucet](https://faucet.polygon.technology))
# Setup environment
cp .env.example .env
# Edit .env and add your VITE_WALLETCONNECT_PROJECT_ID

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Get WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create new project
3. Copy Project ID
4. Add to `.env` file

## 📋 Environment Variables

```env
# Contract Addresses (Already Deployed)
VITE_NFT_CONTRACT=0xe31d18Fb9925f677451845997f64806a88264b3D
VITE_STAKING_CONTRACT=0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
VITE_BREEDING_CONTRACT=0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250
VITE_MARKETPLACE_CONTRACT=0x4fe6d4C271300BB796f8F00751aA46f93667D677

# WalletConnect (Required)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 🎮 How to Use

1. **Connect Wallet** - Click "Connect Wallet" and choose your wallet
2. **Get Test MATIC** - Visit [Polygon Faucet](https://faucet.polygon.technology)
3. **Mint NFT** - Go to Mint page and create your first NFT (0.01 MATIC)
4. **Level Up** - Feed (0.001 MATIC) or train (0.002 MATIC) to increase stats
5. **Stake NFT** - Earn passive rewards: 50-100 XP/day + 0.01-0.02 MATIC/day
6. **Breed NFTs** - Combine 2 NFTs to create offspring (0.01 MATIC, 24h cooldown)
7. **Evolution** - Wait 24h cooldown, then evolve to change appearance (AI-driven)
8. **Trade** - List your NFT for sale or buy from marketplace

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Web3**: RainbowKit, Wagmi, ethers.js v6
- **Blockchain**: Polygon Amoy Testnet
- **Storage**: IPFS (Pinata)
- **Smart Contracts**: ERC-721, Staking, Breeding, Marketplace

## 📁 Project Structure

```
evonft-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React Context (Web3)
│   ├── config/         # Contract addresses & ABIs
│   └── services/       # IPFS & contract services
├── public/             # Static assets
└── .env               # Environment variables
```

## 🔗 Smart Contracts

All contracts are deployed on **Polygon Amoy Testnet**:

| Contract | Address | Features | Explorer |
|----------|---------|----------|----------|
| **NFT** | `0xe31d18Fb9925f677451845997f64806a88264b3D` | Mint, Feed, Train, Evolution | [View](https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D) |
| **Staking** | `0xB7d914D84d6b5f21ef53B4B56DCB56508115C838` | Stake, Claim, Tier Bonuses | [View](https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838) |
| **Breeding** | `0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250` | Breed, Cooldown, Trait Inheritance | [View](https://amoy.polygonscan.com/address/0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250) |
| **Marketplace** | `0x4fe6d4C271300BB796f8F00751aA46f93667D677` | List, Buy, Cancel, 2.5% Fee | [View](https://amoy.polygonscan.com/address/0x4fe6d4C271300BB796f8F00751aA46f93667D677) |

### Contract Features

**NFT Contract (EvolvableNFT.sol):**
- ✅ ERC-721 standard
- ✅ Dynamic stats (Health, Strength, Intelligence)
- ✅ XP and level system
- ✅ Evolution with version tracking
- ✅ 24-hour evolution cooldown
- ✅ EIP-712 signature verification
- ✅ IPFS metadata storage

**Staking Contract (StakingPool.sol):**
- ✅ Stake/Unstake NFTs
- ✅ Real-time reward calculation
- ✅ 4-tier bonus system (Bronze → Diamond)
- ✅ XP + MATIC dual rewards
- ✅ Batch operations support
- ✅ Emergency withdraw (owner)

**Breeding Contract (NFTBreeding.sol):**
- ✅ Combine 2 parent NFTs
- ✅ Trait inheritance system
- ✅ 24-hour cooldown per NFT
- ✅ Breeding cost: 0.01 MATIC
- ✅ Parent XP bonus: +50 XP each
- ✅ Minter role integration

**Marketplace Contract (NFTMarketplace.sol):**
- ✅ List NFTs for sale
- ✅ Buy with instant transfer
- ✅ Cancel listings anytime
- ✅ 2.5% platform fee
- ✅ Secure approval flow
- ✅ Volume tracking

## 🐛 Troubleshooting

**Wallet won't connect?**
- Ensure MetaMask is installed
- Switch to Polygon Amoy network
- Clear browser cache

**Transaction failed?**
- Check MATIC balance (need for gas fees)
- Ensure you're on Polygon Amoy network
- Try increasing gas limit

**NFT not showing?**
- Wait for blockchain confirmation (~10-30 seconds)
- Refresh the page
- Check transaction on [PolygonScan](https://amoy.polygonscan.com)

**Staking issues?**
- Ensure NFT is not already staked
- Check if you approved the NFT first
- Verify staking contract has MATIC for rewards
- Cannot stake NFTs listed on marketplace

**Evolution not working?**
- Check if 24-hour cooldown has passed
- Evolution requires AI backend signature
- "Evolve Now" button only shows when ready
- Only owner can evolve their NFTs

**Breeding failed?**
- Both parents must be owned by you
- Check 24-hour cooldown per NFT
- Ensure you have 0.01 MATIC for breeding cost
- Parents must not be staked or listed for sale

## 🎯 Advanced Features

### Real-Time Data
- ✅ All stats fetched from blockchain
- ✅ Auto-refresh every 30 seconds
- ✅ Live countdown timers
- ✅ Real-time reward calculation
- ✅ Instant transaction feedback

### Security
- ✅ EIP-712 signature verification (Evolution)
- ✅ ReentrancyGuard on all contracts
- ✅ Proper access control (Ownable)
- ✅ Secure approval flows
- ✅ Verified contracts on PolygonScan

### User Experience
- ✅ Smooth animations (Framer Motion)
- ✅ Loading states and skeletons
- ✅ Error handling with clear messages
- ✅ Mobile-responsive design
- ✅ Multi-wallet support (RainbowKit)

### Performance
- ✅ Optimized RPC calls
- ✅ Efficient state management
- ✅ IPFS gateway fallbacks
- ✅ Cached blockchain data
- ✅ Fast page loads (<3s)

## 📊 Platform Economics

### Revenue Sources
- Mint Fee: 0.01 MATIC per NFT
- Marketplace Fee: 2.5% of sales
- Breeding Fee: 0.01 MATIC per breed
- Feed/Train: 0.001-0.002 MATIC

### Reward Distribution
- Staking rewards funded by platform revenue
- XP calculated automatically (no cost)
- MATIC rewards from contract balance
- Sustainable tokenomics model

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with:
- [Polygon](https://polygon.technology) - Layer 2 scaling solution
- [RainbowKit](https://www.rainbowkit.com) - Wallet connection UI
- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [IPFS](https://ipfs.tech) - Decentralized storage

## 📖 Quick Reference

### Action Costs

| Action | Cost | Cooldown | Rewards |
|--------|------|----------|---------|
| Mint NFT | 0.01 MATIC | None | New NFT |
| Feed | 0.001 MATIC | None | +5 Health, +10 XP |
| Train | 0.002 MATIC | None | +5 Strength, +20 XP |
| Breed | 0.01 MATIC | 24 hours | New NFT, +50 XP (parents) |
| Stake | Free | None | 50-100 XP/day + MATIC |
| Evolve | Free | 24 hours | New appearance, version++ |
| List for Sale | Free | None | - |
| Buy NFT | Price + 2.5% | None | NFT ownership |

### XP Requirements

| Level | XP Needed | Total XP | Unlock |
|-------|-----------|----------|--------|
| 1 → 2 | 100 XP | 100 | Basic training |
| 2 → 3 | 150 XP | 250 | Breeding available |
| 3 → 4 | 250 XP | 500 | Advanced stats |
| 4 → 5 | 500 XP | 1000 | Elite status |
| 5 → 6 | 500 XP | 1500 | Master tier |

### Staking Tiers

| Tier | Duration | Bonus | XP/Day | MATIC/Day |
|------|----------|-------|--------|-----------|
| 🥉 Bronze | 1-7 days | 0% | 50 | 0.01 |
| 🥈 Silver | 8-30 days | +20% | 60 | 0.012 |
| 🥇 Gold | 31-90 days | +50% | 75 | 0.015 |
| 💎 Diamond | 90+ days | +100% | 100 | 0.02 |

### Rarity Distribution

| Rarity | Base Stats | Breeding Bonus | Market Value |
|--------|------------|----------------|--------------|
| ⚪ Common | 10-20 | Standard | 💰 |
| 🟢 Uncommon | 21-35 | +5% | 💰💰 |
| 🔵 Rare | 36-50 | +10% | 💰💰💰 |
| 🟣 Epic | 51-70 | +15% | 💰💰💰💰 |
| 🟠 Legendary | 71-90 | +25% | 💰💰💰💰💰 |
| 🔴 Mythic | 91-100 | +50% | 💰💰💰💰💰💰 |

---

<div align="center">
  
  **Status**: ✅ Production Ready | **Network**: Polygon Amoy Testnet
  
  **Live dApp**: https://evonft.xyz
  
  Made with ❤️ for the Web3 community
  
</div>
