# EvoNFT AI Engine

AI-powered evolution engine untuk EvoNFT smart contracts.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
PORT=3001
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=0x_your_contract_address
AI_SIGNER_PRIVATE_KEY=your_private_key
PINATA_API_KEY=your_pinata_key
OPENAI_API_KEY=your_openai_key
```

### Run

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## 🏗️ Architecture

```
AI Engine
├── Data Ingestor
│   ├── On-chain signals (Alchemy/Covalent)
│   └── Off-chain signals (Discord/Twitter)
├── Evolution Logic
│   ├── Score calculation
│   ├── Evolution type determination
│   └── Metadata generation
├── IPFS Integration
│   ├── Metadata upload
│   └── Image storage
└── Signer Module
    ├── EIP-712 signing
    └── Transaction submission
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Manual Evolution Trigger
```bash
POST /api/evolution/trigger
Content-Type: application/json

{
  "tokenId": 123,
  "signals": {
    "transactionCount": 50,
    "stakingDays": 30,
    "tradingVolume": 1000,
    "discordActivity": 8,
    "twitterMentions": 5
  }
}
```

### Check Evolution Status
```bash
GET /api/evolution/status/:tokenId
```

### Get Evolution History
```bash
GET /api/evolution/history/:tokenId
```

## 🤖 Evolution Logic

### Score Calculation

```javascript
score = 0
score += min(transactionCount * 2, 30)  // Max 30 points
score += min(stakingDays * 3, 30)       // Max 30 points
score += min(tradingVolume / 100, 20)   // Max 20 points
score += min(discordActivity, 10)       // Max 10 points
score += min(twitterMentions, 10)       // Max 10 points
total = min(score, 100)
```

### Evolution Types

| Score | Type | Stat Boost |
|-------|------|------------|
| 90-100 | Legendary | +5 |
| 70-89 | Epic | +3 |
| 50-69 | Rare | +2 |
| 0-49 | Common | +1 |

### Metadata Generation

```json
{
  "name": "EvoNFT #123",
  "description": "AI-generated description",
  "image": "ipfs://Qm.../image.png",
  "attributes": [
    {"trait_type": "level", "value": 5},
    {"trait_type": "rarity", "value": "epic"},
    {"trait_type": "strength", "value": 15},
    {"trait_type": "intelligence", "value": 12},
    {"trait_type": "speed", "value": 18}
  ],
  "version": 5,
  "evolutionType": "epic",
  "lastUpdated": 1712345678,
  "evolutionHistory": [...]
}
```

## 🔐 Security

### Private Key Management
- **Development**: Use `.env` file (NEVER commit!)
- **Production**: Use AWS KMS / GCP KMS / Azure Key Vault

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable via environment variables

### Signature Security
- EIP-712 typed data signing
- Nonce-based replay protection
- 1-hour signature expiration

## 📊 Monitoring

### Logs
Logs disimpan di folder `logs/`:
- `combined.log` - All logs
- `error.log` - Error logs only

### Metrics
- Evolution success rate
- Average processing time
- IPFS upload time
- Transaction confirmation time

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Load tests
npm run test:load
```

## 🔄 Background Scheduler

AI Engine menjalankan background job untuk:
- Scan eligible tokens (setiap 1 jam)
- Process pending evolutions
- Retry failed transactions
- Clean up old data

Configure via environment:
```env
EVOLUTION_CHECK_INTERVAL=3600000  # 1 hour in ms
BATCH_SIZE=10
```

## 🛠️ Development

### Project Structure
```
src/
├── index.js              # Entry point
├── routes/
│   ├── evolution.js      # Evolution endpoints
│   └── monitor.js        # Monitoring endpoints
├── services/
│   ├── evolutionEngine.js  # Core evolution logic
│   ├── dataIngestor.js     # Data collection
│   └── scheduler.js        # Background jobs
└── utils/
    ├── signer.js         # EIP-712 signing
    ├── ipfs.js           # IPFS integration
    ├── metadata.js       # Metadata generation
    └── logger.js         # Logging utility
```

### Adding New Data Sources

1. Create new ingestor in `services/dataIngestor.js`
2. Add to score calculation in `evolutionEngine.js`
3. Update metadata generation logic
4. Test thoroughly

## 🚨 Troubleshooting

### Common Issues

**Issue**: Signature verification fails
```
Solution: Check that AI_SIGNER_PRIVATE_KEY matches the aiSigner address in contract
```

**Issue**: IPFS upload timeout
```
Solution: Use Pinata instead of public IPFS gateway
Set PINATA_API_KEY and PINATA_SECRET_KEY
```

**Issue**: Transaction fails with "cooldown not passed"
```
Solution: Check lastEvolvedAt timestamp, wait for cooldown period
```

**Issue**: Out of gas
```
Solution: Increase gas limit or check gas price
```

## 📚 Resources

- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata API](https://docs.pinata.cloud/)
- [OpenAI API](https://platform.openai.com/docs)
- [Ethers.js](https://docs.ethers.org/)

## 📄 License

MIT
