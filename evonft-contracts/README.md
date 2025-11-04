# EvoNFT Smart Contracts

Smart contracts untuk EvoNFT - NFT yang dapat berevolusi di Polygon network.

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
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key
AI_SIGNER_ADDRESS=0x_ai_signer_address
POLYGONSCAN_API_KEY=your_api_key
```

### Compile

```bash
npx hardhat compile
```

### Test

```bash
npx hardhat test
```

### Deploy

#### Mumbai Testnet
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

#### Polygon Mainnet
```bash
npx hardhat run scripts/deploy.js --network polygon
```

### Verify

```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS "EvoNFT" "EVONFT" "AI_SIGNER_ADDRESS"
```

## 📝 Contract Overview

### EvolvableNFT.sol

ERC-721 NFT dengan kemampuan evolusi yang aman menggunakan EIP-712 signatures.

**Key Features:**
- ✅ ERC-721 compliant
- ✅ Dynamic metadata (IPFS)
- ✅ EIP-712 signature verification
- ✅ Evolution cooldown mechanism
- ✅ Nonce-based replay protection
- ✅ Admin controls

**Main Functions:**

```solidity
// Minting
function mint(address to, string memory uri) external payable returns (uint256)

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
function getEvolutionInfo(uint256 tokenId) external view
function canEvolve(uint256 tokenId) external view returns (bool)
```

## 🔐 Security

- EIP-712 typed data signing
- Replay attack protection (nonces)
- Cooldown mechanism (default: 24 hours)
- Signature deadline (prevents stale signatures)
- Admin-only signer rotation

## 💰 Gas Costs (Polygon)

| Operation | Estimated Gas | Cost (MATIC) |
|-----------|--------------|--------------|
| Mint | ~150,000 | ~0.001 |
| Evolve | ~200,000 | ~0.0015 |
| Batch Mint (10) | ~1,000,000 | ~0.008 |

## 📊 Contract Parameters

- **Mint Price**: 0.01 MATIC (configurable)
- **Max Supply**: 10,000 (configurable)
- **Cooldown**: 24 hours (configurable)
- **Signature Deadline**: 1 hour

## 🧪 Testing

Run all tests:
```bash
npx hardhat test
```

Run with gas report:
```bash
REPORT_GAS=true npx hardhat test
```

Run coverage:
```bash
npx hardhat coverage
```

## 📦 Deployment Info

Deployment info disimpan di folder `deployments/` dengan format:
```
deployments/
  ├── mumbai-1234567890.json
  └── polygon-1234567890.json
```

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Polygon Documentation](https://docs.polygon.technology/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)

## 📄 License

MIT
