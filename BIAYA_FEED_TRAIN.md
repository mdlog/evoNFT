# Kemana Biaya Feed & Train Masuk? 💰

## Ringkasan Singkat

**Biaya feed dan train masuk ke smart contract NFT dan bisa di-withdraw oleh owner contract.**

---

## Detail Alur Biaya

### 1. 🍖 Feed NFT

#### Harga Feed:
```solidity
BASIC_FOOD_PRICE = 0.1 MATIC
PREMIUM_FOOD_PRICE = 0.5 MATIC
LEGENDARY_FOOD_PRICE = 1.0 MATIC
```

#### Alur Pembayaran:
```
User → [0.1 MATIC] → Smart Contract NFT
```

#### Kode di Contract:
```solidity
function feed(uint256 tokenId, uint8 foodType) external payable {
    require(_ownerOf(tokenId) == msg.sender, "Not token owner");
    require(foodType <= 2, "Invalid food type");
    
    uint256 price;
    uint256 xpGain;
    
    if (foodType == 0) {
        price = BASIC_FOOD_PRICE;  // 0.1 MATIC
        xpGain = BASIC_FOOD_XP;    // 50 XP
    } else if (foodType == 1) {
        price = PREMIUM_FOOD_PRICE; // 0.5 MATIC
        xpGain = PREMIUM_FOOD_XP;   // 200 XP
    } else {
        price = LEGENDARY_FOOD_PRICE; // 1.0 MATIC
        xpGain = LEGENDARY_FOOD_XP;    // 500 XP
    }
    
    require(msg.value >= price, "Insufficient payment");
    
    // Add XP
    tokenXP[tokenId] += xpGain;
    
    emit Fed(tokenId, foodType, xpGain, tokenXP[tokenId]);
    
    // Refund excess payment
    if (msg.value > price) {
        payable(msg.sender).transfer(msg.value - price);
    }
}
```

**Catatan:** Jika user kirim lebih dari harga, kelebihan akan di-refund otomatis.

---

### 2. 💪 Train NFT

#### Harga Train:
```solidity
TRAIN_PRICE = 0.3 MATIC (untuk semua stat)
```

#### Alur Pembayaran:
```
User → [0.3 MATIC] → Smart Contract NFT
```

#### Kode di Contract:
```solidity
function train(uint256 tokenId, uint8 statType) external payable {
    require(_ownerOf(tokenId) == msg.sender, "Not token owner");
    require(statType <= 4, "Invalid stat type");
    require(msg.value >= TRAIN_PRICE, "Insufficient payment");
    require(tokenStats[tokenId][statType] < 100, "Stat already maxed");
    
    // Increase stat
    tokenStats[tokenId][statType] += 1;
    
    // Add XP
    tokenXP[tokenId] += TRAIN_XP; // +100 XP
    
    emit Trained(tokenId, statType, tokenStats[tokenId][statType], TRAIN_XP);
    
    // Refund excess payment
    if (msg.value > TRAIN_PRICE) {
        payable(msg.sender).transfer(msg.value - TRAIN_PRICE);
    }
}
```

---

## 💰 Kemana Biaya Masuk?

### Smart Contract Balance

Semua biaya feed dan train **masuk ke balance smart contract NFT**.

**Contract Address:**
```
0xe31d18Fb9925f677451845997f64806a88264b3D
```

**Cek Balance:**
```
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
```

### Contoh Perhitungan:

Jika ada 10 user yang feed:
- 5 user feed Basic (0.1 MATIC) = 0.5 MATIC
- 3 user feed Premium (0.5 MATIC) = 1.5 MATIC
- 2 user feed Legendary (1.0 MATIC) = 2.0 MATIC

**Total di contract:** 4.0 MATIC

Jika ada 5 user yang train:
- 5 user train (0.3 MATIC) = 1.5 MATIC

**Total di contract:** 4.0 + 1.5 = **5.5 MATIC**

---

## 🏦 Withdraw Biaya

### Fungsi Withdraw

```solidity
/**
 * @notice Withdraw contract balance
 */
function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "No balance");
    payable(owner()).transfer(balance);
}
```

### Siapa yang Bisa Withdraw?

**Hanya owner contract** yang bisa withdraw.

**Owner Address:** 
```
0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4
```

### Cara Withdraw:

#### Option 1: Via Hardhat Console
```bash
cd evonft-contracts
npx hardhat console --network amoy

# Load contract
const NFT = await ethers.getContractFactory("EvolvableNFTExtended");
const nft = await NFT.attach("0xe31d18Fb9925f677451845997f64806a88264b3D");

# Check balance
const balance = await ethers.provider.getBalance(nft.address);
console.log("Contract balance:", ethers.formatEther(balance), "MATIC");

# Withdraw (only owner can do this)
const tx = await nft.withdraw();
await tx.wait();
console.log("Withdrawn!");
```

#### Option 2: Via Blockchain Explorer
1. Buka: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
2. Klik tab "Contract" → "Write Contract"
3. Connect wallet (harus owner)
4. Klik "withdraw"
5. Confirm transaction

#### Option 3: Via Script
```javascript
// scripts/withdraw-fees.js
const { ethers } = require("hardhat");

async function main() {
    const NFT_ADDRESS = "0xe31d18Fb9925f677451845997f64806a88264b3D";
    
    const nft = await ethers.getContractAt("EvolvableNFTExtended", NFT_ADDRESS);
    
    // Check balance
    const balance = await ethers.provider.getBalance(NFT_ADDRESS);
    console.log("Contract balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance > 0) {
        console.log("Withdrawing...");
        const tx = await nft.withdraw();
        await tx.wait();
        console.log("✅ Withdrawn successfully!");
    } else {
        console.log("No balance to withdraw");
    }
}

main().catch(console.error);
```

Run:
```bash
npx hardhat run scripts/withdraw-fees.js --network amoy
```

---

## 📊 Tracking Biaya

### Cek Balance Contract

#### Via Blockchain Explorer:
```
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D
```

#### Via Hardhat:
```javascript
const balance = await ethers.provider.getBalance("0xe31d18Fb9925f677451845997f64806a88264b3D");
console.log("Balance:", ethers.formatEther(balance), "MATIC");
```

#### Via Web3 (Frontend):
```javascript
const balance = await provider.getBalance("0xe31d18Fb9925f677451845997f64806a88264b3D");
console.log("Balance:", ethers.formatEther(balance), "MATIC");
```

### Cek Transaction History

Semua transaksi feed/train bisa dilihat di:
```
https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D#internaltx
```

---

## 💡 Use Cases

### 1. Revenue Model
- Biaya feed/train = revenue untuk project
- Owner bisa withdraw secara berkala
- Bisa digunakan untuk:
  - Development costs
  - Marketing
  - Rewards/airdrops
  - Liquidity

### 2. Burn Mechanism (Optional)
Bisa modifikasi contract untuk burn sebagian biaya:
```solidity
function feed(...) external payable {
    // ...
    
    // Burn 50% of fee
    uint256 burnAmount = price / 2;
    payable(address(0)).transfer(burnAmount);
    
    // Keep 50% in contract
}
```

### 3. Reward Pool (Optional)
Bisa modifikasi untuk distribute ke stakers:
```solidity
function feed(...) external payable {
    // ...
    
    // 70% to staking pool
    stakingPool.deposit{value: price * 70 / 100}();
    
    // 30% to owner
}
```

---

## 🔒 Security

### Access Control
- ✅ Only owner can withdraw
- ✅ Users can't withdraw others' payments
- ✅ Automatic refund for overpayment

### Checks
```solidity
function withdraw() external onlyOwner {  // ← Only owner
    uint256 balance = address(this).balance;
    require(balance > 0, "No balance");  // ← Must have balance
    payable(owner()).transfer(balance);   // ← Transfer to owner
}
```

### Owner Verification
```bash
# Check who is owner
npx hardhat console --network amoy

const nft = await ethers.getContractAt("EvolvableNFTExtended", "0xe31d18Fb9925f677451845997f64806a88264b3D");
const owner = await nft.owner();
console.log("Owner:", owner);
```

---

## 📈 Revenue Estimation

### Example Scenario:

**Assumptions:**
- 100 active users
- Each user feeds 2x per week
- 50% Basic, 30% Premium, 20% Legendary

**Weekly Revenue:**
```
Basic: 100 users × 2 feeds × 50% × 0.1 MATIC = 10 MATIC
Premium: 100 users × 2 feeds × 30% × 0.5 MATIC = 30 MATIC
Legendary: 100 users × 2 feeds × 20% × 1.0 MATIC = 40 MATIC

Total per week: 80 MATIC
```

**Monthly Revenue:**
```
80 MATIC × 4 weeks = 320 MATIC
```

**At current prices (~$0.50/MATIC):**
```
320 MATIC × $0.50 = $160/month
```

---

## 🎯 Summary

| Item | Detail |
|------|--------|
| **Biaya masuk ke** | Smart Contract NFT |
| **Contract Address** | 0xe31d18Fb9925f677451845997f64806a88264b3D |
| **Siapa bisa withdraw** | Owner contract saja |
| **Owner Address** | 0x3e4d881819768fab30c5a79f3a9a7e69f0a935a4 |
| **Cara withdraw** | Call `withdraw()` function |
| **Refund otomatis** | Ya, jika overpayment |

### Biaya:
- 🍖 Basic Food: 0.1 MATIC
- 🥩 Premium Food: 0.5 MATIC
- 🍗 Legendary Food: 1.0 MATIC
- 💪 Train: 0.3 MATIC

### Keamanan:
- ✅ Only owner can withdraw
- ✅ Automatic refund system
- ✅ Transparent on blockchain

---

**Kesimpulan:** Semua biaya feed dan train masuk ke smart contract dan bisa di-withdraw oleh owner untuk mendukung development dan operasional project.
