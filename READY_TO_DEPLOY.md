# ✅ READY TO DEPLOY - Final Steps

## 🎉 Good News!

Your `.env` file is **ALREADY CONFIGURED** and looks good! ✅

### ✅ Environment Variables Found:
```
✅ AMOY_RPC_URL: https://rpc-amoy.polygon.technology
✅ PRIVATE_KEY: ***19f4 (configured)
✅ AI_SIGNER_ADDRESS: 0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4
✅ POLYGONSCAN_API_KEY: FAJB*** (configured)
✅ MINT_PRICE: 0.01
✅ MAX_SUPPLY: 10000
```

---

## 🚀 DEPLOYMENT STEPS (5 Minutes)

### **Step 1: Install Dependencies** (2 min)

```bash
cd evonft-contracts
npm install
```

This will install:
- Hardhat
- OpenZeppelin contracts
- Other required packages

### **Step 2: Check Wallet Balance** (1 min)

Run this to check if you have enough test MATIC:

```bash
npx hardhat run scripts/check-deployment-readiness.js --network amoy
```

**Expected Output:**
```
✅ Deployer Address: 0x...
✅ Balance: X.XX MATIC
✅ READY TO DEPLOY!
```

**If balance is low (<0.5 MATIC):**
- Visit: https://faucet.polygon.technology/
- Request test MATIC for your address
- Wait 1-2 minutes

### **Step 3: Deploy Contracts** (2 min)

```bash
npx hardhat run scripts/deployAll.js --network amoy
```

**Save the output!** You'll see something like:
```
✅ EvolvableNFT deployed to: 0x1234...
✅ EvolvableNFTExtended deployed to: 0x5678...
✅ StakingPool deployed to: 0x9abc...
✅ BreedingLab deployed to: 0xdef0...
```

### **Step 4: Update Frontend Config** (1 min)

Edit `evonft-app/src/config/contracts.js`:

```javascript
// Replace with your deployed addresses
export const NFT_CONTRACT = "0x1234..." // From Step 3
export const NFT_EXTENDED_CONTRACT = "0x5678..." // From Step 3
export const STAKING_CONTRACT = "0x9abc..." // From Step 3
export const BREEDING_CONTRACT = "0xdef0..." // From Step 3
```

### **Step 5: Test the Application** (5 min)

```bash
cd ../evonft-app
npm run dev
```

Open http://localhost:3007 and test:
- ✅ Connect wallet
- ✅ Mint an NFT
- ✅ View in My NFTs
- ✅ Train the NFT
- ✅ Stake the NFT

---

## 📋 Quick Command Reference

```bash
# 1. Install dependencies
cd evonft-contracts
npm install

# 2. Check readiness
npx hardhat run scripts/check-deployment-readiness.js --network amoy

# 3. Deploy contracts
npx hardhat run scripts/deployAll.js --network amoy

# 4. Verify contracts (optional)
npx hardhat verify --network amoy <CONTRACT_ADDRESS>

# 5. Test frontend
cd ../evonft-app
npm run dev
```

---

## ⚠️ Troubleshooting

### **Error: "Trying to use a non-local installation of Hardhat"**
**Solution:** Run `npm install` in evonft-contracts directory

### **Error: "Insufficient funds"**
**Solution:** Get test MATIC from https://faucet.polygon.technology/

### **Error: "Network not found"**
**Solution:** Make sure you're using `--network amoy` flag

### **Error: "Invalid private key"**
**Solution:** Check your .env file has correct PRIVATE_KEY format (without 0x prefix)

---

## 🎯 Your Configuration Summary

Based on your `.env` file:

### **Network:**
- ✅ Polygon Amoy Testnet
- ✅ RPC: https://rpc-amoy.polygon.technology
- ✅ Chain ID: 80002

### **Wallet:**
- ✅ Private Key: Configured (ending in ...19f4)
- ⚠️ Balance: Need to check (run check script)

### **AI Signer:**
- ✅ Address: 0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4

### **Contract Parameters:**
- ✅ Mint Price: 0.01 MATIC
- ✅ Max Supply: 10,000 NFTs
- ✅ Cooldown: 24 hours (86400 seconds)

### **Verification:**
- ✅ PolygonScan API Key: Configured

---

## 🎉 You're Almost There!

**Current Status:** 95% Ready! ✅

**What's Done:**
- ✅ Smart contracts written
- ✅ Frontend complete
- ✅ .env configured
- ✅ Network setup

**What's Left:**
1. ⚠️ Install dependencies (`npm install`)
2. ⚠️ Check wallet balance
3. ⚠️ Deploy contracts
4. ⚠️ Update frontend addresses

**Estimated Time:** 5-10 minutes

---

## 📞 Need Help?

### **Check These:**
1. Wallet has test MATIC (>0.5 MATIC recommended)
2. Dependencies installed (`npm install`)
3. Using correct network (`--network amoy`)
4. .env file in correct location

### **Get Test MATIC:**
- **Faucet 1:** https://faucet.polygon.technology/
- **Faucet 2:** https://www.alchemy.com/faucets/polygon-amoy

### **Verify Network in MetaMask:**
```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency: MATIC
Explorer: https://amoy.polygonscan.com/
```

---

## 🚀 Ready? Let's Deploy!

**Run these commands in order:**

```bash
# Terminal 1: Deploy contracts
cd evonft-contracts
npm install
npx hardhat run scripts/deployAll.js --network amoy

# Terminal 2: Start frontend (after updating addresses)
cd evonft-app
npm run dev
```

**That's it!** 🎉

Your EvoNFT application will be live on Polygon Amoy Testnet!

---

**Last Updated:** 2025-01-03
**Status:** READY TO DEPLOY ✅
**Confidence:** 95%
