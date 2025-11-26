# 🎯 NEXT STEPS - Complete EvoNFT Deployment

## ✅ WHAT'S DONE

- ✅ NFT Contract deployed: `0xe31d18Fb9925f677451845997f64806a88264b3D`
- ✅ Staking Pool deployed: `0xB7d914D84d6b5f21ef53B4B56DCB56508115C838`
- ✅ Frontend config updated
- ✅ AI Engine config updated

---

## 🚀 STEP 1: Deploy Breeding Contract

Run this command to complete the deployment:

```bash
cd evonft-contracts
npx hardhat run deploy-breeding-only.js --network amoy
```

This will:
- Deploy BreedingLab contract
- Update `deployments/latest.json` with breeding address
- Show verification command

---

## 🔍 STEP 2: Verify Contracts (Optional but Recommended)

After breeding deployment, verify all contracts:

```bash
# Verify NFT Contract
npx hardhat verify --network amoy \
  0xe31d18Fb9925f677451845997f64806a88264b3D \
  "EvoNFT" "EVONFT" "0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4"

# Verify Staking Pool
npx hardhat verify --network amoy \
  0xB7d914D84d6b5f21ef53B4B56DCB56508115C838 \
  "0xe31d18Fb9925f677451845997f64806a88264b3D"

# Verify Breeding Lab (replace <ADDRESS> with deployed address)
npx hardhat verify --network amoy \
  <BREEDING_ADDRESS> \
  "0xe31d18Fb9925f677451845997f64806a88264b3D"
```

---

## 📝 STEP 3: Update Frontend Config

After breeding deployment, update `evonft-app/.env`:

```env
VITE_BREEDING_CONTRACT=<BREEDING_ADDRESS>
```

---

## 🎮 STEP 4: Test the Application

### Start Frontend
```bash
cd evonft-app
npm run dev
```
Opens at: http://localhost:3020

### Start AI Engine (Optional for now)
```bash
cd evonft-ai-engine
npm run dev
```
Runs at: http://localhost:3001

---

## 🧪 STEP 5: Test Features

1. **Connect Wallet**
   - Open http://localhost:3020
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve connection

2. **Mint NFT**
   - Click "Mint NFT"
   - Pay 0.01 MATIC
   - Wait for confirmation
   - NFT appears in "My Collection"

3. **Feed NFT**
   - Open NFT detail
   - Click "Feed"
   - Choose food type
   - Confirm transaction

4. **Train NFT**
   - Open NFT detail
   - Click "Train"
   - Choose stat to train
   - Confirm transaction

5. **Stake NFT**
   - Go to "Staking" page
   - Click "Stake"
   - Select NFT
   - Confirm transaction

6. **Breed NFT** (after breeding contract deployed)
   - Go to "Breeding Lab"
   - Select 2 parent NFTs
   - Pay 1.0 MATIC
   - Wait 24 hours
   - Claim offspring

---

## 💰 STEP 6: Fund Staking Pool (Optional)

If you want staking rewards to work, fund the staking pool:

```bash
# Using MetaMask or any wallet
# Send MATIC to: 0xB7d914D84d6b5f21ef53B4B56DCB56508115C838
# Recommended: 5-10 MATIC for testing
```

Or using Hardhat console:

```bash
cd evonft-contracts
npx hardhat console --network amoy
```

Then in console:
```javascript
const [signer] = await ethers.getSigners();
await signer.sendTransaction({
  to: "0xB7d914D84d6b5f21ef53B4B56DCB56508115C838",
  value: ethers.parseEther("5.0")
});
```

---

## 🤖 STEP 7: Setup AI Engine (For Evolution)

The AI Engine monitors user activity and triggers automatic evolution.

### Configure API Keys (Optional)

Edit `evonft-ai-engine/.env`:

```env
# For AI-generated descriptions
OPENAI_API_KEY=your_openai_key

# For IPFS storage
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# For blockchain data
ALCHEMY_API_KEY=your_alchemy_key
```

### Start AI Engine

```bash
cd evonft-ai-engine
npm run dev
```

The engine will:
- Check for eligible NFTs every hour
- Calculate evolution scores
- Trigger automatic evolution when score ≥ 50
- Generate new metadata and visuals

---

## 📊 MONITORING

### Check Contract on Explorer

- **NFT Contract:** https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
- **Staking Pool:** https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838

### Check Transactions

All your transactions will appear in MetaMask and on PolygonScan.

---

## 🆘 TROUBLESHOOTING

### "Insufficient funds for gas"
- Get more testnet MATIC from: https://faucet.polygon.technology

### "Network not supported"
- Switch MetaMask to Polygon Amoy Testnet
- Chain ID: 80002

### "Transaction failed"
- Check gas limit
- Ensure you have enough MATIC
- Try again after a few seconds

### "NFT not showing"
- Refresh page (Ctrl+F5)
- Check wallet connection
- Verify network is Polygon Amoy

---

## 📚 DOCUMENTATION

- **Full Guide:** See `DETAIL_APLIKASI_EVONFT.md`
- **Deployment Summary:** See `DEPLOYMENT_SUMMARY.md`
- **Contract Addresses:** See `evonft-contracts/deployments/latest.json`

---

## 🎉 YOU'RE ALMOST DONE!

Just deploy the breeding contract and you're ready to go!

```bash
cd evonft-contracts
npx hardhat run deploy-breeding-only.js --network amoy
```

Happy building! 🚀
