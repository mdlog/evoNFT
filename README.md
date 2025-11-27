<div align="center">
  <img src="evoNFT-logo11.png" alt="EvoNFT Logo" width="200"/>
  
  # 🎮 EvoNFT - Evolving Digital Companions
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Network](https://img.shields.io/badge/Network-Polygon%20Amoy-8247E5)](https://amoy.polygonscan.com)
  
  **Smart NFTs that grow, evolve, and earn rewards on Polygon**
</div>

---

## ✨ What is EvoNFT?

EvoNFT is a gamified NFT platform where your digital companions **evolve over time**. Train them, breed them, stake them for rewards, and trade them in the marketplace.

### Key Features

- 🎨 **Mint** unique NFTs with dynamic stats
- 💪 **Train** to increase stats (Strength, Intelligence, Speed, Endurance, Luck)
- 🍖 **Feed** to gain XP and level up
- 🧬 **Breed** two NFTs to create offspring
- 💎 **Stake** to earn passive MATIC rewards
- 🎭 **Evolve** appearance with AI-generated images
- 🛒 **Trade** in peer-to-peer marketplace

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/mdlog/evoNFT.git
cd evoNFT/evonft-app
npm install
cp .env.example .env
# Add your VITE_WALLETCONNECT_PROJECT_ID to .env
npm run dev
```

### 2. Get Test MATIC
Visit [Polygon Faucet](https://faucet.polygon.technology) for Amoy testnet MATIC

### 3. Connect & Play
- Open http://localhost:5173
- Connect your wallet (MetaMask, WalletConnect, Coinbase)
- Mint your first NFT for 0.01 MATIC

---

## 💰 Pricing

| Action | Cost | Reward |
|--------|------|--------|
| **Mint** | 0.01 MATIC | New NFT |
| **Feed** | 0.1-1.0 MATIC | +10-500 XP |
| **Train** | 0.3 MATIC | +1 stat, +100 XP |
| **Breed** | 0.01 MATIC | New NFT, +50 XP (parents) |
| **Stake** | Free | 0.01-0.02 MATIC/day |
| **Evolve** | Free | New appearance |
| **Trade** | 2.5% fee | MATIC |

---

## 📊 NFT Stats System

Each NFT has **5 trainable stats** (max 100 each):

- 💪 **Strength** - Physical power
- 🧠 **Intelligence** - Learning ability
- ⚡ **Speed** - Agility
- 🛡️ **Endurance** - Stamina
- 🍀 **Luck** - Fortune

**Level Up** by gaining XP:
- Level 1 → 2: 100 XP
- Level 2 → 3: 250 XP
- Level 3 → 4: 500 XP
- Level 4 → 5: 1000 XP
- Level 5+: +500 XP per level

---

## 🎯 How to Play

### Train Your NFT
1. Go to "My NFTs"
2. Click on your NFT
3. Click "Train" button
4. Select stat to increase
5. Pay 0.3 MATIC → Get +1 stat, +100 XP

### Feed Your NFT
1. Click "Feed" button
2. Choose food type:
   - Basic (0.1 MATIC) → +50 XP
   - Premium (0.5 MATIC) → +200 XP
   - Legendary (1.0 MATIC) → +500 XP

### Breed NFTs
1. Go to "Breeding Lab"
2. Select 2 parent NFTs
3. Pay 0.01 MATIC
4. Wait 24h cooldown
5. Get offspring with inherited traits

### Stake for Rewards
1. Go to "Staking"
2. Stake your NFT
3. Earn rewards based on duration:
   - 1-7 days: 0.01 MATIC/day
   - 8-30 days: 0.012 MATIC/day
   - 31-90 days: 0.015 MATIC/day
   - 90+ days: 0.02 MATIC/day

### Evolve Your NFT
1. Go to "My NFTs"
2. Click on your NFT
3. Click "Evolve" button (when available)
4. Wait for AI processing
5. Get new appearance & increased version

### Trade in Marketplace
1. List your NFT for sale (free)
2. Set your price
3. Buyers pay price + 2.5% fee
4. Instant transfer on purchase

---

## 🧬 Evolution System

EvoNFT features a **revolutionary AI-driven evolution system** that transforms your NFT's appearance based on real activity and interaction patterns.

### How Evolution Works

**AI-Powered Transformation**
- Evolution uses **machine learning algorithms** to generate new artwork
- Each evolution creates **unique, one-of-a-kind** visual variations
- NFT appearance changes while **preserving core identity**
- **Version number increases** with each successful evolution

**Activity Signal Calculation**
- System analyzes your NFT's **interaction history**
- Factors include: training frequency, feeding patterns, staking duration
- Higher activity scores = more dramatic evolution changes
- **Smart algorithm** prevents gaming the system

**Security & Verification**
- Uses **EIP-712 cryptographic signatures** for secure evolution requests
- **AI backend validation** ensures legitimate evolution triggers
- **24-hour cooldown** prevents spam and maintains rarity
- All evolutions are **permanently recorded** on-chain

### Evolution Requirements

| Requirement | Details |
|-------------|----------|
| **Cooldown** | 24 hours between evolutions |
| **Activity** | Minimum interaction threshold |
| **Ownership** | Must own the NFT |
| **Network** | Polygon Amoy Testnet |
| **Cost** | Free (only gas fees) |

### Technical Implementation

- **Smart Contract**: `requestEvolve()` function with signature verification
- **AI Backend**: Node.js service generating evolution signatures
- **IPFS Storage**: New metadata uploaded to decentralized storage
- **Frontend Integration**: Real-time evolution status and countdown timers

**Evolution creates truly dynamic NFTs that grow and change with your engagement!**

---

## 🔗 Smart Contracts (Verified)

All contracts deployed on **Polygon Amoy Testnet**:

| Contract | Address |
|----------|---------|
| **NFT** | [`0x7c7e2a1a3E1A701d1E359347208c95f59E562887`](https://amoy.polygonscan.com/address/0x7c7e2a1a3E1A701d1E359347208c95f59E562887) |
| **Staking** | [`0xc9015c8d8e094F6e5BFb8b23820A6dad97325700`](https://amoy.polygonscan.com/address/0xc9015c8d8e094F6e5BFb8b23820A6dad97325700) |
| **Breeding** | [`0x4B727035E06D1Ec9b169826f29d674853C69a35b`](https://amoy.polygonscan.com/address/0x4B727035E06D1Ec9b169826f29d674853C69a35b) |
| **Marketplace** | [`0x5C1a8D7c957bf8df218DE8C63D387D40901ae6d6`](https://amoy.polygonscan.com/address/0x5C1a8D7c957bf8df218DE8C63D387D40901ae6d6) |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Web3**: RainbowKit, Wagmi, ethers.js v6
- **Blockchain**: Polygon Amoy Testnet
- **Storage**: IPFS (Pinata)
- **Contracts**: Solidity, Hardhat, OpenZeppelin

---

## 🐛 Troubleshooting

**Wallet won't connect?**
- Install MetaMask
- Switch to Polygon Amoy network
- Refresh page

**Transaction failed?**
- Check MATIC balance
- Ensure correct network
- Check console for errors

**NFT not showing?**
- Wait 30 seconds for confirmation
- Refresh page
- Check transaction on PolygonScan

**Training failed?**
- Verify you own the NFT
- Check stat not maxed (100)
- Need 0.35 MATIC (0.3 + gas)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

<div align="center">
  
  **Status**: ✅ Production Ready | **Network**: Polygon Amoy Testnet
  
  **GitHub**: [mdlog/evoNFT](https://github.com/mdlog/evoNFT)
  
  Made with ❤️ for the Web3 community
  
</div>
