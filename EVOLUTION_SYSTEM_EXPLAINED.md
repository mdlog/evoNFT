# 🧬 Evolution System - Penjelasan Lengkap

## 📋 Overview

Evolution System adalah fitur utama EvoNFT yang memungkinkan NFT **berubah bentuk/appearance** secara berkala berdasarkan AI-driven signals. Berbeda dengan Level Up (Feed/Train), Evolution mengubah metadata dan visual NFT secara fundamental.

---

## 🎯 Konsep Dasar

### Perbedaan Evolution vs Level Up

| Aspek | Level Up (Feed/Train) | Evolution |
|-------|----------------------|-----------|
| **Frekuensi** | Kapan saja (bayar gas) | Cooldown 24 jam |
| **Perubahan** | Stats naik (+5) | Appearance berubah total |
| **Metadata** | Tetap sama | URI baru (IPFS) |
| **Version** | Tidak berubah | Version naik (+1) |
| **Trigger** | User action | AI signature required |
| **Cost** | 0.001-0.002 MATIC | Gratis (AI-driven) |

---

## 📊 Evolution Status Components

### 1. **Version** (Versi Evolusi)

```solidity
mapping(uint256 => uint256) public version;
```

**Penjelasan:**
- Setiap NFT dimulai dari **Version 1** saat mint
- Setiap kali evolve, version naik +1
- Version menunjukkan "generasi" atau "bentuk" NFT

**Contoh Timeline:**
```
Version 1 → Baby Form (Mint)
Version 2 → Teen Form (First Evolution)
Version 3 → Adult Form (Second Evolution)
Version 4 → Elder Form (Third Evolution)
Version 5+ → Legendary Forms
```

**Cara Kerja:**
```solidity
// Saat mint
version[tokenId] = 1;

// Saat evolve
version[tokenId]++; // 1 → 2 → 3 → dst
```

---

### 2. **Can Evolve** (Status Kesiapan)

```solidity
function canEvolve(uint256 tokenId) external view returns (bool)
```

**Penjelasan:**
- Mengecek apakah NFT **ready** untuk evolve
- Return `true` jika cooldown sudah lewat
- Return `false` jika masih dalam cooldown period

**Logic:**
```solidity
return block.timestamp >= lastEvolvedAt[tokenId] + cooldown;
```

**Status Display:**
- ✅ **Ready** (hijau) = `canEvolve = true` → Bisa evolve sekarang
- ⏳ **Cooldown** (abu-abu) = `canEvolve = false` → Masih cooldown

**Syarat Ready:**
1. Cooldown period (24 jam) sudah lewat
2. Token exists (sudah di-mint)
3. Tidak ada batasan lain

---

### 3. **Next Evolution Time** (Waktu Evolusi Berikutnya)

```solidity
mapping(uint256 => uint256) public lastEvolvedAt;
uint256 public cooldown = 1 days;
```

**Penjelasan:**
- Menampilkan **timestamp** kapan NFT bisa evolve lagi
- Dihitung dari: `lastEvolvedAt + cooldown`
- Default cooldown: **24 jam (1 days)**

**Cara Kerja:**
```solidity
// Get evolution info
function getEvolutionInfo(uint256 tokenId) returns (
    uint256 currentVersion,
    uint256 lastEvolved,
    uint256 nextEvolveTime, // ← lastEvolved + cooldown
    uint256 currentNonce
)
```

**Display Format:**
```javascript
// Frontend
new Date(nextEvolveTime * 1000).toLocaleString()
// Output: "11/6/2025, 8:02:07 PM"
```

**Timeline Example:**
```
Mint: 10/6/2025, 8:00 PM
  ↓
lastEvolvedAt = 1699286400
cooldown = 86400 (24 hours)
  ↓
nextEvolveTime = 1699372800
  ↓
Display: "11/6/2025, 8:00 PM"
```

---

## 🔄 Evolution Process Flow

### Step-by-Step Evolution

```
1. NFT Minted
   ├─ version = 1
   ├─ lastEvolvedAt = block.timestamp
   └─ canEvolve = false (cooldown aktif)

2. Wait 24 Hours
   └─ canEvolve = true (cooldown selesai)

3. AI Engine Monitors
   ├─ Collect on-chain signals (transactions, staking, etc.)
   ├─ Collect off-chain signals (Discord, Twitter, etc.)
   ├─ Calculate evolution score
   └─ Generate new metadata + image

4. AI Signs Evolution Request
   ├─ Create EIP-712 signature
   ├─ Include: tokenId, newURI, nonce, deadline
   └─ Sign with private key

5. User Calls requestEvolve()
   ├─ Verify signature
   ├─ Check cooldown
   ├─ Update tokenURI
   ├─ version++
   ├─ lastEvolvedAt = now
   └─ Emit Evolved event

6. NFT Evolved!
   ├─ New appearance/image
   ├─ New metadata
   ├─ Version increased
   └─ Cooldown reset (24 hours)
```

---

## 🔐 Security: EIP-712 Signature

### Mengapa Perlu Signature?

Evolution tidak bisa dilakukan sembarangan. Harus ada **AI signature** untuk memastikan:
1. Evolution berdasarkan data yang valid
2. Tidak ada spam evolution
3. Metadata baru sudah di-generate dengan benar

### EIP-712 Structure

```solidity
bytes32 private constant EVOLVE_TYPEHASH = 
    keccak256("EvolveRequest(uint256 tokenId,string newURI,uint256 nonce,uint256 deadline)");
```

**Components:**
- `tokenId` - NFT yang akan evolve
- `newURI` - IPFS URI metadata baru
- `nonce` - Prevent replay attacks
- `deadline` - Signature expiration (1 hour)

### Verification Process

```solidity
// 1. Create struct hash
bytes32 structHash = keccak256(
    abi.encode(EVOLVE_TYPEHASH, tokenId, keccak256(bytes(newURI)), nonces[tokenId], deadline)
);

// 2. Create digest
bytes32 digest = _hashTypedDataV4(structHash);

// 3. Recover signer
address signer = digest.recover(signature);

// 4. Verify
require(signer == aiSigner, "Invalid signature");
```

---

## 🎨 Metadata Changes During Evolution

### Version 1 (Baby Form)
```json
{
  "name": "EvoNFT #123",
  "description": "A baby dragon",
  "image": "ipfs://Qm.../baby_dragon.png",
  "attributes": [
    {"trait_type": "version", "value": 1},
    {"trait_type": "form", "value": "Baby"},
    {"trait_type": "rarity", "value": "Common"}
  ]
}
```

### Version 2 (Teen Form) - After Evolution
```json
{
  "name": "EvoNFT #123",
  "description": "A teenage dragon with growing wings",
  "image": "ipfs://Qm.../teen_dragon.png",
  "attributes": [
    {"trait_type": "version", "value": 2},
    {"trait_type": "form", "value": "Teen"},
    {"trait_type": "rarity", "value": "Rare"},
    {"trait_type": "wings", "value": "Small"}
  ]
}
```

### Version 3 (Adult Form) - After 2nd Evolution
```json
{
  "name": "EvoNFT #123",
  "description": "A majestic adult dragon",
  "image": "ipfs://Qm.../adult_dragon.png",
  "attributes": [
    {"trait_type": "version", "value": 3},
    {"trait_type": "form", "value": "Adult"},
    {"trait_type": "rarity", "value": "Epic"},
    {"trait_type": "wings", "value": "Large"},
    {"trait_type": "fire_breath", "value": "Enabled"}
  ]
}
```

---

## ⚙️ Smart Contract Functions

### 1. `requestEvolve()` - Main Evolution Function

```solidity
function requestEvolve(
    uint256 tokenId,
    string calldata newURI,
    uint256 deadline,
    bytes calldata signature
) external
```

**Parameters:**
- `tokenId` - NFT yang akan evolve
- `newURI` - IPFS URI metadata baru
- `deadline` - Signature expiration (timestamp)
- `signature` - EIP-712 signature dari AI

**Requirements:**
- Token must exist
- Signature not expired
- Cooldown passed (24 hours)
- Valid AI signature

**Effects:**
- Update tokenURI
- Increment version
- Reset lastEvolvedAt
- Increment nonce
- Emit Evolved event

---

### 2. `getEvolutionInfo()` - Get Evolution Data

```solidity
function getEvolutionInfo(uint256 tokenId) 
    external view returns (
        uint256 currentVersion,
        uint256 lastEvolved,
        uint256 nextEvolveTime,
        uint256 currentNonce
    )
```

**Returns:**
- `currentVersion` - Version saat ini (1, 2, 3, ...)
- `lastEvolved` - Timestamp terakhir evolve
- `nextEvolveTime` - Timestamp kapan bisa evolve lagi
- `currentNonce` - Nonce untuk signature

---

### 3. `canEvolve()` - Check Evolution Status

```solidity
function canEvolve(uint256 tokenId) external view returns (bool)
```

**Returns:**
- `true` - Ready to evolve
- `false` - Still in cooldown

**Logic:**
```solidity
return block.timestamp >= lastEvolvedAt[tokenId] + cooldown;
```

---

### 4. `ownerEvolve()` - Emergency Evolution

```solidity
function ownerEvolve(uint256 tokenId, string calldata newURI) 
    external onlyOwner
```

**Purpose:**
- Testing evolution system
- Recovery if AI system down
- Manual evolution for special cases

**Note:** Bypasses cooldown and signature check!

---

## 🎮 User Experience Flow

### Frontend Display

```jsx
<div className="evolution-status">
  <h3>Evolution Status</h3>
  
  {/* Can Evolve Status */}
  <div>
    <span>Can Evolve:</span>
    <span className={nft.canEvolve ? 'ready' : 'cooldown'}>
      {nft.canEvolve ? '✅ Ready' : '⏳ Cooldown'}
    </span>
  </div>
  
  {/* Current Version */}
  <div>
    <span>Version:</span>
    <span>{nft.version}</span>
  </div>
  
  {/* Next Evolution Time */}
  {nft.nextEvolveTime && (
    <div>
      <span>Next Evolution:</span>
      <span>{new Date(nft.nextEvolveTime * 1000).toLocaleString()}</span>
    </div>
  )}
  
  {/* Evolve Button (if ready) */}
  {nft.canEvolve && (
    <button onClick={handleEvolve}>
      🧬 Evolve Now
    </button>
  )}
</div>
```

---

## 🔧 Configuration

### Cooldown Period

```solidity
uint256 public cooldown = 1 days; // 86400 seconds
```

**Can be changed by owner:**
```solidity
function setCooldown(uint256 _newCooldown) external onlyOwner
```

**Examples:**
- `1 hours` = 3600 seconds
- `12 hours` = 43200 seconds
- `1 days` = 86400 seconds (default)
- `7 days` = 604800 seconds

---

## 📈 Evolution Tracking

### Events Emitted

```solidity
event Evolved(
    uint256 indexed tokenId, 
    string oldURI, 
    string newURI, 
    uint256 version,
    uint256 timestamp
);
```

**Use Cases:**
- Track evolution history
- Display evolution timeline
- Analytics and statistics
- Notification system

---

## 🎯 Best Practices

### For Users:
1. **Wait for cooldown** - Check `canEvolve` status
2. **Monitor AI signals** - Active users get better evolutions
3. **Don't spam** - Cooldown prevents abuse
4. **Check version** - Higher version = rarer form

### For Developers:
1. **Verify signatures** - Always check AI signature
2. **Handle cooldown** - Show countdown timer
3. **Update metadata** - Fetch new URI after evolution
4. **Cache wisely** - Evolution changes metadata
5. **Monitor events** - Track evolution history

---

## 🚀 Future Enhancements

### Planned Features:
1. **Dynamic Cooldown** - Based on rarity or level
2. **Evolution Paths** - Multiple evolution branches
3. **Fusion Evolution** - Combine 2 NFTs
4. **Reverse Evolution** - Go back to previous form
5. **Evolution Stones** - Items to trigger evolution
6. **Community Voting** - Vote on evolution direction

---

## 📚 Summary

**Evolution Status** adalah sistem yang memungkinkan NFT berubah bentuk secara berkala dengan:

✅ **Version** - Tracking generasi/bentuk NFT (1, 2, 3, ...)
✅ **Can Evolve** - Status ready/cooldown
✅ **Next Evolution Time** - Countdown kapan bisa evolve
✅ **Cooldown** - 24 jam antara evolusi
✅ **AI Signature** - Security via EIP-712
✅ **Metadata Update** - New image & attributes

**Key Points:**
- Evolution ≠ Level Up
- Requires AI signature (secure)
- 24-hour cooldown (prevent spam)
- Changes appearance & metadata
- Version tracking (1 → 2 → 3 → ...)
- Real blockchain data (not mock)

---

**Last Updated**: November 7, 2025
**Contract**: EvolvableNFT.sol
**Network**: Polygon Amoy Testnet
