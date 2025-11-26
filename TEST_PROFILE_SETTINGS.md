# 🧪 Test Profile Settings - Debugging Guide

## 🔍 Cara Test Fungsi Username

### 1. Buka Browser Console

```
Chrome/Edge: F12 atau Ctrl+Shift+I
Firefox: F12 atau Ctrl+Shift+K
Safari: Cmd+Option+I
```

### 2. Buka Halaman Profile

```
http://localhost:5173/profile
```

### 3. Klik Tab "Settings"

### 4. Test Input Username

#### Test 1: Type Username
```
1. Klik input field "Username"
2. Type: "TestUser123"
3. Lihat console log:
   🔄 Profile Change: username = T
   🔄 Profile Change: username = Te
   🔄 Profile Change: username = Tes
   ... (setiap karakter)
   ✅ New Profile Settings: { username: "TestUser123", ... }
```

#### Test 2: Save Username
```
1. Klik button "💾 Save Profile Settings"
2. Lihat console log:
   💾 Saving Profile... { username: "TestUser123", ... }
   ✅ Saved to localStorage: {"username":"TestUser123",...}
3. Toast notification muncul: "Profile settings saved successfully! ✅"
```

#### Test 3: Verify localStorage
```
1. Di console, ketik:
   localStorage.getItem('profile_0xYourWalletAddress')

2. Harusnya return:
   {"username":"TestUser123","bio":"","email":"","twitter":"","discord":""}
```

#### Test 4: Refresh Page
```
1. Refresh page (F5)
2. Lihat console log:
   📂 Loading settings for account: 0x...
   ✅ Loaded profile: { username: "TestUser123", ... }
3. Input field harusnya sudah terisi dengan "TestUser123"
```

---

## 🐛 Troubleshooting

### Problem 1: Input tidak berubah saat typing

**Symptoms:**
- Ketik di input field tapi text tidak muncul
- Console tidak show log "🔄 Profile Change"

**Solution:**
```javascript
// Check if input has correct value prop
<input
  type="text"
  value={profileSettings.username}  // ✅ Harus ada
  onChange={(e) => handleProfileChange('username', e.target.value)}  // ✅ Harus ada
/>
```

**Test di Console:**
```javascript
// Check current state
console.log('Current profileSettings:', profileSettings)

// Manual test
handleProfileChange('username', 'TestValue')
```

---

### Problem 2: Save tidak berfungsi

**Symptoms:**
- Klik save tapi tidak ada toast notification
- Console tidak show log "💾 Saving Profile..."

**Solution:**
```javascript
// Check if button is disabled
<button
  onClick={handleSaveProfile}  // ✅ Harus ada
  disabled={isSaving || !profileSettings.username || profileSettings.username.length < 3}
>
```

**Test di Console:**
```javascript
// Manual save test
handleSaveProfile()

// Check if data saved
localStorage.getItem('profile_0xYourAddress')
```

---

### Problem 3: Data tidak persist setelah refresh

**Symptoms:**
- Save berhasil tapi setelah refresh data hilang
- Console show "ℹ️ No saved profile found"

**Solution:**
```javascript
// Check localStorage key format
const key = `profile_${account}`
console.log('Looking for key:', key)
console.log('Available keys:', Object.keys(localStorage))

// Check if account is defined
console.log('Current account:', account)
```

**Manual Fix:**
```javascript
// Save manually
const testData = {
  username: "TestUser",
  bio: "Test bio",
  email: "",
  twitter: "",
  discord: ""
}
localStorage.setItem('profile_0xYourAddress', JSON.stringify(testData))

// Reload page
location.reload()
```

---

### Problem 4: Multiple wallets conflict

**Symptoms:**
- Switch wallet tapi settings tidak berubah
- Settings dari wallet A muncul di wallet B

**Solution:**
```javascript
// Each wallet should have separate key
Wallet A: profile_0x123...
Wallet B: profile_0x456...

// Check current wallet
console.log('Current account:', account)

// Check all saved profiles
Object.keys(localStorage)
  .filter(key => key.startsWith('profile_'))
  .forEach(key => {
    console.log(key, localStorage.getItem(key))
  })
```

---

## 🧪 Manual Testing Script

### Copy-paste ke Browser Console:

```javascript
// 1. Test State Management
console.log('=== TEST 1: State Management ===')
console.log('Current profileSettings:', profileSettings)
console.log('Current account:', account)

// 2. Test Input Change
console.log('\n=== TEST 2: Input Change ===')
handleProfileChange('username', 'ManualTest123')
console.log('After change:', profileSettings)

// 3. Test Save
console.log('\n=== TEST 3: Save Function ===')
await handleSaveProfile()

// 4. Test localStorage
console.log('\n=== TEST 4: localStorage ===')
const key = `profile_${account}`
console.log('Key:', key)
console.log('Saved data:', localStorage.getItem(key))

// 5. Test Load
console.log('\n=== TEST 5: Load Function ===')
const savedData = localStorage.getItem(key)
if (savedData) {
  console.log('Parsed data:', JSON.parse(savedData))
} else {
  console.log('No data found!')
}

// 6. Clear All Data (if needed)
console.log('\n=== TEST 6: Clear Data ===')
// Uncomment to clear:
// localStorage.removeItem(key)
// console.log('Data cleared!')
```

---

## ✅ Expected Console Output

### When Everything Works:

```
📂 Loading settings for account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
ℹ️ No saved profile found, using defaults

🔄 Profile Change: username = T
✅ New Profile Settings: {username: "T", bio: "", email: "", twitter: "", discord: ""}

🔄 Profile Change: username = Te
✅ New Profile Settings: {username: "Te", bio: "", email: "", twitter: "", discord: ""}

🔄 Profile Change: username = TestUser123
✅ New Profile Settings: {username: "TestUser123", bio: "", email: "", twitter: "", discord: ""}

💾 Saving Profile... {username: "TestUser123", bio: "", email: "", twitter: "", discord: ""}
✅ Saved to localStorage: {"username":"TestUser123","bio":"","email":"","twitter":"","discord":""}

[After Refresh]
📂 Loading settings for account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
✅ Loaded profile: {username: "TestUser123", bio: "", email: "", twitter: "", discord: ""}
```

---

## 🔧 Quick Fixes

### Fix 1: Force Clear All Settings
```javascript
// Run in console
Object.keys(localStorage)
  .filter(key => key.startsWith('profile_') || key.startsWith('notifications_'))
  .forEach(key => localStorage.removeItem(key))
console.log('All settings cleared!')
location.reload()
```

### Fix 2: Manually Set Test Data
```javascript
// Run in console
const account = '0xYourWalletAddress' // Replace with your address
const testProfile = {
  username: "TestUser123",
  bio: "This is a test bio",
  email: "test@example.com",
  twitter: "@testuser",
  discord: "testuser#1234"
}
localStorage.setItem(`profile_${account}`, JSON.stringify(testProfile))
console.log('Test data set!')
location.reload()
```

### Fix 3: Debug State
```javascript
// Add to Profile.jsx temporarily
useEffect(() => {
  console.log('🔍 DEBUG: profileSettings changed:', profileSettings)
}, [profileSettings])

useEffect(() => {
  console.log('🔍 DEBUG: account changed:', account)
}, [account])
```

---

## 📊 Checklist

Test setiap item ini:

- [ ] Input field muncul di halaman Settings
- [ ] Bisa ketik di input field username
- [ ] Console show log saat typing
- [ ] Character counter update (untuk bio)
- [ ] Validation error muncul jika username < 3 karakter
- [ ] Save button disabled jika username invalid
- [ ] Save button enabled jika username valid
- [ ] Klik save button show loading state
- [ ] Toast notification muncul setelah save
- [ ] Data tersimpan di localStorage
- [ ] Refresh page, data masih ada
- [ ] Switch wallet, data berbeda per wallet
- [ ] Disconnect wallet, form reset
- [ ] Reconnect wallet, data auto-load

---

## 🎯 Success Criteria

✅ **Username Change Working** jika:
1. Bisa ketik di input field
2. Console show log setiap perubahan
3. State ter-update dengan benar
4. Save berhasil ke localStorage
5. Data persist setelah refresh
6. Data terpisah per wallet address

---

## 📞 Need Help?

Jika masih tidak berfungsi, share:
1. Screenshot console logs
2. Browser yang digunakan
3. Wallet address (first 6 chars)
4. Error messages (jika ada)

---

**Last Updated:** 2024
**Status:** Ready for Testing 🧪
