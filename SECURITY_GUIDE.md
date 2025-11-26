# 🔐 Security Guide - EvoNFT Project

## ⚠️ CRITICAL: Never Expose Private Keys!

Private keys are like passwords to your crypto wallet. If someone gets your private key, they can:
- Steal all your funds
- Deploy malicious contracts
- Impersonate you
- Cannot be undone!

## 🛡️ Key Management Best Practices

### Development Environment

#### 1. Generate Secure Keys
```bash
# Install dependencies first
cd evonft-contracts
npm install

# Generate new keys
node ../scripts/generate-keys.js
```

#### 2. Store Keys Safely
```bash
# Create .env file (NEVER commit this!)
cp .env.example .env

# Edit .env with your keys
nano .env  # or use your preferred editor
```

#### 3. Verify .gitignore
```bash
# Make sure .env is in .gitignore
cat .gitignore | grep .env

# Should show:
# .env
# .env.local
# .env.*.local
```

### Production Environment

#### Option 1: Hardware Wallet (Recommended)
- Use Ledger or Trezor
- Never expose private key
- Sign transactions on device

#### Option 2: Cloud KMS
```javascript
// AWS KMS Example
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

const kmsClient = new KMSClient({ region: "us-east-1" });

async function signWithKMS(message) {
  const command = new SignCommand({
    KeyId: process.env.KMS_KEY_ID,
    Message: Buffer.from(message),
    SigningAlgorithm: "ECDSA_SHA_256"
  });
  
  return await kmsClient.send(command);
}
```

#### Option 3: Secure Enclave
- Use AWS Secrets Manager
- Use GCP Secret Manager
- Use Azure Key Vault

## 🚨 What to Do If Key is Exposed

### Immediate Actions:

1. **Stop Using Compromised Wallet**
   ```bash
   # DO NOT send any more funds to this address
   ```

2. **Transfer Assets (if any)**
   ```bash
   # Create new wallet first
   node scripts/generate-keys.js
   
   # Transfer all assets from old to new wallet
   # Use MetaMask or web3 script
   ```

3. **Rotate All Keys**
   ```bash
   # Generate new keys
   node scripts/generate-keys.js
   
   # Update .env files
   # Re-deploy contracts if needed
   ```

4. **Revoke API Keys**
   - PolygonScan: https://polygonscan.com/myapikey
   - Alchemy: https://dashboard.alchemy.com/
   - Pinata: https://app.pinata.cloud/keys

5. **Monitor Wallet**
   - Check for unauthorized transactions
   - Set up alerts on Etherscan/PolygonScan

## 📝 Environment Variables Checklist

### Required for Contracts
```env
# Network RPC (can be public)
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# SENSITIVE - Never share!
PRIVATE_KEY=your_private_key_here

# Public address (safe to share)
AI_SIGNER_ADDRESS=0x...

# API Key (sensitive)
POLYGONSCAN_API_KEY=your_api_key
```

### Required for AI Engine
```env
# SENSITIVE - Never share!
AI_SIGNER_PRIVATE_KEY=your_private_key_here

# Contract address (public)
CONTRACT_ADDRESS=0x...

# API Keys (sensitive)
PINATA_API_KEY=your_key
OPENAI_API_KEY=your_key
```

## 🔍 Security Audit Checklist

### Before Deployment
- [ ] All .env files in .gitignore
- [ ] No hardcoded keys in code
- [ ] No keys in git history
- [ ] Separate dev/prod wallets
- [ ] Test wallet has minimal funds
- [ ] Smart contract audited
- [ ] Rate limiting enabled
- [ ] Monitoring set up

### After Deployment
- [ ] Verify contract on PolygonScan
- [ ] Test all functions
- [ ] Monitor transactions
- [ ] Set up alerts
- [ ] Document deployment
- [ ] Backup keys securely
- [ ] Update documentation

## 🛠️ Security Tools

### 1. Check Git History for Secrets
```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Scan repository
git secrets --scan-history
```

### 2. Environment Variable Validation
```javascript
// validate-env.js
const required = [
  'PRIVATE_KEY',
  'AI_SIGNER_ADDRESS',
  'POLYGONSCAN_API_KEY'
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

console.log('✅ All required environment variables present');
```

### 3. Wallet Monitoring
```javascript
// monitor-wallet.js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
const address = process.env.AI_SIGNER_ADDRESS;

// Check balance
const balance = await provider.getBalance(address);
console.log('Balance:', ethers.formatEther(balance), 'MATIC');

// Monitor transactions
provider.on('block', async (blockNumber) => {
  const block = await provider.getBlock(blockNumber);
  // Check for transactions to/from your address
});
```

## 📚 Additional Resources

### Documentation
- [Ethereum Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OWASP Crypto Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Web3 Security Guide](https://www.web3.university/tracks/security)

### Tools
- [Slither](https://github.com/crytic/slither) - Smart contract analyzer
- [MythX](https://mythx.io/) - Security analysis platform
- [OpenZeppelin Defender](https://defender.openzeppelin.com/) - Security operations

### Hardware Wallets
- [Ledger](https://www.ledger.com/)
- [Trezor](https://trezor.io/)
- [GridPlus Lattice1](https://gridplus.io/)

## 🆘 Emergency Contacts

If you suspect a security breach:

1. **Stop all operations immediately**
2. **Secure remaining assets**
3. **Document the incident**
4. **Contact security team**
5. **Review and improve security**

## 💡 Remember

> "The best security is prevention. Never expose your private keys, 
> always use secure key management, and regularly audit your security practices."

---

**Stay Safe! 🔐**
