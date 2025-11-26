# 🔷 Polygon Amoy Testnet Setup Guide

Polygon Amoy adalah testnet terbaru yang menggantikan Mumbai testnet.

## 🌐 Network Details

| Parameter | Value |
|-----------|-------|
| Network Name | Polygon Amoy Testnet |
| RPC URL | https://rpc-amoy.polygon.technology |
| Chain ID | 80002 |
| Currency Symbol | MATIC |
| Block Explorer | https://amoy.polygonscan.com |

## 🦊 Add to MetaMask

### Method 1: Manual

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Fill in details:
   - **Network Name**: Polygon Amoy Testnet
   - **RPC URL**: `https://rpc-amoy.polygon.technology`
   - **Chain ID**: `80002`
   - **Currency Symbol**: `MATIC`
   - **Block Explorer**: `https://amoy.polygonscan.com`
5. Click "Save"

### Method 2: Automatic

Visit: https://chainlist.org/chain/80002

Click "Add to MetaMask"

## 💰 Get Testnet MATIC

### Faucet Options:

1. **Official Polygon Faucet**
   - URL: https://faucet.polygon.technology/
   - Select "Polygon Amoy"
   - Paste your address: `0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4`
   - Complete CAPTCHA
   - Receive 0.5 MATIC

2. **Alchemy Faucet**
   - URL: https://www.alchemy.com/faucets/polygon-amoy
   - Login with Alchemy account
   - Request testnet MATIC

3. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/polygon/amoy
   - Connect wallet
   - Request tokens

## 🔍 Block Explorers

### Amoy PolygonScan
- URL: https://amoy.polygonscan.com
- View transactions, contracts, tokens
- Verify smart contracts

### Alternative Explorers
- OKLink: https://www.oklink.com/amoy
- BlockScout: https://polygon-amoy.blockscout.com

## 🔗 RPC Endpoints

### Public RPCs (Free)
```
https://rpc-amoy.polygon.technology
https://polygon-amoy.g.alchemy.com/v2/demo
https://rpc.ankr.com/polygon_amoy
```

### Private RPCs (Recommended for Production)
- **Alchemy**: https://dashboard.alchemy.com/
- **Infura**: https://infura.io/
- **QuickNode**: https://www.quicknode.com/

## 📊 Network Stats

- **Block Time**: ~2 seconds
- **Gas Price**: ~30 Gwei
- **Finality**: ~128 blocks (~4 minutes)

## 🔧 Configuration Files

### Hardhat Config
```javascript
amoy: {
  url: "https://rpc-amoy.polygon.technology",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 80002,
  gasPrice: 30000000000
}
```

### Ethers.js
```javascript
const provider = new ethers.JsonRpcProvider(
  "https://rpc-amoy.polygon.technology"
);
```

### Web3.js
```javascript
const web3 = new Web3(
  "https://rpc-amoy.polygon.technology"
);
```

## 🚀 Deploy to Amoy

```bash
# Compile contracts
npx hardhat compile

# Deploy to Amoy
npx hardhat run scripts/deploy.js --network amoy

# Verify contract
npx hardhat verify --network amoy <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🧪 Testing

### Check Balance
```bash
node scripts/check-balance.js
```

### Send Test Transaction
```bash
npx hardhat run scripts/test-transaction.js --network amoy
```

## 📝 Important Notes

### Mumbai → Amoy Migration
- Mumbai testnet deprecated (October 2024)
- All projects should migrate to Amoy
- Contracts need to be redeployed
- Update all RPC URLs and Chain IDs

### Differences from Mumbai
- New Chain ID: 80002 (was 80001)
- New RPC endpoints
- New block explorer
- Same gas token (MATIC)

### Best Practices
- Use private RPC for production
- Monitor gas prices
- Set appropriate gas limits
- Test thoroughly before mainnet

## 🔐 Security

### Testnet vs Mainnet
- ✅ Testnet MATIC has no value
- ✅ Safe for testing and development
- ⚠️ Still protect private keys
- ⚠️ Don't reuse mainnet keys

### Rate Limits
- Public RPCs have rate limits
- Use private RPC for heavy usage
- Implement retry logic
- Cache responses when possible

## 🆘 Troubleshooting

### Issue: "Network not found"
**Solution**: Add Amoy network to MetaMask manually

### Issue: "Insufficient funds"
**Solution**: Get testnet MATIC from faucet

### Issue: "Transaction underpriced"
**Solution**: Increase gas price to 30+ Gwei

### Issue: "Nonce too low"
**Solution**: Reset MetaMask account or wait for pending tx

## 📚 Resources

### Official Documentation
- Polygon Docs: https://docs.polygon.technology/
- Amoy Testnet: https://polygon.technology/blog/introducing-the-amoy-testnet

### Developer Tools
- Hardhat: https://hardhat.org/
- Ethers.js: https://docs.ethers.org/
- OpenZeppelin: https://docs.openzeppelin.com/

### Community
- Discord: https://discord.gg/polygon
- Forum: https://forum.polygon.technology/
- Twitter: https://twitter.com/0xPolygon

## ✅ Checklist

Before deploying to Amoy:
- [ ] MetaMask configured with Amoy network
- [ ] Wallet funded with testnet MATIC
- [ ] .env file updated with Amoy RPC
- [ ] Chain ID set to 80002
- [ ] Contracts compiled successfully
- [ ] Tests passing
- [ ] Gas price configured

---

**Ready to deploy on Polygon Amoy! 🚀**
