# 🧬 Evolution AI Backend - Complete Implementation

## ✅ What's Been Implemented

### 1. **Smart Contract** ✅
- `EvolvableNFT.sol` - Base contract with evolution logic
- `EvolvableNFTExtended.sol` - Extended with Feed/Train
- EIP-712 signature verification
- 24-hour cooldown system
- Version tracking

### 2. **AI Backend** ✅
- Express.js API server
- EIP-712 signature generation
- Evolution scoring system
- IPFS metadata upload
- Auto-evolution scheduler
- Health monitoring

### 3. **Frontend Integration** ✅
- Evolution service (`evolutionService.js`)
- Updated NFT Detail page
- "Evolve Now" button with backend integration
- Loading states and error handling

## 🚀 Quick Start

### Step 1: Start AI Backend

```bash
# Terminal 1
cd evonft-ai-engine
npm install
npm run dev
```

Backend akan running di `http://localhost:3001`

### Step 2: Verify Backend Health

```bash
curl http://localhost:3001/api/monitor/health
```

Expected response:
```json
{
  "status": "healthy",
  "blockchain": {
    "connected": true,
    "blockNumber": 12345678
  },
  "aiSigner": {
    "address": "0x...",
    "balance": "0.5",
    "hasBalance": true
  }
}
```

### Step 3: Start Frontend

```bash
# Terminal 2
cd evonft-app
npm run build
```

### Step 4: Serve Frontend

```bash
# Terminal 3 (from project root)
python3 spa-server.py
```

### Step 5: Start Cloudflare Tunnel

```bash
# Terminal 4
sudo cloudflared tunnel --config /tmp/filora-tunnel-config.yml run
```

## 🧪 Testing Evolution

### 1. Via Frontend (Recommended)

1. Go to `https://evonft.xyz` (or `http://localhost:3020`)
2. Connect wallet
3. Go to "My NFTs"
4. Click on an NFT
5. Scroll to "Evolution Status"
6. Click "🧬 Evolve Now" button
7. Confirm transaction in wallet

### 2. Via API (Testing)

```bash
# Request evolution signature
curl -X POST http://localhost:3001/api/evolution/request \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 0,
    "signals": {
      "transactionCount": 30,
      "stakingDays": 20,
      "tradingVolume": 600
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
  "score": 70
}
```

### 3. Check Evolution Status

```bash
curl http://localhost:3001/api/evolution/status/0
```

## 📊 Evolution Scoring System

```javascript
Score Calculation:
- Transaction Count: max 30 points (count * 2)
- Staking Days: max 30 points (days * 3)
- Trading Volume: max 20 points (volume / 100)
- Discord Activity: max 10 points
- Twitter Mentions: max 10 points
Total: max 100 points

Evolution Types:
- 90-100: Legendary (+5 stats)
- 70-89:  Epic (+3 stats)
- 50-69:  Rare (+2 stats)
- 0-49:   Common (+1 stats)
```

## 🔐 Security Setup

### Check AI Signer

```bash
# Get AI signer address from private key
node -e "const ethers = require('ethers'); const wallet = new ethers.Wallet('652c114da7212094d8d9607cc0438ea7b6957d0d8b0a980930e1e7bb4d8f19f4'); console.log(wallet.address)"
```

### Verify Contract AI Signer

```bash
cast call 0xe31d18Fb9925f677451845997f64806a88264b3D "aiSigner()(address)" \
  --rpc-url https://rpc-amoy.polygon.technology
```

**Important**: Kedua address harus sama!

### Update AI Signer (if needed)

```bash
cast send 0xe31d18Fb9925f677451845997f64806a88264b3D \
  "setAISigner(address)" <NEW_AI_SIGNER_ADDRESS> \
  --private-key <OWNER_PRIVATE_KEY> \
  --rpc-url https://rpc-amoy.polygon.technology
```

## 🔄 Evolution Flow

```
User clicks "Evolve Now"
        ↓
Frontend calculates signals (based on NFT stats/level)
        ↓
Frontend calls AI Backend: POST /api/evolution/request
        ↓
Backend checks eligibility (cooldown, score)
        ↓
Backend generates new metadata
        ↓
Backend uploads to IPFS
        ↓
Backend signs EIP-712 message
        ↓
Backend returns: {signature, newURI, deadline}
        ↓
Frontend calls Smart Contract: requestEvolve()
        ↓
Contract verifies signature
        ↓
Contract updates tokenURI and version
        ↓
Evolution complete! 🎉
```

## 📁 File Structure

```
evonft-ai-engine/
├── src/
│   ├── index.js                    # Entry point
│   ├── routes/
│   │   ├── evolution.js            # Evolution endpoints ✅
│   │   └── monitor.js              # Health/monitoring ✅
│   ├── services/
│   │   ├── evolutionEngine.js      # Core logic ✅
│   │   └── scheduler.js            # Auto-evolution ✅
│   └── utils/
│       ├── signer.js               # EIP-712 signing ✅
│       ├── ipfs.js                 # IPFS upload ✅
│       ├── metadata.js             # Metadata generation ✅
│       └── logger.js               # Logging ✅
├── .env                            # Configuration ✅
└── package.json                    # Dependencies ✅

evonft-app/
└── src/
    ├── services/
    │   └── evolutionService.js     # Backend integration ✅
    └── pages/
        └── NFTDetailIntegrated.jsx # Updated with evolve ✅
```

## 🐛 Troubleshooting

### Error: "Backend not responding"

**Check:**
```bash
# Is backend running?
curl http://localhost:3001/health

# Check logs
cd evonft-ai-engine
npm run dev
```

### Error: "Invalid signature"

**Cause**: AI signer mismatch

**Fix**:
1. Check backend AI signer address
2. Check contract AI signer address
3. Update contract if needed (see Security Setup)

### Error: "Cooldown not passed"

**Cause**: NFT evolved recently (24 hour cooldown)

**Options**:
1. Wait 24 hours
2. For testing, reduce cooldown:
```bash
cast send 0xe31d18Fb9925f677451845997f64806a88264b3D \
  "setCooldown(uint256)" 60 \
  --private-key <OWNER_KEY> \
  --rpc-url https://rpc-amoy.polygon.technology
```

### Error: "Insufficient activity score"

**Cause**: Score < 50

**Fix**: Increase signals in request or interact more with NFT (feed/train)

### Error: "CORS error"

**Fix**: Backend already has CORS enabled. Check if backend is running.

## 🎯 Next Steps

### Phase 1: Basic Evolution ✅
- [x] Backend API
- [x] EIP-712 signing
- [x] Frontend integration
- [x] Basic metadata generation

### Phase 2: AI Image Generation (Optional)
- [ ] Integrate Stable Diffusion API
- [ ] Or DALL-E API
- [ ] Or Midjourney API
- [ ] Generate unique evolved images

### Phase 3: Advanced Features
- [ ] Real activity tracking (on-chain events)
- [ ] Discord/Twitter integration
- [ ] Evolution history visualization
- [ ] Rarity-based evolution paths

### Phase 4: Production
- [ ] Deploy backend to VPS/Cloud
- [ ] Setup monitoring (Sentry, DataDog)
- [ ] Add rate limiting
- [ ] Secure private key (AWS KMS)
- [ ] Setup CI/CD

## 📚 API Documentation

### POST /api/evolution/request
Request evolution signature for a token.

**Request:**
```json
{
  "tokenId": 0,
  "signals": {
    "transactionCount": 30,
    "stakingDays": 20,
    "tradingVolume": 600
  }
}
```

**Response:**
```json
{
  "success": true,
  "tokenId": 0,
  "newMetadataURI": "ipfs://Qm...",
  "signature": "0x...",
  "deadline": 1234567890,
  "nonce": "0",
  "evolutionType": "rare",
  "score": 70,
  "newMetadata": { ... }
}
```

### GET /api/evolution/status/:tokenId
Get evolution status for a token.

**Response:**
```json
{
  "tokenId": "0",
  "version": "1",
  "lastEvolved": "1234567890",
  "nextEvolveTime": "1234653890",
  "nonce": "0",
  "canEvolve": false,
  "cooldownRemaining": 86400
}
```

### GET /api/monitor/health
Check backend health.

**Response:**
```json
{
  "status": "healthy",
  "blockchain": {
    "connected": true,
    "blockNumber": 12345678
  },
  "aiSigner": {
    "address": "0x...",
    "balance": "0.5"
  }
}
```

## 🎉 Success Criteria

Evolution is working when:
- ✅ Backend health check returns "healthy"
- ✅ Frontend shows "Evolve Now" button
- ✅ Clicking button triggers backend request
- ✅ Backend returns signature
- ✅ Smart contract accepts signature
- ✅ NFT version increases
- ✅ Metadata updates

## 🆘 Support

Need help? Check:
1. Backend logs: `cd evonft-ai-engine && npm run dev`
2. Frontend console: Browser DevTools
3. Smart contract events: Polygonscan
4. This documentation

Still stuck? Provide:
- Error message
- Backend logs
- Frontend console logs
- Transaction hash (if any)
