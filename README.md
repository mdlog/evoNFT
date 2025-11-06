<div align="center">
  <img src="evoNFT-logo11.png" alt="EvoNFT Logo" width="200"/>
  
  # 🎮 EvoNFT - Evolving Digital Companions
  
  A full-featured dApp for evolving NFTs on Polygon Amoy Testnet. Mint, level up, breed, stake, and trade your NFTs.
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Network](https://img.shields.io/badge/Network-Polygon%20Amoy-8247E5)](https://amoy.polygonscan.com)
</div>

---

## ✨ Features

- 🎨 **Mint NFTs** - Create unique evolving NFTs with IPFS metadata
- 📈 **Level Up** - Feed & train to increase stats and XP
- 🧬 **Breeding** - Combine 2 NFTs to create offspring
- 💎 **Staking** - Stake NFTs to earn rewards
- 🛒 **Marketplace** - Buy and sell NFTs peer-to-peer
- 🌈 **Multi-Wallet** - RainbowKit integration (MetaMask, WalletConnect, Coinbase, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Wallet (MetaMask recommended)
- Polygon Amoy testnet MATIC ([Get from faucet](https://faucet.polygon.technology))

### Installation

```bash
# Clone repository
git clone <repository-url>
cd evonft-app

# Install dependencies
npm install

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
3. **Mint NFT** - Go to Mint page and create your first NFT
4. **Level Up** - Feed or train your NFT to increase stats
5. **Trade** - List your NFT for sale or buy from marketplace

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

| Contract | Address | Explorer |
|----------|---------|----------|
| NFT | `0xe31d18Fb9925f677451845997f64806a88264b3D` | [View](https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D) |
| Staking | `0xB7d914D84d6b5f21ef53B4B56DCB56508115C838` | [View](https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838) |
| Breeding | `0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250` | [View](https://amoy.polygonscan.com/address/0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250) |
| Marketplace | `0x4fe6d4C271300BB796f8F00751aA46f93667D677` | [View](https://amoy.polygonscan.com/address/0x4fe6d4C271300BB796f8F00751aA46f93667D677) |

## 🐛 Troubleshooting

**Wallet won't connect?**
- Ensure MetaMask is installed
- Switch to Polygon Amoy network
- Clear browser cache

**Transaction failed?**
- Check MATIC balance
- Ensure you're on Polygon Amoy network
- Try increasing gas limit

**NFT not showing?**
- Wait for blockchain confirmation (~10-30 seconds)
- Refresh the page
- Check transaction on [PolygonScan](https://amoy.polygonscan.com)

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with:
- [Polygon](https://polygon.technology) - Layer 2 scaling solution
- [RainbowKit](https://www.rainbowkit.com) - Wallet connection UI
- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [IPFS](https://ipfs.tech) - Decentralized storage

---

<div align="center">
  
  **Status**: ✅ Production Ready | **Network**: Polygon Amoy Testnet
  
  Made with ❤️ for the Web3 community
  
</div>
