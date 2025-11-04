# 🚀 FINAL DEPLOYMENT GUIDE

## Current Situation

You have Hardhat installed, but missing some dependencies for the toolbox plugin.

---

## ✅ QUICK FIX (Choose One)

### **Option 1: Run Install Script** (Easiest)

```bash
cd evonft-contracts
chmod +x install-deps.sh
./install-deps.sh
```

### **Option 2: Manual Command** (Copy-Paste)

```bash
cd evonft-contracts

npm install --save-dev @nomicfoundation/hardhat-chai-matchers@^2.0.0 @nomicfoundation/hardhat-ethers@^3.0.0 @nomicfoundation/hardhat-network-helpers@^1.0.0 @nomicfoundation/hardhat-verify@^2.0.0 @typechain/ethers-v6@^0.5.0 @typechain/hardhat@^9.0.0 @types/chai@^4.2.0 @types/mocha@^9.1.0 @types/node@^16.0.0 chai@^4.2.0 ethers@^6.4.0 hardhat-gas-reporter@^1.0.8 solidity-coverage@^0.8.1 ts-node@^8.0.0 typechain@^8.3.0 typescript@^4.5.0
```

### **Option 3: Use Yarn** (Alternative)

```bash
cd evonft-contracts
yarn add --dev @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-verify @typechain/ethers-v6 @typechain/hardhat @types/chai @types/mocha @types/node chai ethers hardhat-gas-reporter solidity-coverage ts-node typechain typescript
```

---

## 🎯 After Dependencies Installed

### **1. Compile Contracts**
```bash
npx hardhat compile
```

Expected output:
```
✅ Compiled 4 Solidity files successfully
```

### **2. Check Deployment Readiness**
```bash
npx hardhat run scripts/check-deployment-readiness.js --network amoy
```

Expected output:
```
✅ Environment Variables: OK
✅ Network Connection: OK
✅ Wallet Balance: X.XX MATIC
✅ READY TO DEPLOY!
```

### **3. Deploy to Amoy**
```bash
npx hardhat run scripts/deployAll.js --network amoy
```

**IMPORTANT:** Save the contract addresses from output!

### **4. Update Frontend**

Edit `evonft-app/src/config/contracts.js`:

```javascript
export const NFT_CONTRACT = "0xYourAddress"
export const NFT_EXTENDED_CONTRACT = "0xYourAddress"
export const STAKING_CONTRACT = "0xYourAddress"
export const BREEDING_CONTRACT = "0xYourAddress"
```

### **5. Test Application**

```bash
cd ../evonft-app
npm run dev
```

Open http://localhost:3007 and test all features!

---

## 📋 Complete Command Sequence

```bash
# 1. Install dependencies
cd evonft-contracts
npm install --save-dev @nomicfoundation/hardhat-chai-matchers@^2.0.0 @nomicfoundation/hardhat-ethers@^3.0.0 @nomicfoundation/hardhat-network-helpers@^1.0.0 @nomicfoundation/hardhat-verify@^2.0.0 @typechain/ethers-v6@^0.5.0 @typechain/hardhat@^9.0.0 @types/chai@^4.2.0 @types/mocha@^9.1.0 @types/node@^16.0.0 chai@^4.2.0 ethers@^6.4.0 hardhat-gas-reporter@^1.0.8 solidity-coverage@^0.8.1 ts-node@^8.0.0 typechain@^8.3.0 typescript@^4.5.0

# 2. Compile
npx hardhat compile

# 3. Deploy
npx hardhat run scripts/deployAll.js --network amoy

# 4. Update frontend config with addresses

# 5. Test
cd ../evonft-app
npm run dev
```

---

## ⚠️ If Network Issues Persist

### **Alternative: Install One by One**

```bash
npm install --save-dev @nomicfoundation/hardhat-ethers@^3.0.0
npm install --save-dev ethers@^6.4.0
npm install --save-dev @nomicfoundation/hardhat-chai-matchers@^2.0.0
npm install --save-dev chai@^4.2.0
npm install --save-dev @nomicfoundation/hardhat-verify@^2.0.0
npm install --save-dev typescript@^4.5.0
npm install --save-dev ts-node@^8.0.0
npm install --save-dev @types/node@^16.0.0
npm install --save-dev @types/mocha@^9.1.0
npm install --save-dev @types/chai@^4.2.0
npm install --save-dev typechain@^8.3.0
npm install --save-dev @typechain/hardhat@^9.0.0
npm install --save-dev @typechain/ethers-v6@^0.5.0
npm install --save-dev hardhat-gas-reporter@^1.0.8
npm install --save-dev solidity-coverage@^0.8.1
npm install --save-dev @nomicfoundation/hardhat-network-helpers@^1.0.0
```

---

## 🎉 Summary

### **Current Status:**
- ✅ Hardhat installed (v3.0.10)
- ✅ .env configured
- ✅ Contracts ready
- ⚠️ Missing toolbox dependencies

### **What You Need:**
1. Install missing dependencies (1 command)
2. Compile contracts
3. Deploy to Amoy
4. Update frontend addresses

### **Time Estimate:**
- Dependencies: 2-5 minutes
- Compile: 30 seconds
- Deploy: 2 minutes
- Update & Test: 5 minutes

**Total: ~10 minutes**

---

## 📞 Quick Reference

### **Check if Ready:**
```bash
npx hardhat compile
```

### **Deploy:**
```bash
npx hardhat run scripts/deployAll.js --network amoy
```

### **Verify Contract:**
```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

---

## ✅ Success Criteria

You'll know deployment is successful when:
- ✅ All contracts compile without errors
- ✅ Deployment script completes
- ✅ You receive 4 contract addresses
- ✅ Frontend connects to contracts
- ✅ You can mint an NFT
- ✅ NFT appears in My Collection

---

**You're almost there! Just install the dependencies and deploy!** 🚀
