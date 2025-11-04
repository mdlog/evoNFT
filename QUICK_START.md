# 🚀 Quick Start Guide - EvoNFT

Panduan cepat untuk setup dan deploy EvoNFT di Polygon Amoy testnet.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- MetaMask atau wallet lain (untuk testnet)

## 🔧 Setup

### 1. Clone & Install

```bash
# Sudah di folder polygon-nft
cd evonft-contracts
npm install
```

### 2. Check Wallet Balance

```bash
# Check apakah wallet punya MATIC testnet
node ../scripts/check-balance.js
```

**Output yang diharapkan:**
```
✅ Balance sufficient for deployment!
```

**Jika balance kurang:**
- Kunjungi: https://faucet.polygon.technology/
- Pilih "Polygon Amoy"
- Paste address: `0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4`
- Request testnet MATIC (gratis!)
- Atau gunakan: https://www.alchemy.com/faucets/polygon-amoy

### 3. Compile Contracts

```bash
npx hardhat compile
```

**Output yang diharapkan:**
```
✅ Compiled successfully
```

### 4. Run Tests (Optional)

```bash
npx hardhat test
```

### 5. Deploy to Amoy Testnet

```bash
npx hardhat run scripts/deploy.js --network amoy
```

**Output yang diharapkan:**
```
🚀 Deploying EvolvableNFT to amoy
📝 Deploying with account: 0x3e4d...
💰 Account balance: 1.5 MATIC

✅ EvolvableNFT deployed to: 0x...

📊 Contract Info:
   Mint Price: 0.01 MATIC
   Max Supply: 10000
   Cooldown: 86400 seconds
```

**PENTING:** Copy contract address yang muncul!

### 6. Verify Contract (Optional)

```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS> "EvoNFT" "EVONFT" "0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4"
```

### 7. Update AI Engine Config

```bash
cd ../evonft-ai-engine

# Edit .env dan tambahkan contract address
nano .env
# Set: CONTRACT_ADDRESS=0x... (dari step 5)
```

### 8. Install & Run AI Engine

```bash
npm install
npm run dev
```

**Output yang diharapkan:**
```
🚀 AI Engine running on port 3001
📊 Environment: development
```

### 9. Setup Frontend

```bash
cd ../evonft-app
npm install
```

Edit `src/config/contracts.js`:
```javascript
export const CONTRACT_ADDRESS = '0x...' // dari step 5
export const CHAIN_ID = 80002 // Amoy
```

Run frontend:
```bash
npm run dev
```

**Output yang diharapkan:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

## 🎉 Done!

Sekarang Anda punya:
- ✅ Smart contract deployed di Amoy
- ✅ AI Engine running
- ✅ Frontend running

## 🧪 Test the System

### 1. Connect Wallet
- Buka http://localhost:3000
- Click "Connect Wallet"
- Pilih MetaMask
- Switch ke Amoy testnet

### 2. Mint NFT
- Click "Mint Your First NFT"
- Approve transaction
- Wait for confirmation

### 3. Trigger Evolution (Manual)

```bash
# Test evolution via API
curl -X POST http://localhost:3001/api/evolution/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 0,
    "signals": {
      "transactionCount": 50,
      "stakingDays": 30,
      "tradingVolume": 1000
    }
  }'
```

### 4. Check Evolution

- Refresh frontend
- Check NFT detail page
- Should see updated metadata

## 📊 Useful Commands

### Check Contract on PolygonScan
```
https://amoy.polygonscan.com/address/<CONTRACT_ADDRESS>
```

### Check Wallet Transactions
```
https://amoy.polygonscan.com/address/0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4
```

### View Logs
```bash
# AI Engine logs
tail -f evonft-ai-engine/logs/combined.log

# Contract events
npx hardhat run scripts/listen-events.js --network amoy
```

## 🐛 Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get more testnet MATIC from faucet

### Issue: "Network not supported"
**Solution:** Switch MetaMask to Amoy testnet
- Network Name: Polygon Amoy Testnet
- RPC URL: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Currency: MATIC
- Block Explorer: https://amoy.polygonscan.com

**Or visit:** https://chainlist.org/chain/80002

### Issue: "Contract not deployed"
**Solution:** Run deploy script again

### Issue: "Signature verification failed"
**Solution:** Check AI_SIGNER_ADDRESS matches in both .env files

## 📚 Next Steps

1. **Customize NFT Metadata**
   - Edit `evonft-ai-engine/src/utils/metadata.js`
   - Add your own traits and attributes

2. **Add Real Images**
   - Setup Pinata account
   - Add API keys to .env
   - Generate images with AI

3. **Enhance Evolution Logic**
   - Add more data sources
   - Implement ML models
   - Create complex rules

4. **Deploy to Mainnet**
   - Get real MATIC
   - Update .env to use Polygon mainnet
   - Deploy with caution!

## 🆘 Need Help?

- Check `TECHNICAL_BLUEPRINT.md` for detailed architecture
- Check `SECURITY_GUIDE.md` for security best practices
- Check contract README: `evonft-contracts/README.md`
- Check AI Engine README: `evonft-ai-engine/README.md`

## 🎊 Congratulations!

Anda sudah berhasil setup EvoNFT system! 🚀

Sekarang NFT Anda bisa berevolusi berdasarkan AI! 🤖✨
