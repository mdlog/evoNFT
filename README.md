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

### Trade in Marketplace
1. List your NFT for sale (free)
2. Set your price
3. Buyers pay price + 2.5% fee
4. Instant transfer on purchase

---

## 🔗 Smart Contracts (Verified)

All contracts deployed on **Polygon Amoy Testnet**:

| Contract | Address |
|----------|---------|
| **NFT** | [`0xb45471de7F633C49d4e47B6c86E67B1Ce3665c55`](https://amoy.polygonscan.com/address/0xb45471de7F633C49d4e47B6c86E67B1Ce3665c55) |
| **Staking** | [`0x7432BCb3605bc754E5606Bd6c6E6042168cE7427`](https://amoy.polygonscan.com/address/0x7432BCb3605bc754E5606Bd6c6E6042168cE7427) |
| **Breeding** | [`0xD7236c8F8ABA01F064307864B27E020b787a262f`](https://amoy.polygonscan.com/address/0xD7236c8F8ABA01F064307864B27E020b787a262f) |
| **Marketplace** | [`0x1d328AcFcFd011b57a04c8f717c6E691bba4eEb8`](https://amoy.polygonscan.com/address/0x1d328AcFcFd011b57a04c8f717c6E691bba4eEb8) |

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
