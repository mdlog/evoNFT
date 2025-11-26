# 🔧 Network Install Fix

## Problem
`npm install` failed with `ECONNRESET` error - network connectivity issue.

## Solutions (Try in Order)

### **Solution 1: Retry with Different Registry** (Recommended)

```bash
# Clear npm cache
npm cache clean --force

# Use different registry (faster in some regions)
npm install --registry=https://registry.npmmirror.com

# Or use official registry with longer timeout
npm install --registry=https://registry.npmjs.org --fetch-timeout=60000
```

### **Solution 2: Install with Yarn** (Alternative)

```bash
# Install yarn if not installed
npm install -g yarn

# Install dependencies with yarn
yarn install
```

### **Solution 3: Manual Retry**

```bash
# Sometimes just retrying works
npm install --prefer-offline --no-audit
```

### **Solution 4: Check Network**

```bash
# Test npm registry connection
npm ping

# Check if you can reach registry
curl https://registry.npmjs.org/

# If behind proxy, configure:
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port
```

### **Solution 5: Install Key Packages Manually**

```bash
# Install critical packages one by one
npm install hardhat@^2.19.4
npm install @nomicfoundation/hardhat-toolbox@^4.0.0
npm install @openzeppelin/contracts@^5.0.1
npm install dotenv@^16.3.1
```

---

## 🚀 Alternative: Deploy Without Full Install

If npm install keeps failing, you can try deploying with minimal setup:

### **Option A: Use Existing Installation**

If you have hardhat installed globally or in another project:

```bash
# Check if hardhat is available
which hardhat

# If yes, try running directly
hardhat run scripts/deployAll.js --network amoy
```

### **Option B: Use Docker** (Advanced)

```bash
# Pull hardhat docker image
docker pull ethereum/solc:latest

# Run deployment in container
docker run -v $(pwd):/app ethereum/solc:latest hardhat run scripts/deployAll.js --network amoy
```

---

## 📋 Quick Diagnostic

Run these to diagnose the issue:

```bash
# 1. Check npm version
npm --version

# 2. Check node version
node --version

# 3. Check network
ping registry.npmjs.org

# 4. Check npm config
npm config list

# 5. Check if behind proxy
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

---

## ✅ After Successful Install

Once npm install succeeds, verify:

```bash
# Check if hardhat is installed
npx hardhat --version

# Should show: Hardhat version 2.19.4 or similar
```

Then proceed with deployment:

```bash
npx hardhat run scripts/check-deployment-readiness.js --network amoy
```

---

## 🆘 Still Having Issues?

### **Workaround: Deploy from Another Machine**

If network issues persist:

1. **Copy project to another machine/network**
2. **Run npm install there**
3. **Deploy contracts**
4. **Copy deployed addresses back**

### **Or Use Online IDE**

1. **Remix IDE**: https://remix.ethereum.org/
   - Upload contracts
   - Deploy manually
   - Copy addresses

2. **Hardhat Cloud**: https://hardhat.org/
   - Use cloud deployment
   - No local install needed

---

## 💡 Prevention for Next Time

```bash
# Use npm ci instead of npm install (faster, more reliable)
npm ci

# Or lock dependencies
npm install --package-lock-only
```

---

## 📞 Current Status

Based on your error:
- ❌ npm install failed (network issue)
- ⚠️ Hardhat not installed locally
- ✅ .env configured
- ✅ Contracts ready

**Next Step:** Try Solution 1 or 2 above
