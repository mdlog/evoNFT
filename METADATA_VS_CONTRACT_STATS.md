# Metadata Stats vs Contract Stats

## Masalah: Stats di Metadata Berbeda dengan Stats di Contract

### 🔍 Situasi

Ketika Anda melihat NFT, ada **2 sumber stats** yang berbeda:

#### 1. **Metadata Stats** (di IPFS)
```json
{
  "attributes": [
    {"trait_type":"Strength","value":15},
    {"trait_type":"Intelligence","value":18},
    {"trait_type":"Speed","value":22},
    {"trait_type":"Endurance","value":26},
    {"trait_type":"Luck","value":14}
  ]
}
```

#### 2. **Contract Stats** (di Blockchain)
```
Strength:     5/100
Intelligence: 5/100
Speed:        5/100
Endurance:    5/100
Luck:         5/100
```

---

## ❓ Mengapa Berbeda?

### Metadata Stats (IPFS)
- Dibuat saat **mint** oleh frontend
- Di-generate secara **random** (10-30)
- Tersimpan di **IPFS** (off-chain)
- **TIDAK mempengaruhi gameplay**
- Hanya untuk referensi visual

### Contract Stats (Blockchain)
- Diinisialisasi saat **mint** oleh smart contract
- Semua mulai dengan nilai **5**
- Tersimpan di **blockchain** (on-chain)
- **MEMPENGARUHI gameplay** (breeding, battles, dll)
- Dapat ditingkatkan dengan **Train**

---

## ✅ Solusi: Contract Stats adalah Sumber Kebenaran

Aplikasi sekarang menggunakan **Contract Stats** sebagai sumber kebenaran karena:

1. ✅ **On-chain** - Tersimpan di blockchain, tidak bisa dimanipulasi
2. ✅ **Konsisten** - Semua NFT mulai dari nilai yang sama (5)
3. ✅ **Dapat ditingkatkan** - Melalui Train function
4. ✅ **Mempengaruhi gameplay** - Digunakan untuk breeding, battles, dll

---

## 🎯 Cara Kerja Stats yang Benar

### Saat Mint
```
1. Frontend generate metadata dengan stats random (15, 18, 22, dll)
2. Upload metadata ke IPFS
3. Contract mint NFT dengan stats default (5, 5, 5, 5, 5)
4. Contract stats = sumber kebenaran ✅
```

### Saat Train
```
1. User klik Train dan pilih stat (misal: Strength)
2. Bayar 0.3 MATIC
3. Contract update: tokenStats[tokenId][STAT_STRENGTH] += 1
4. Strength berubah dari 5 → 6
5. Stats di metadata TIDAK berubah (tetap 15)
6. Aplikasi menampilkan stats dari contract (6) ✅
```

### Saat Breeding
```
1. Contract ambil stats dari kedua parent
2. Hitung stats offspring berdasarkan parent stats
3. Offspring stats = average parent stats + random bonus
4. Metadata stats TIDAK digunakan ❌
5. Contract stats yang digunakan ✅
```

---

## 📝 Rekomendasi

### Untuk Development
1. ✅ **Selalu gunakan contract stats** untuk gameplay
2. ✅ **Ignore metadata stats** - hanya untuk visual reference
3. ✅ **Update metadata generation** agar stats di metadata = 5 (sama dengan contract)

### Untuk User
1. ✅ **Lihat "Stats & Attributes"** di NFT Detail page
2. ✅ **Ignore stats di metadata** (jika berbeda)
3. ✅ **Gunakan Train** untuk meningkatkan stats
4. ✅ **Stats mulai dari 5** adalah normal dan fair untuk semua

---

## 🔧 Fix untuk Metadata Generation

Untuk menghindari kebingungan, metadata generation harus diupdate agar stats di metadata = 5:

```javascript
// Di MintNFT.jsx atau metadata generation
const metadata = {
  name: `EvoNFT #${tokenId}`,
  description: "...",
  attributes: [
    {"trait_type": "Level", "value": 1},
    {"trait_type": "Rarity", "value": rarity},
    {"trait_type": "Creature Type", "value": creatureType},
    // Stats harus 5 (sama dengan contract)
    {"trait_type": "Strength", "value": 5},      // ✅ Bukan random
    {"trait_type": "Intelligence", "value": 5},  // ✅ Bukan random
    {"trait_type": "Speed", "value": 5},         // ✅ Bukan random
    {"trait_type": "Endurance", "value": 5},     // ✅ Bukan random
    {"trait_type": "Luck", "value": 5}           // ✅ Bukan random
  ]
}
```

---

## 🎮 Gameplay Impact

### ✅ Yang Mempengaruhi Gameplay
- Contract stats (5, 5, 5, 5, 5)
- Training (meningkatkan contract stats)
- Breeding (menggunakan contract stats)
- Level (dari XP di contract)

### ❌ Yang TIDAK Mempengaruhi Gameplay
- Metadata stats (15, 18, 22, 26, 14)
- Visual traits (Dragon, Phoenix, dll)
- Rarity di metadata (hanya visual)

---

## 📊 Contoh Lengkap

### NFT #5 - Baru Mint

**Metadata (IPFS):**
```json
{
  "attributes": [
    {"trait_type":"Strength","value":15},
    {"trait_type":"Intelligence","value":18},
    {"trait_type":"Speed","value":22},
    {"trait_type":"Endurance","value":26},
    {"trait_type":"Luck","value":14}
  ]
}
```

**Contract (Blockchain):**
```solidity
tokenStats[5][STAT_STRENGTH] = 5      // ✅ Ini yang digunakan
tokenStats[5][STAT_INTELLIGENCE] = 5  // ✅ Ini yang digunakan
tokenStats[5][STAT_SPEED] = 5         // ✅ Ini yang digunakan
tokenStats[5][STAT_ENDURANCE] = 5     // ✅ Ini yang digunakan
tokenStats[5][STAT_LUCK] = 5          // ✅ Ini yang digunakan
```

**Tampilan di App:**
```
Stats & Attributes (dari Contract):
Strength:     5/100  ████░░░░░░░░░░░░░░░░
Intelligence: 5/100  ████░░░░░░░░░░░░░░░░
Speed:        5/100  ████░░░░░░░░░░░░░░░░
Endurance:    5/100  ████░░░░░░░░░░░░░░░░
Luck:         5/100  ████░░░░░░░░░░░░░░░░
```

---

## ✅ Kesimpulan

1. **Contract stats = sumber kebenaran** untuk gameplay
2. **Metadata stats = visual reference** saja
3. **Semua NFT mulai dengan stats 5** (fair untuk semua)
4. **Gunakan Train** untuk meningkatkan stats
5. **Aplikasi sudah benar** - menampilkan contract stats

**Stats 5/100 adalah NORMAL dan BENAR!** 🎯
