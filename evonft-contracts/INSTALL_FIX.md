# 🔧 Hardhat Installation Fix

## Problem
- Global Hardhat 3.0.10 detected
- Project needs local Hardhat 2.19.4
- npm install failing due to network issues

## Solution Options

### **Option 1: Force Local Install** ⭐

```bash
# Remove global hardhat from this session
npm uninstall -g hardhat

# Install locally with force
npm install --force --legacy-peer-deps

# Or try with specific registry
npm install --registry=https://registry.npmmirror.com --legacy-peer-deps
```

### **Option 2: Use Yarn (Recommended)**

```bash
# Install yarn globally
npm install -g yarn

# Install dependencies with yarn
yarn install

# Run hardhat with yarn
yarn hardhat run scripts/deployAll.js --network amoy
```

### **Option 3: Manual Package Installation**

```bash
# Create node_modules if not exists
mkdir -p node_modules

# Install packages one by one
npm install hardhat@2.19.4 --save-dev --legacy-peer-deps
npm install @nomicfoundation/hardhat-toolbox@4.0.0 --save-dev --legacy-peer-deps
npm install @openzeppelin/contracts@5.0.1 --save-dev --legacy-peer-deps
npm install dotenv@16.3.1 --save-dev --legacy-peer-deps
```

### **Option 4: Use Different Network/Location**

```bash
# Try with mobile hotspot or different network
# Sometimes corporate/university networks block npm

# Or use VPN if available
```

### **Option 5: Deploy with Remix IDE** (No Install Needed)

Since npm install is problematic, you can deploy using Remix:

1. **Go to Remix:** https://remix.ethereum.org/

2. **Upload Contracts:**
   - Click "File Explorer"
   - Upload all files from `contracts/` folder
   - Upload `@openzeppelin` dependencies

3. **Compile:**
   - Select Solidity Compiler
   - Choose version 0.8.20
   - Click "Compile"

4. **Deploy:**
   - Select "Deploy & Run Transactions"
   - Choose "Injected Provider - MetaMask"
   - Select Amoy network in MetaMask
   - Deploy each contract:
     - EvolvableNFT
     - EvolvableNFTExtended
     - StakingPool
     - BreedingLab

5. **Copy Addresses:**
   - Save deployed contract addresses
   - Update frontend config

---

## Quick Commands to Try

```bash
# 1. Clear everything and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps

# 2. Or use yarn
yarn install

# 3. Or install minimal packages
npm install hardhat@2.19.4 dotenv@16.3.1 --save-dev --legacy-peer-deps
```

---

## Verify Installation

After successful install:

```bash
# Check if hardhat is installed locally
ls node_modules/.bin/hardhat

# Check version
./node_modules/.bin/hardhat --version

# Or use npx (should use local version)
npx hardhat --version
```

---

## Alternative: Deploy Without Hardhat

If all else fails, you can deploy using:

1. **Remix IDE** (recommended for quick deployment)
2. **Truffle** (alternative framework)
3. **Foundry** (modern alternative)
4. **Manual deployment** via ethers.js script

---

## Current Status

```
✅ Contracts ready
✅ .env configured  
✅ Global hardhat available (v3.0.10)
❌ Local hardhat not installed (v2.19.4 needed)
❌ npm install failing
```

**Recommendation:** Try Option 2 (Yarn) or Option 5 (Remix)
