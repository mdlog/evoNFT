# EvoNFT AI Engine - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd evonft-ai-engine
npm install
```

### 2. Configuration

File `.env` sudah dikonfigurasi untuk Polygon Amoy testnet:

```env
PORT=3001
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0xe31d18Fb9925f677451845997f64806a88264b3D
AI_SIGNER_PRIVATE_KEY=652c114da7212094d8d9607cc0438ea7b6957d0d8b0a980930e1e7bb4d8f19f4
CHAIN_ID=80002
```

**Important**: AI Signer address harus sama dengan `aiSigner` yang di-set di smart contract!

### 3. Verify AI Signer

Check AI signer address:

```bash
node -e "const ethers = require('ethers'); const wallet = new ethers.Wallet('652c114da7212094d8d9607cc0438ea7b6957d0d8b0a980930e1e7bb4d8f19f4'); console.log('AI Signer:', wallet.address)"
```

Expected output: `0x3e358...` (harus match dengan contract's aiSigner)

### 4. Start Backend

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Backend akan running di `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Request Evolution Signature
```bash
curl -X POST http://localhost:3001/api/evolution/request \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 0,
    "signals": {
      "transactionCount": 25,
      "stakingDays": 15,
      "tradingVolume": 500
    }
  }'
```

Response:
```json
{
  "success": true,
  "tokenId": 0,
  "newMetadataURI": "ipfs://Qm...",
  "signature": "0x...",
  "deadline": 1234567890,
  "nonce": "0",
  "evolutionType": "rare",
  "score": 65
}
```

### Check Evolution Status
```bash
curl http://localhost:3001/api/evolution/status/0
```

### Check Eligibility
```bash
curl http://localhost:3001/api/evolution/check/0
```

### Detailed Health Check
```bash
curl http://localhost:3001/api/monitor/health
```

## 🔗 Frontend Integration

Update frontend untuk call backend API:

```javascript
// evonft-app/src/services/evolutionService.js

const BACKEND_URL = 'http://localhost:3001';

export async function requestEvolution(tokenId, signals = {}) {
  const response = await fetch(`${BACKEND_URL}/api/evolution/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId, signals })
  });
  
  return await response.json();
}

export async function checkEvolutionStatus(tokenId) {
  const response = await fetch(`${BACKEND_URL}/api/evolution/status/${tokenId}`);
  return await response.json();
}
```

## 🧪 Testing

### Test Evolution Request

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Test request
curl -X POST http://localhost:3001/api/evolution/request \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 0, "signals": {"transactionCount": 30}}'
```

### Test with Frontend

1. Start backend: `npm run dev`
2. Start frontend: `cd ../evonft-app && npm run dev`
3. Go to NFT detail page
4. Click "Evolve Now" button
5. Check console for API calls

## 🔐 Security Notes

### Private Key Security

**Development:**
- ✅ Use `.env` file (already configured)
- ❌ NEVER commit `.env` to git

**Production:**
- Use environment variables
- Or use AWS KMS / GCP Secret Manager
- Rotate keys regularly

### AI Signer Setup

The AI signer must be set in the smart contract:

```solidity
// Check current AI signer
await contract.aiSigner()

// Update AI signer (only owner)
await contract.setAISigner("0x_new_signer_address")
```

## 🐛 Troubleshooting

### Error: "Invalid signature"

**Cause**: AI signer address doesn't match contract's aiSigner

**Fix**:
```bash
# Check contract's AI signer
cast call $CONTRACT_ADDRESS "aiSigner()(address)" --rpc-url $RPC_URL

# Update if needed (as contract owner)
cast send $CONTRACT_ADDRESS "setAISigner(address)" $AI_SIGNER_ADDRESS \
  --private-key $OWNER_PRIVATE_KEY --rpc-url $RPC_URL
```

### Error: "Cooldown not passed"

**Cause**: NFT evolved recently, must wait 24 hours

**Fix**: Wait for cooldown or update cooldown in contract (testing only):
```bash
cast send $CONTRACT_ADDRESS "setCooldown(uint256)" 60 \
  --private-key $OWNER_PRIVATE_KEY --rpc-url $RPC_URL
```

### Error: "Insufficient payment"

**Cause**: AI signer doesn't have enough MATIC for gas

**Fix**: Send MATIC to AI signer address:
```bash
cast send $AI_SIGNER_ADDRESS --value 0.1ether \
  --private-key $YOUR_PRIVATE_KEY --rpc-url $RPC_URL
```

### IPFS Upload Fails

**Cause**: IPFS not configured

**Fix**: For development, backend uses mock IPFS URIs. For production:

1. Get Pinata API keys: https://pinata.cloud
2. Add to `.env`:
```env
PINATA_API_KEY=your_key
PINATA_SECRET_KEY=your_secret
```

## 📊 Monitoring

### Check Backend Health
```bash
curl http://localhost:3001/api/monitor/health
```

### View Logs
```bash
# Development
npm run dev  # Logs to console

# Production
tail -f logs/combined.log
tail -f logs/error.log
```

### Check AI Signer Balance
```bash
cast balance $AI_SIGNER_ADDRESS --rpc-url $RPC_URL
```

## 🚀 Production Deployment

### Option 1: VPS (DigitalOcean, AWS EC2, etc.)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd evonft-ai-engine
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Run with PM2
npm install -g pm2
pm2 start src/index.js --name evonft-ai-engine
pm2 save
pm2 startup
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
docker build -t evonft-ai-engine .
docker run -d -p 3001:3001 --env-file .env evonft-ai-engine
```

### Option 3: Serverless (AWS Lambda, Vercel, etc.)

Use serverless framework or deploy as API routes.

## 🔄 Auto-Evolution Scheduler

Backend automatically scans for eligible NFTs every hour (configurable).

To disable auto-evolution:
```env
EVOLUTION_CHECK_INTERVAL=0
```

To change interval:
```env
EVOLUTION_CHECK_INTERVAL=1800000  # 30 minutes
```

## 📚 Next Steps

1. ✅ Backend running
2. ✅ Test evolution request
3. ⏭️ Integrate with frontend
4. ⏭️ Add AI image generation (optional)
5. ⏭️ Deploy to production

## 🆘 Support

Issues? Check:
- Backend logs
- Frontend console
- Smart contract events
- Network connectivity

Still stuck? Create an issue with:
- Error message
- Request/response logs
- Contract address
- Network (Amoy/Mainnet)
