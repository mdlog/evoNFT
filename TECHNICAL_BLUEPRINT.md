# 🏗️ EvoNFT Technical Blueprint - MVP Implementation

## 📋 Overview

Smart NFTs yang dapat berevolusi berdasarkan AI-driven off-chain signals, dibangun di Polygon network.

## 🎯 MVP Scope

- ✅ ERC-721 NFT dengan metadata dinamis
- ✅ Evolusi dipicu oleh AI Engine off-chain
- ✅ EIP-712 signature untuk keamanan
- ✅ IPFS/Pinata untuk metadata storage
- ✅ Polygon Mumbai testnet → Polygon PoS mainnet

## 🏛️ Arsitektur

```
┌─────────────┐
│   Users     │
│  (Wallets)  │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│         Frontend (Next.js + wagmi)          │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│      Polygon Network (Mumbai / PoS)         │
│  ┌────────────────────────────────────┐    │
│  │  EvolvableNFT Smart Contract      │    │
│  │  - ERC-721 + Evolution Logic      │    │
│  │  - EIP-712 Signature Verification │    │
│  └────────────────────────────────────┘    │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│         IPFS / Pinata Storage               │
│         (Metadata + Images)                 │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│         AI Engine (Off-chain)               │
│  ┌────────────────────────────────────┐    │
│  │  Data Ingestor                     │    │
│  │  - Alchemy/Covalent/TheGraph       │    │
│  │  - Discord/Twitter APIs            │    │
│  ├────────────────────────────────────┤    │
│  │  Evolution Logic                   │    │
│  │  - ML/Rules Engine                 │    │
│  │  - OpenAI/LLM Integration          │    │
│  ├────────────────────────────────────┤    │
│  │  Signer Module                     │    │
│  │  - EIP-712 Signing                 │    │
│  │  - KMS/HSM Integration             │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 📝 Smart Contract Design

### Core Contract: EvolvableNFT.sol

**Inheritance:**
- ERC721URIStorage (OpenZeppelin)
- Ownable (OpenZeppelin)
- EIP712 (OpenZeppelin)

**Key Storage:**
```solidity
mapping(uint256 => string) tokenURI;        // IPFS pointer
mapping(uint256 => uint256) version;        // Evolution version
mapping(uint256 => uint256) lastEvolvedAt;  // Timestamp
mapping(uint256 => uint256) nonces;         // Anti-replay
address public aiSigner;                     // Authorized signer
uint256 public cooldown = 1 days;           // Evolution cooldown
```

**Key Functions:**
```solidity
// Minting
function mint(address to, string memory uri) external payable returns (uint256)
function batchMint(address[] calldata recipients, string[] calldata uris) external onlyOwner

// Evolution
function requestEvolve(
    uint256 tokenId,
    string calldata newURI,
    uint256 deadline,
    bytes calldata signature
) external

// Admin
function setAISigner(address _newSigner) external onlyOwner
function setCooldown(uint256 _newCooldown) external onlyOwner

// Views
function getEvolutionInfo(uint256 tokenId) external view returns (...)
function canEvolve(uint256 tokenId) external view returns (bool)
```

**Security Features:**
- ✅ EIP-712 signature verification
- ✅ Nonce-based replay protection
- ✅ Cooldown mechanism
- ✅ Deadline expiration
- ✅ Admin controls

## 🤖 AI Engine Architecture

### Components

#### 1. Data Ingestor
```javascript
// On-chain signals
- Transaction count (via Alchemy/Covalent)
- Staking duration
- Trading volume
- Token holdings

// Off-chain signals
- Discord activity (via webhooks)
- Twitter mentions (via API)
- Community engagement
```

#### 2. Evolution Logic
```javascript
calculateEvolutionScore(signals) {
  score = 0
  score += min(transactionCount * 2, 30)
  score += min(stakingDays * 3, 30)
  score += min(tradingVolume / 100, 20)
  score += min(discordActivity, 10)
  score += min(twitterMentions, 10)
  return min(score, 100)
}

determineEvolutionType(score) {
  if (score >= 90) return 'legendary'
  if (score >= 70) return 'epic'
  if (score >= 50) return 'rare'
  return 'common'
}
```

#### 3. Metadata Generation
```javascript
{
  "name": "EvoNFT #123",
  "description": "AI-generated description",
  "image": "ipfs://Qm.../image_v2.png",
  "attributes": [
    {"trait_type": "level", "value": 2},
    {"trait_type": "rarity", "value": "epic"},
    {"trait_type": "strength", "value": 15},
    {"trait_type": "intelligence", "value": 12}
  ],
  "version": 2,
  "evolutionType": "epic",
  "lastUpdated": 1712345678,
  "evolutionHistory": [...]
}
```

#### 4. EIP-712 Signing
```javascript
const domain = {
  name: 'EvoNFT',
  version: '1',
  chainId: 80001,
  verifyingContract: contractAddress
}

const types = {
  EvolveRequest: [
    { name: 'tokenId', type: 'uint256' },
    { name: 'newURI', type: 'string' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

const signature = await wallet.signTypedData(domain, types, value)
```

## 🔐 Security Measures

### On-Chain
- ✅ EIP-712 signature verification
- ✅ Nonce-based replay protection
- ✅ Cooldown per token (default: 24 hours)
- ✅ Deadline expiration (1 hour)
- ✅ Admin-only signer rotation

### Off-Chain
- ✅ Private key in KMS/HSM
- ✅ Rate limiting (100 req/15min)
- ✅ Network access restrictions
- ✅ Audit logging
- ✅ Error monitoring (Sentry)

### Best Practices
- Never commit private keys
- Use environment variables
- Implement circuit breakers
- Monitor gas prices
- Set up alerts

## 💰 Gas Optimization

### Strategies
1. **Minimal On-Chain Storage**
   - Store only IPFS CID (32 bytes)
   - Metadata off-chain

2. **Batch Operations**
   - Batch minting
   - Batch evolution (with caution)

3. **Polygon Benefits**
   - Low gas fees (~$0.001 per tx)
   - Fast confirmations (~2 seconds)

### Cost Estimates (Polygon)
- Mint: ~0.001 MATIC
- Evolve: ~0.0015 MATIC
- Batch (10): ~0.008 MATIC

## 📦 Deployment Checklist

### Pre-Deployment
- [ ] Audit smart contracts
- [ ] Test on Mumbai testnet
- [ ] Set up monitoring
- [ ] Configure KMS for AI signer
- [ ] Prepare IPFS/Pinata
- [ ] Set up frontend

### Deployment Steps
1. Deploy EvolvableNFT to Mumbai
2. Verify contract on PolygonScan
3. Deploy AI Engine backend
4. Configure environment variables
5. Test end-to-end flow
6. Deploy to Polygon mainnet
7. Update frontend config

### Post-Deployment
- [ ] Monitor transactions
- [ ] Track gas usage
- [ ] Set up alerts
- [ ] Document API
- [ ] Create user guide

## 🧪 Testing Strategy

### Smart Contract Tests
```bash
# Unit tests
npx hardhat test

# Coverage
npx hardhat coverage

# Gas report
REPORT_GAS=true npx hardhat test
```

### AI Engine Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

### E2E Tests
1. Mint NFT
2. Trigger evolution signals
3. AI Engine processes
4. Verify on-chain update
5. Check metadata update

## 📊 Monitoring & Analytics

### Metrics to Track
- Total NFTs minted
- Evolution success rate
- Average evolution time
- Gas costs
- API response times
- Error rates

### Tools
- Grafana + Prometheus
- Sentry (error tracking)
- Alchemy webhooks
- Custom dashboard

## 🚀 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic evolution logic
- ✅ EIP-712 security
- ✅ IPFS storage
- ✅ Simple AI rules

### Phase 2: Enhanced
- [ ] AI image generation
- [ ] Advanced ML models
- [ ] Social integrations
- [ ] Gamification

### Phase 3: Scale
- [ ] Cross-chain support
- [ ] DAO governance
- [ ] Marketplace
- [ ] Mobile app

## 📚 Resources

### Documentation
- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin](https://docs.openzeppelin.com/)
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [Polygon Docs](https://docs.polygon.technology/)

### APIs
- [Alchemy](https://docs.alchemy.com/)
- [Pinata](https://docs.pinata.cloud/)
- [OpenAI](https://platform.openai.com/docs)

## 💡 Tips & Best Practices

1. **Start Small**: Test thoroughly on testnet
2. **Monitor Everything**: Set up comprehensive logging
3. **Secure Keys**: Use KMS/HSM for production
4. **Rate Limit**: Prevent abuse
5. **Document**: Keep docs updated
6. **Community**: Engage early adopters

## 🆘 Troubleshooting

### Common Issues

**Issue**: Signature verification fails
**Solution**: Check domain separator, chainId, and nonce

**Issue**: IPFS upload slow
**Solution**: Use Pinata or dedicated IPFS node

**Issue**: High gas costs
**Solution**: Batch operations, optimize storage

**Issue**: Evolution not triggering
**Solution**: Check cooldown, signals threshold

## 📞 Support

- GitHub Issues
- Discord Community
- Email: support@evonft.io
- Docs: docs.evonft.io

---

**Built with ❤️ on Polygon**
