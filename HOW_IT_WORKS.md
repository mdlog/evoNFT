# ⚙️ EvoNFT - How It Works (Technical Deep Dive)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ MetaMask │  │  Mobile  │  │  Desktop │  │   Web3   │  │
│  │  Wallet  │  │  Wallet  │  │  Browser │  │   Apps   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────────┼─────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                    FRONTEND LAYER                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │  React + Vite Application                          │   │
│  │  ├─ Web3 Integration (ethers.js)                   │   │
│  │  ├─ State Management (Context API)                 │   │
│  │  ├─ UI Components (Tailwind + Framer Motion)       │   │
│  │  └─ Contract Interactions                          │   │
│  └────────────────────┬───────────────────────────────┘   │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                 BLOCKCHAIN LAYER                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Polygon Amoy Testnet (Chain ID: 80002)           │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │  EvolvableNFT Smart Contract                 │ │   │
│  │  │  ├─ ERC-721 Standard                         │ │   │
│  │  │  ├─ Evolution Logic                          │ │   │
│  │  │  ├─ EIP-712 Signature Verification           │ │   │
│  │  │  ├─ Cooldown Mechanism                       │ │   │
│  │  │  └─ Event Emission                           │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └────────────────────┬───────────────────────────────┘   │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                   STORAGE LAYER                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  IPFS / Pinata                                     │   │
│  │  ├─ NFT Metadata (JSON)                           │   │
│  │  ├─ Images (PNG/SVG/WebP)                         │   │
│  │  └─ Evolution History                             │   │
│  └────────────────────┬───────────────────────────────┘   │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                  AI ENGINE LAYER                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Node.js Backend (Express)                         │   │
│  │  ├─ Data Ingestor                                  │   │
│  │  │  ├─ On-chain: Alchemy/Covalent                 │   │
│  │  │  └─ Off-chain: Discord/Twitter APIs            │   │
│  │  ├─ Evolution Engine                               │   │
│  │  │  ├─ Score Calculation                          │   │
│  │  │  ├─ Eligibility Check                          │   │
│  │  │  └─ Evolution Type Determination               │   │
│  │  ├─ Metadata Generator                             │   │
│  │  │  ├─ OpenAI Integration (descriptions)          │   │
│  │  │  ├─ Attribute Generation                       │   │
│  │  │  └─ Image Generation (future)                  │   │
│  │  ├─ IPFS Uploader                                  │   │
│  │  └─ Signer Module (EIP-712)                        │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## 🔄 Complete Flow: Mint to Evolution

### Phase 1: Minting

```
User Action:
  Click "Mint NFT" → Pay 0.01 MATIC
       ↓
Frontend:
  1. Connect to contract
  2. Call mint(address, uri)
  3. Send transaction
       ↓
Smart Contract:
  1. Receive payment ✓
  2. Check max supply ✓
  3. Increment tokenId
  4. _safeMint(to, tokenId)
  5. _setTokenURI(tokenId, uri)
  6. Set version[tokenId] = 1
  7. Set lastEvolvedAt[tokenId] = now
  8. Emit Minted event
       ↓
Blockchain:
  1. Process transaction
  2. Update state
  3. Emit events
  4. Confirm (~2 seconds)
       ↓
Frontend:
  1. Listen for Minted event
  2. Update UI
  3. Show success message
  4. Redirect to NFT detail
       ↓
Result:
  ✅ NFT created with ID
  ✅ Metadata on IPFS
  ✅ Owned by user
  ✅ Visible in wallet
```

### Phase 2: Activity Monitoring

```
Background Process (AI Engine):
  Every 1 hour:
    ↓
  1. Scan blockchain for NFT holders
  2. For each NFT:
       ↓
     Get on-chain data:
       ├─ Transaction count (Alchemy API)
       ├─ Token holdings (Covalent API)
       ├─ Staking duration (Contract call)
       └─ Trading volume (DEX APIs)
       ↓
     Get off-chain data:
       ├─ Discord messages (Discord API)
       ├─ Twitter mentions (Twitter API)
       └─ Community engagement
       ↓
     Calculate evolution score:
       score = 0
       score += min(txCount * 2, 30)
       score += min(stakingDays * 3, 30)
       score += min(volume / 100, 20)
       score += min(discordActivity, 10)
       score += min(twitterMentions, 10)
       total = min(score, 100)
       ↓
     Check eligibility:
       IF score >= 50 AND cooldown passed:
         → Add to evolution queue
       ELSE:
         → Skip for now
       ↓
  3. Process evolution queue
  4. Log results
  5. Sleep until next cycle
```

### Phase 3: Evolution Trigger

```
AI Engine (for eligible NFT):
  ↓
1. Fetch current metadata from IPFS
   GET ipfs://{CID}
   ↓
2. Determine evolution type
   IF score >= 90: type = "legendary"
   ELSE IF score >= 70: type = "epic"
   ELSE IF score >= 50: type = "rare"
   ↓
3. Generate new metadata
   ├─ Increment version
   ├─ Update level (+1)
   ├─ Increase stats (based on type)
   ├─ Add new traits
   ├─ Generate AI description (OpenAI)
   └─ Create/update image
   ↓
4. Upload to IPFS
   POST to Pinata API
   → Get new CID
   → newURI = ipfs://{newCID}
   ↓
5. Prepare evolution request
   data = {
     tokenId: 123,
     newURI: "ipfs://Qm...",
     nonce: currentNonce,
     deadline: now + 1 hour
   }
   ↓
6. Sign with EIP-712
   domain = {
     name: "EvoNFT",
     version: "1",
     chainId: 80002,
     verifyingContract: contractAddress
   }
   
   types = {
     EvolveRequest: [
       {name: "tokenId", type: "uint256"},
       {name: "newURI", type: "string"},
       {name: "nonce", type: "uint256"},
       {name: "deadline", type: "uint256"}
     ]
   }
   
   signature = wallet.signTypedData(domain, types, data)
   ↓
7. Submit to blockchain
   contract.requestEvolve(
     tokenId,
     newURI,
     deadline,
     signature
   )
   ↓
8. Wait for confirmation
   ↓
9. Log success/failure
```

### Phase 4: On-Chain Evolution

```
Smart Contract receives requestEvolve():
  ↓
1. Validate inputs
   require(_exists(tokenId))
   require(block.timestamp <= deadline)
   ↓
2. Check cooldown
   timeSinceLastEvolution = now - lastEvolvedAt[tokenId]
   require(timeSinceLastEvolution >= cooldown)
   ↓
3. Verify EIP-712 signature
   structHash = keccak256(abi.encode(
     EVOLVE_TYPEHASH,
     tokenId,
     keccak256(bytes(newURI)),
     nonces[tokenId],
     deadline
   ))
   
   digest = _hashTypedDataV4(structHash)
   signer = ECDSA.recover(digest, signature)
   
   require(signer == aiSigner) ✓
   ↓
4. Update state
   oldURI = tokenURI(tokenId)
   _setTokenURI(tokenId, newURI)
   version[tokenId]++
   lastEvolvedAt[tokenId] = now
   nonces[tokenId]++
   ↓
5. Emit event
   emit Evolved(
     tokenId,
     oldURI,
     newURI,
     version[tokenId],
     block.timestamp
   )
   ↓
6. Return success
   ↓
Result:
  ✅ NFT evolved
  ✅ Metadata updated
  ✅ Version incremented
  ✅ Event emitted
```

### Phase 5: Frontend Update

```
Frontend (listening for events):
  ↓
1. Detect Evolved event
   contract.on("Evolved", (tokenId, oldURI, newURI, version) => {
     // Handle evolution
   })
   ↓
2. Fetch new metadata
   fetch(newURI.replace("ipfs://", "https://ipfs.io/ipfs/"))
   ↓
3. Update UI
   ├─ Show evolution animation
   ├─ Update NFT image
   ├─ Update level badge
   ├─ Update stats display
   └─ Update traits list
   ↓
4. Show notification
   "🎉 Your NFT has evolved!"
   ↓
5. Update cache
   ↓
6. Refresh collection view
```

## 🔐 Security Mechanisms

### 1. EIP-712 Signature Verification

```solidity
// Domain Separator
bytes32 DOMAIN_SEPARATOR = keccak256(abi.encode(
    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
    keccak256(bytes("EvoNFT")),
    keccak256(bytes("1")),
    80002,
    address(this)
));

// Type Hash
bytes32 EVOLVE_TYPEHASH = keccak256(
    "EvolveRequest(uint256 tokenId,string newURI,uint256 nonce,uint256 deadline)"
);

// Verify
bytes32 structHash = keccak256(abi.encode(
    EVOLVE_TYPEHASH,
    tokenId,
    keccak256(bytes(newURI)),
    nonces[tokenId],
    deadline
));

bytes32 digest = keccak256(abi.encodePacked(
    "\x19\x01",
    DOMAIN_SEPARATOR,
    structHash
));

address signer = ecrecover(digest, v, r, s);
require(signer == aiSigner, "Invalid signature");
```

**Why EIP-712?**
- ✅ Human-readable signatures
- ✅ Replay attack protection
- ✅ Domain separation
- ✅ Type safety

### 2. Nonce-Based Replay Protection

```solidity
mapping(uint256 => uint256) public nonces;

function requestEvolve(...) {
    // Verify signature includes current nonce
    require(verifySignature(tokenId, newURI, nonces[tokenId], ...));
    
    // Increment nonce after use
    nonces[tokenId]++;
}
```

**Prevents:**
- ❌ Reusing old signatures
- ❌ Replay attacks
- ❌ Front-running

### 3. Cooldown Mechanism

```solidity
mapping(uint256 => uint256) public lastEvolvedAt;
uint256 public cooldown = 1 days;

function requestEvolve(...) {
    require(
        block.timestamp >= lastEvolvedAt[tokenId] + cooldown,
        "Cooldown not passed"
    );
    
    lastEvolvedAt[tokenId] = block.timestamp;
}
```

**Prevents:**
- ❌ Spam evolutions
- ❌ Rapid manipulation
- ❌ System abuse

### 4. Deadline Expiration

```solidity
function requestEvolve(uint256 deadline, ...) {
    require(block.timestamp <= deadline, "Signature expired");
}
```

**Prevents:**
- ❌ Stale signatures
- ❌ Long-term signature reuse

## 📊 Data Flow

### Metadata Structure

```json
{
  "name": "EvoNFT #123",
  "description": "A mystical creature that has evolved through countless battles...",
  "image": "ipfs://QmXxx.../image_v5.png",
  "attributes": [
    {
      "trait_type": "level",
      "value": 5
    },
    {
      "trait_type": "rarity",
      "value": "epic"
    },
    {
      "trait_type": "strength",
      "value": 15,
      "max_value": 100
    },
    {
      "trait_type": "intelligence",
      "value": 12,
      "max_value": 100
    },
    {
      "trait_type": "speed",
      "value": 18,
      "max_value": 100
    },
    {
      "trait_type": "trait",
      "value": "Fire Breath"
    },
    {
      "trait_type": "trait",
      "value": "Lightning Speed"
    }
  ],
  "version": 5,
  "evolutionType": "epic",
  "lastUpdated": 1712345678,
  "evolutionHistory": [
    {
      "version": 1,
      "type": "common",
      "timestamp": 1712000000,
      "signals": {...}
    },
    {
      "version": 2,
      "type": "rare",
      "timestamp": 1712100000,
      "signals": {...}
    },
    ...
  ]
}
```

## ⚡ Performance Optimizations

### 1. Gas Optimization

```solidity
// Use uint256 for counters (cheaper than uint8)
uint256 private _tokenIdCounter;

// Pack storage variables
struct TokenInfo {
    uint128 version;      // 16 bytes
    uint128 lastEvolved;  // 16 bytes
}                         // Total: 32 bytes (1 slot)

// Use events for historical data (not storage)
event Evolved(...);

// Batch operations when possible
function batchMint(address[] calldata recipients, ...) external {
    for (uint256 i = 0; i < recipients.length; i++) {
        _mint(recipients[i], ...);
    }
}
```

### 2. Frontend Caching

```javascript
// Cache metadata
const metadataCache = new Map();

async function getMetadata(tokenId) {
    if (metadataCache.has(tokenId)) {
        return metadataCache.get(tokenId);
    }
    
    const uri = await contract.tokenURI(tokenId);
    const metadata = await fetch(uri);
    metadataCache.set(tokenId, metadata);
    
    return metadata;
}

// Invalidate on evolution
contract.on("Evolved", (tokenId) => {
    metadataCache.delete(tokenId);
});
```

### 3. AI Engine Optimization

```javascript
// Batch processing
async function processEvolutions() {
    const eligibleTokens = await getEligibleTokens();
    
    // Process in batches of 10
    for (let i = 0; i < eligibleTokens.length; i += 10) {
        const batch = eligibleTokens.slice(i, i + 10);
        await Promise.all(batch.map(evolveToken));
        
        // Delay between batches
        await sleep(2000);
    }
}

// Rate limiting
const rateLimiter = new RateLimiter({
    tokensPerInterval: 100,
    interval: "minute"
});

await rateLimiter.removeTokens(1);
```

## 🔍 Monitoring & Analytics

### Events to Track

```solidity
event Minted(address indexed to, uint256 indexed tokenId, string uri);
event Evolved(uint256 indexed tokenId, string oldURI, string newURI, uint256 version, uint256 timestamp);
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
```

### Metrics to Monitor

```
Blockchain:
├─ Total mints
├─ Total evolutions
├─ Average evolution time
├─ Gas costs
└─ Transaction success rate

AI Engine:
├─ Evolution queue size
├─ Processing time
├─ Success/failure rate
├─ API response times
└─ Error rates

Frontend:
├─ Page load times
├─ User interactions
├─ Wallet connections
└─ Transaction completions
```

---

**This is how EvoNFT works under the hood! 🚀**
