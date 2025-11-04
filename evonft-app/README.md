# EvoNFT - Evolving Digital Companions

Aplikasi dApp untuk Smart NFTs yang berkembang seiring waktu di Polygon network.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- MetaMask atau wallet Web3 lainnya

### Installation

1. Install dependencies:
```bash
cd evonft-app
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Buka browser di `http://localhost:3000`

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📁 Struktur Project

```
evonft-app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   └── NFTCard.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Marketplace.jsx
│   │   ├── MyCollection.jsx
│   │   ├── NFTDetail.jsx
│   │   ├── BreedingLab.jsx
│   │   ├── Staking.jsx
│   │   └── Profile.jsx
│   ├── context/         # React Context
│   │   └── Web3Context.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features

### Implemented
- ✅ Responsive UI/UX design
- ✅ Wallet connection (MetaMask)
- ✅ Home page dengan hero section
- ✅ Marketplace dengan filter & search
- ✅ My Collection page
- ✅ NFT Detail page dengan stats & traits
- ✅ Breeding Lab interface
- ✅ Staking Pool interface
- ✅ Profile & Settings page
- ✅ Smooth animations dengan Framer Motion

### To Be Implemented (Smart Contracts)
- ⏳ ERC-721 NFT contract
- ⏳ Evolution & leveling logic
- ⏳ Breeding mechanism
- ⏳ Staking rewards
- ⏳ Marketplace functionality
- ⏳ IPFS integration untuk metadata

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Web3**: ethers.js v6
- **Routing**: React Router v6

## 🎯 Next Steps

1. **Smart Contract Development**
   - Deploy ERC-721 contract ke Polygon Mumbai testnet
   - Implement evolution logic
   - Add breeding mechanism
   - Setup staking rewards

2. **Backend Integration**
   - Setup IPFS untuk metadata storage
   - Create API untuk off-chain data
   - Implement Chainlink oracle (optional)

3. **Testing**
   - Unit tests untuk components
   - Integration tests untuk Web3 interactions
   - E2E tests dengan Cypress

4. **Deployment**
   - Deploy frontend ke Vercel/Netlify
   - Deploy contracts ke Polygon mainnet
   - Setup monitoring & analytics

## 📝 Environment Variables

Buat file `.env` di root folder:

```env
VITE_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
VITE_CONTRACT_ADDRESS=0x...
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License
