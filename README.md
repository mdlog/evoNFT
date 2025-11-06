<div align="center">
  <img src="evoNFT-logo11.png" alt="EvoNFT Logo" width="200"/>
  
  # 🎮 EvoNFT - Evolving Digital Companions
  
  Full-featured dApp untuk NFTs yang berkembang dan berevolusi di Polygon Amoy Testnet. NFT Anda dapat di-mint, di-level up, dibreeding, di-stake, dan diperdagangkan di marketplace.
</div>

## ✨ Features

### 🎨 Core Features (Implemented)
- ✅ **NFT Minting** - Mint NFT dengan metadata IPFS
- ✅ **Dynamic NFT Visuals** - Visual berubah berdasarkan level & rarity
- ✅ **Evolution System** - Level up NFT dengan XP
- ✅ **Feed & Train** - Tingkatkan stats NFT
- ✅ **Breeding Lab** - Breeding 2 NFT untuk offspring baru
- ✅ **Staking Pool** - Stake NFT untuk rewards
- ✅ **Marketplace** - Jual beli NFT dengan listing system
- ✅ **Profile Page** - Lihat portfolio & stats

### 🌈 Wallet Integration
- ✅ **RainbowKit** - Multi-wallet support (MetaMask, WalletConnect, Coinbase, dll)
- ✅ **Beautiful UI** - Modern wallet connection modal
- ✅ **Network Switching** - Auto switch ke Polygon Amoy
- ✅ **Mobile Support** - WalletConnect untuk mobile wallets

### ⚡ Performance Optimizations
- ✅ **Fast NFT Loading** - 5-10x lebih cepat dengan caching
- ✅ **Minimal Blockchain Calls** - Optimized contract interactions
- ✅ **Progressive Loading** - Load essential data first
- ✅ **In-Memory Cache** - 30s cache untuk repeated queries

### 🎨 UI/UX
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Dark Mode** - Glass morphism design
- ✅ **Smooth Animations** - Framer Motion
- ✅ **Interactive Cards** - Hover effects & transitions
- ✅ **Search & Filter** - Advanced filtering dengan dropdown

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Wallet (MetaMask, Coinbase, Rainbow, dll)
- Polygon Amoy testnet MATIC (dari faucet)

### Installation

1. **Clone & Install**
```bash
cd evonft-app
npm install
```

2. **Setup Environment**
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan tambahkan:
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

3. **Get WalletConnect Project ID**
- Kunjungi: https://cloud.walletconnect.com
- Create new project
- Copy Project ID
- Paste ke `.env`

4. **Start Development**
```bash
npm run dev
```

5. **Open Browser**
```
http://localhost:5173
```

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
evonft-app/
├── src/
│   ├── components/           # Reusable components
│   │   ├── NavbarRainbow.jsx    # RainbowKit navbar
│   │   ├── Navbar.jsx           # Legacy navbar
│   │   ├── Footer.jsx
│   │   ├── MintNFT.jsx
│   │   ├── NFTVisual.jsx        # Dynamic NFT renderer
│   │   ├── NFTCard.jsx
│   │   ├── NFTGallery.jsx
│   │   ├── BuyNFTModal.jsx
│   │   ├── ListForSaleModal.jsx
│   │   ├── FeedModal.jsx
│   │   ├── TrainModal.jsx
│   │   └── NetworkSwitcher.jsx
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── Mint.jsx
│   │   ├── Marketplace.jsx      # Explore/Buy NFTs
│   │   ├── MyCollectionIntegrated.jsx
│   │   ├── NFTDetailIntegrated.jsx
│   │   ├── BreedingLabIntegrated.jsx
│   │   ├── StakingIntegrated.jsx
│   │   └── Profile.jsx
│   ├── context/              # React Context
│   │   ├── RainbowWeb3Context.jsx  # RainbowKit provider
│   │   └── Web3Context.jsx         # Legacy provider
│   ├── hooks/                # Custom hooks
│   │   ├── useContract.js
│   │   ├── useExtendedContract.js
│   │   ├── useBreeding.js
│   │   ├── useMarketplace.js
│   │   ├── useAllNFTs.js
│   │   ├── useAllNFTsFast.js    # Optimized loading
│   │   ├── useNFTVisuals.js
│   │   └── useNFTHistory.js
│   ├── config/               # Configuration
│   │   ├── contracts.js         # Contract addresses & ABIs
│   │   ├── contractsExtended.js
│   │   └── rainbowkit.js        # RainbowKit config
│   ├── services/             # Services
│   │   └── contractService.js   # IPFS & contract helpers
│   ├── assets/               # Static assets
│   │   └── nft-visuals.js       # NFT visual configs
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static files
│   └── logo.png
├── .env                      # Environment variables
├── .env.example              # Environment template
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router v6** - Routing

### Web3 Integration
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **ethers.js v6** - Ethereum interactions
- **@tanstack/react-query** - Data fetching

### Smart Contracts (Deployed)
- **NFT Contract** - ERC-721 dengan evolution
- **Staking Contract** - Stake NFTs untuk rewards
- **Breeding Contract** - Breeding mechanism
- **Marketplace Contract** - P2P trading

### Storage & Services
- **IPFS** - Metadata storage
- **Pinata** - IPFS pinning service

## 📋 Pages & Features

### 🏠 Home
- Hero section dengan CTA
- Feature highlights
- Stats overview
- Getting started guide

### 🎨 Mint NFT
- Mint new NFT dengan metadata
- Upload ke IPFS otomatis
- Random rarity generation
- Real-time minting status

### 🌟 Explore (Marketplace)
- Browse semua NFTs
- Search by name/ID/type
- Filter: All / For Sale / Not For Sale
- Buy NFTs langsung
- Fast loading (1-2 detik)

### 🖼️ My NFTs
- View owned NFTs
- XP progress bars
- Stats & attributes (collapsible)
- Feed & Train actions
- List for sale
- Quick actions

### 🔬 NFT Detail
- Full NFT information
- Evolution history
- Stats breakdown
- Traits & attributes
- Action buttons (Feed, Train, Evolve)
- Transaction history

### 🧬 Breeding Lab
- Select 2 parent NFTs
- View breeding requirements
- Offspring prediction
- Cooldown timers
- Breeding history

### 💎 Staking
- Stake NFTs untuk rewards
- View staked NFTs
- Claim rewards
- Pool statistics
- APY calculator

### 👤 Profile
- Wallet information
- Portfolio value
- NFT collection stats
- Transaction history
- Settings

## 📝 Environment Variables

File `.env` configuration:

```env
# Contract Addresses (Deployed on Polygon Amoy)
VITE_NFT_CONTRACT=0xe31d18Fb9925f677451845997f64806a88264b3D
VITE_STAKING_CONTRACT=0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
VITE_BREEDING_CONTRACT=0x5CcE235E35c7D6bcD0aaca9744e60a0D72cF6250
VITE_MARKETPLACE_CONTRACT=0x4fe6d4C271300BB796f8F00751aA46f93667D677

# Network Configuration
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology
VITE_NETWORK_NAME=Polygon Amoy Testnet
VITE_BLOCK_EXPLORER=https://amoy.polygonscan.com

# WalletConnect Project ID (Required for RainbowKit)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 🎮 Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" di navbar
- Pilih wallet (MetaMask, WalletConnect, Coinbase, dll)
- Approve connection
- Switch ke Polygon Amoy jika diminta

### 2. Get Test MATIC
- Kunjungi: https://faucet.polygon.technology
- Request MATIC untuk Polygon Amoy
- Wait for confirmation

### 3. Mint Your First NFT
- Go to Mint page
- Click "Mint NFT"
- Approve transaction
- Wait for minting (~10-30 detik)
- View di My NFTs

### 4. Level Up NFT
- Go to NFT Detail
- Click "Feed" atau "Train"
- Select food/stat type
- Approve transaction
- Watch XP increase

### 5. Breed NFTs
- Go to Breeding Lab
- Select 2 parent NFTs
- Check requirements
- Click "Breed"
- Wait for cooldown
- Claim offspring

### 6. Stake NFTs
- Go to Staking page
- Select NFT to stake
- Approve transaction
- Earn rewards over time
- Claim rewards anytime

### 7. Trade on Marketplace
- **Sell**: List NFT dengan price
- **Buy**: Browse & buy listed NFTs
- **Cancel**: Cancel listing anytime

## ⚡ Performance Tips

### Fast Loading
- NFTs load dalam 1-2 detik (optimized)
- Cache aktif untuk 30 detik
- Refresh untuk update data

### Reduce Gas Fees
- Batch transactions jika memungkinkan
- Check gas price sebelum transaction
- Use Polygon (low fees)

### Best Practices
- Keep wallet secure
- Backup seed phrase
- Test dengan small amounts
- Check contract addresses

## 🐛 Troubleshooting

### Wallet tidak connect
- Check MetaMask installed
- Try different wallet
- Clear browser cache
- Check network (Polygon Amoy)

### Transaction gagal
- Check MATIC balance
- Increase gas limit
- Wait for network congestion
- Check contract address

### NFT tidak muncul
- Wait for blockchain confirmation
- Refresh page
- Clear cache
- Check transaction on explorer

### Loading lambat
- Check internet connection
- Try different RPC URL
- Clear browser cache
- Wait for IPFS sync

## 📚 Documentation

### Main Docs
- `RAINBOWKIT_QUICKSTART.md` - RainbowKit setup
- `NFT_LOADING_OPTIMIZATION.md` - Performance optimization
- `MARKETPLACE_IMPLEMENTATION_GUIDE.md` - Marketplace guide
- `STAKING_REAL_DATA_SUMMARY.md` - Staking implementation

### Additional Docs
- `RAINBOWKIT_ACTIVATED.md` - RainbowKit status
- `NFT_CARD_UI_FIX.md` - UI improvements
- `TROUBLESHOOT_SOLD_OUT.md` - Common issues

## 🎯 Roadmap

### Phase 1 (Completed) ✅
- ✅ Core NFT functionality
- ✅ Evolution system
- ✅ Breeding mechanism
- ✅ Staking pool
- ✅ Marketplace
- ✅ RainbowKit integration
- ✅ Performance optimization

### Phase 2 (In Progress) 🚧
- ⏳ Advanced filtering
- ⏳ NFT analytics
- ⏳ Leaderboard
- ⏳ Achievement system
- ⏳ Social features

### Phase 3 (Planned) 📋
- 📋 Mobile app
- 📋 Governance token
- 📋 DAO features
- 📋 Cross-chain bridge
- 📋 Mainnet deployment

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Smart Contracts**: `../evonft-contracts/`
- **Block Explorer**: https://amoy.polygonscan.com
- **Polygon Faucet**: https://faucet.polygon.technology
- **WalletConnect**: https://cloud.walletconnect.com

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- **Polygon** - Layer 2 scaling solution
- **RainbowKit** - Beautiful wallet connection
- **Wagmi** - React hooks for Ethereum
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first CSS
- **IPFS** - Decentralized storage

## 📞 Support

Need help? Check:
- Documentation files in root directory
- Console logs for debugging
- Block explorer for transactions
- Community Discord [Coming Soon]

---

**Built with ❤️ for the Web3 community**

**Status**: ✅ Production Ready
**Network**: Polygon Amoy Testnet
**Last Updated**: 2025-11-06
