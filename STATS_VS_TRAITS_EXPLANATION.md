# Stats vs Traits - Penjelasan

## Perbedaan Stats & Attributes vs Visual Traits

### 📊 Stats & Attributes (dari Smart Contract)
Stats ini adalah **data on-chain** yang tersimpan di blockchain dan mempengaruhi gameplay:

- **Strength** (Kekuatan): 0-100
- **Intelligence** (Kecerdasan): 0-100  
- **Speed** (Kecepatan): 0-100
- **Endurance** (Daya Tahan): 0-100
- **Luck** (Keberuntungan): 0-100

**Karakteristik:**
- ✅ Tersimpan di blockchain (on-chain)
- ✅ Semua NFT mulai dengan nilai 5 untuk setiap stat
- ✅ Dapat ditingkatkan dengan **Train** (biaya 0.3 MATIC per training)
- ✅ Setiap training meningkatkan 1 stat sebesar +1 poin
- ✅ Maksimal 100 per stat
- ✅ Mempengaruhi gameplay dan breeding

**Cara Meningkatkan:**
```
1. Klik tombol "💪 Train" di halaman NFT Detail
2. Pilih stat yang ingin ditingkatkan
3. Bayar 0.3 MATIC
4. Stat akan bertambah +1 dan NFT mendapat +100 XP
```

---

### 🎨 Visual Traits (dari Metadata)
Traits ini adalah **karakteristik visual** yang di-generate untuk tampilan NFT:

- **Creature Type**: Dragon, Phoenix, Unicorn, Griffin, Wolf, Fox, Cat, Rabbit
- **Rarity**: Common, Rare, Epic, Legendary
- **Level**: 1-10+
- **Visual Stats**: Power, Speed, Intelligence (berbeda dari contract stats)

**Karakteristik:**
- ✅ Untuk tampilan visual saja
- ✅ Di-generate berdasarkan tokenId dan rarity
- ✅ Tidak tersimpan di blockchain
- ✅ Tidak mempengaruhi gameplay
- ✅ Memberikan identitas visual unik untuk setiap NFT

---

## Mengapa Ada 2 Sistem?

### Stats (Contract) - Gameplay
Stats dari contract adalah **mekanik gameplay** yang sebenarnya:
- Digunakan untuk breeding (menentukan stats offspring)
- Dapat ditingkatkan melalui training
- Tersimpan permanen di blockchain
- Mempengaruhi value NFT

### Traits (Visual) - Identitas
Traits visual memberikan **identitas unik** untuk setiap NFT:
- Membuat setiap NFT terlihat berbeda
- Memberikan tema dan cerita
- Meningkatkan engagement visual
- Tidak mempengaruhi gameplay

---

## Contoh NFT

### NFT #1 - Level 1 (Baru Mint)

**Stats & Attributes (Contract):**
```
Strength:     5/100  ████░░░░░░░░░░░░░░░░
Intelligence: 5/100  ████░░░░░░░░░░░░░░░░
Speed:        5/100  ████░░░░░░░░░░░░░░░░
Endurance:    5/100  ████░░░░░░░░░░░░░░░░
Luck:         5/100  ████░░░░░░░░░░░░░░░░
```

**Visual Traits:**
```
Creature Type: Dragon 🐉
Rarity: Rare
Level: 1
```

---

### NFT #1 - Setelah 10x Training

**Stats & Attributes (Contract):**
```
Strength:     15/100 ████████████░░░░░░░░  (+10 dari training)
Intelligence: 5/100  ████░░░░░░░░░░░░░░░░
Speed:        5/100  ████░░░░░░░░░░░░░░░░
Endurance:    5/100  ████░░░░░░░░░░░░░░░░
Luck:         5/100  ████░░░░░░░░░░░░░░░░
```

**Visual Traits:**
```
Creature Type: Dragon 🐉  (tidak berubah)
Rarity: Rare              (tidak berubah)
Level: 2                  (naik dari XP)
```

---

## FAQ

### Q: Mengapa semua stats saya 5/100?
A: Semua NFT mulai dengan stats 5. Gunakan **Train** untuk meningkatkan stats!

### Q: Apakah Visual Traits mempengaruhi stats?
A: Tidak. Visual Traits hanya untuk tampilan. Stats yang sebenarnya ada di contract.

### Q: Bagaimana cara meningkatkan stats?
A: Gunakan tombol **💪 Train** di halaman NFT Detail, pilih stat yang ingin ditingkatkan, dan bayar 0.3 MATIC.

### Q: Apakah Feed meningkatkan stats?
A: Tidak. **Feed** hanya menambah XP untuk level up. **Train** yang meningkatkan stats.

### Q: Berapa biaya untuk training?
A: 0.3 MATIC per training. Setiap training meningkatkan 1 stat sebesar +1 dan memberikan +100 XP.

### Q: Apakah stats mempengaruhi breeding?
A: Ya! Stats dari kedua parent akan mempengaruhi stats offspring saat breeding.

---

## Kesimpulan

- **Stats & Attributes** = Data on-chain yang mempengaruhi gameplay
- **Visual Traits** = Karakteristik visual untuk identitas NFT
- Gunakan **Train** untuk meningkatkan stats
- Gunakan **Feed** untuk meningkatkan XP dan level
- Kedua sistem bekerja bersama untuk memberikan pengalaman yang lengkap!
