# 🔧 Profile Username Fix - Complete Guide

## ✅ Apa yang Sudah Diperbaiki

### 1. **Added Console Logging**
Sekarang setiap action akan log ke console untuk debugging:

```javascript
// Load settings
📂 Loading settings for account: 0x742d35...
✅ Loaded profile: {username: "TestUser", ...}

// Input change
🔄 Profile Change: username = TestUser123
✅ New Profile Settings: {username: "TestUser123", ...}

// Save
💾 Saving Profile... {username: "TestUser123", ...}
✅ Saved to localStorage: {"username":"TestUser123",...}
```

### 2. **Improved State Management**
- State reset saat switch wallet
- Default values jika tidak ada saved data
- Proper state updates dengan logging

### 3. **Better Error Handling**
- Validation messages lebih jelas
- Console logs untuk debugging
- Toast notifications untuk user feedback

---

## 🧪 Cara Test

### Method 1: Test di Aplikasi Utama

1. **Start Development Server**
```bash
cd evonft-app
npm run dev
```

2. **Buka Browser**
```
http://localhost:5173/profile
```

3. **Buka Console** (F12)

4. **Connect Wallet**
- Klik "Connect Wallet"
- Pilih MetaMask
- Approve connection

5. **Go to Settings Tab**
- Klik tab "Settings"

6. **Test Username Input**
```
1. Klik input field "Username"
2. Type: "TestUser123"
3. Lihat console:
   🔄 Profile Change: username = T
   🔄 Profile Change: username = Te
   ... (setiap karakter)
   ✅ New Profile Settings: {username: "TestUser123", ...}
```

7. **Test Save**
```
1. Klik "💾 Save Profile Settings"
2. Lihat console:
   💾 Saving Profile... {username: "TestUser123", ...}
   ✅ Saved to localStorage: {"username":"TestUser123",...}
3. Toast notification: "Profile settings saved successfully! ✅"
```

8. **Test Persistence**
```
1. Refresh page (F5)
2. Lihat console:
   📂 Loading settings for account: 0x...
   ✅ Loaded profile: {username: "TestUser123", ...}
3. Input field harusnya terisi dengan "TestUser123"
```

---

### Method 2: Test dengan Standalone HTML

1. **Buka Test File**
```
evonft-app/test-profile-input.html
```

2. **Drag & Drop ke Browser**
Atau buka dengan:
```
file:///path/to/evonft-app/test-profile-input.html
```

3. **Test All Features**
- Type username
- See real-time validation
- See console logs
- Click save
- See toast notification
- Refresh page
- Data should persist

4. **Use Test Functions** (di console)
```javascript
// Show current data
testFunctions.showData()

// Set test data
testFunctions.setTestData()

// Clear all data
testFunctions.clearData()
```

---

## 🔍 Debugging Steps

### Step 1: Check Console Logs

Buka console (F12) dan lihat apakah ada logs:

**Expected Logs:**
```
📂 Loading settings for account: 0x742d35...
ℹ️ No saved profile found, using defaults
🔄 Profile Change: username = T
✅ New Profile Settings: {username: "T", ...}
```

**If No Logs:**
- React component tidak render
- Event handlers tidak attached
- Check browser console for errors

---

### Step 2: Check State

Di console, ketik:
```javascript
// Check if React DevTools installed
window.__REACT_DEVTOOLS_GLOBAL_HOOK__

// Manual state check (if accessible)
console.log('Profile Settings:', profileSettings)
```

---

### Step 3: Check localStorage

Di console, ketik:
```javascript
// Get current account
const account = '0xYourWalletAddress' // Replace

// Check saved data
const key = `profile_${account}`
const data = localStorage.getItem(key)
console.log('Saved data:', data)

// Parse data
if (data) {
  console.log('Parsed:', JSON.parse(data))
}

// List all profile keys
Object.keys(localStorage)
  .filter(k => k.startsWith('profile_'))
  .forEach(k => console.log(k, localStorage.getItem(k)))
```

---

### Step 4: Manual Test

Di console, ketik:
```javascript
// Set test data manually
const testAccount = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
const testData = {
  username: 'ManualTest123',
  bio: 'Test bio',
  email: 'test@example.com',
  twitter: '@test',
  discord: 'test#1234'
}

localStorage.setItem(`profile_${testAccount}`, JSON.stringify(testData))
console.log('Test data set!')

// Reload page
location.reload()
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Input tidak berubah saat typing

**Symptoms:**
```
❌ Ketik di input tapi text tidak muncul
❌ Console tidak show log
```

**Check:**
```javascript
// 1. Check if input has value prop
<input value={profileSettings.username} />  // ✅

// 2. Check if onChange handler exists
<input onChange={(e) => handleProfileChange('username', e.target.value)} />  // ✅

// 3. Check if state updates
console.log('Current state:', profileSettings)
```

**Solution:**
- Pastikan input menggunakan controlled component pattern
- Value prop harus dari state
- onChange harus update state

---

### Issue 2: Save tidak berfungsi

**Symptoms:**
```
❌ Klik save tapi tidak ada response
❌ Tidak ada toast notification
❌ Console tidak show log
```

**Check:**
```javascript
// 1. Check if button has onClick
<button onClick={handleSaveProfile}>  // ✅

// 2. Check if button disabled
console.log('Button disabled?', isSaving || !profileSettings.username)

// 3. Manual save test
handleSaveProfile()
```

**Solution:**
- Pastikan onClick handler attached
- Check validation rules
- Check if account connected

---

### Issue 3: Data tidak persist

**Symptoms:**
```
❌ Save berhasil tapi setelah refresh data hilang
❌ Console show "No saved profile found"
```

**Check:**
```javascript
// 1. Check localStorage key
const account = '0xYourAddress'
const key = `profile_${account}`
console.log('Looking for:', key)
console.log('Found:', localStorage.getItem(key))

// 2. Check if account changes
console.log('Current account:', account)

// 3. Check all keys
console.log('All keys:', Object.keys(localStorage))
```

**Solution:**
- Pastikan account tidak undefined
- Pastikan key format benar
- Check if localStorage enabled di browser

---

### Issue 4: Validation tidak bekerja

**Symptoms:**
```
❌ Username < 3 karakter tapi bisa save
❌ Email invalid tapi bisa save
```

**Check:**
```javascript
// Check validation logic
if (!profileSettings.username || profileSettings.username.trim().length < 3) {
  console.log('❌ Username invalid')
  return
}

if (profileSettings.email && !profileSettings.email.includes('@')) {
  console.log('❌ Email invalid')
  return
}
```

**Solution:**
- Pastikan validation dipanggil sebelum save
- Check validation conditions
- Test dengan invalid data

---

## 🎯 Verification Checklist

Test setiap item ini:

### Basic Functionality
- [ ] Input field visible di Settings tab
- [ ] Bisa ketik di input username
- [ ] Text muncul saat typing
- [ ] Console show logs saat typing
- [ ] State updates dengan benar

### Validation
- [ ] Error message jika username < 3 karakter
- [ ] Error message jika email invalid
- [ ] Save button disabled jika invalid
- [ ] Save button enabled jika valid

### Save Functionality
- [ ] Klik save show loading state
- [ ] Toast notification muncul
- [ ] Console show save logs
- [ ] Data tersimpan di localStorage
- [ ] localStorage key format benar

### Persistence
- [ ] Refresh page, data masih ada
- [ ] Console show load logs
- [ ] Input fields pre-filled
- [ ] Data match dengan yang disimpan

### Multi-Wallet
- [ ] Switch wallet, data berbeda
- [ ] Each wallet has separate key
- [ ] No data conflict between wallets

---

## 🚀 Quick Test Commands

### Test 1: Check Current State
```javascript
console.log('=== CURRENT STATE ===')
console.log('Account:', account)
console.log('Profile Settings:', profileSettings)
console.log('Is Saving:', isSaving)
```

### Test 2: Manual Input Change
```javascript
console.log('=== TEST INPUT CHANGE ===')
handleProfileChange('username', 'TestValue123')
console.log('After change:', profileSettings)
```

### Test 3: Manual Save
```javascript
console.log('=== TEST SAVE ===')
await handleSaveProfile()
console.log('Save completed')
```

### Test 4: Check localStorage
```javascript
console.log('=== CHECK LOCALSTORAGE ===')
const key = `profile_${account}`
const data = localStorage.getItem(key)
console.log('Key:', key)
console.log('Data:', data)
console.log('Parsed:', data ? JSON.parse(data) : null)
```

### Test 5: Clear All Data
```javascript
console.log('=== CLEAR DATA ===')
Object.keys(localStorage)
  .filter(k => k.startsWith('profile_'))
  .forEach(k => {
    console.log('Removing:', k)
    localStorage.removeItem(k)
  })
console.log('All profile data cleared!')
location.reload()
```

---

## 📊 Expected Behavior

### Scenario 1: First Time User
```
1. User connects wallet
   → Console: "📂 Loading settings for account: 0x..."
   → Console: "ℹ️ No saved profile found, using defaults"
   → Form fields empty

2. User types username "TestUser123"
   → Console: "🔄 Profile Change: username = T"
   → Console: "🔄 Profile Change: username = Te"
   → ... (each character)
   → Console: "✅ New Profile Settings: {username: "TestUser123", ...}"

3. User clicks save
   → Button: "⏳ Saving..."
   → Console: "💾 Saving Profile... {username: "TestUser123", ...}"
   → Console: "✅ Saved to localStorage: {...}"
   → Toast: "Profile settings saved successfully! ✅"
   → Button: "💾 Save Profile Settings"

4. User refreshes page
   → Console: "📂 Loading settings for account: 0x..."
   → Console: "✅ Loaded profile: {username: "TestUser123", ...}"
   → Form pre-filled with "TestUser123"
```

### Scenario 2: Returning User
```
1. User connects wallet
   → Console: "📂 Loading settings for account: 0x..."
   → Console: "✅ Loaded profile: {username: "ExistingUser", ...}"
   → Form pre-filled with saved data

2. User edits username to "UpdatedUser"
   → Console: "🔄 Profile Change: username = UpdatedUser"
   → Console: "✅ New Profile Settings: {username: "UpdatedUser", ...}"

3. User saves
   → Console: "💾 Saving Profile... {username: "UpdatedUser", ...}"
   → Console: "✅ Saved to localStorage: {...}"
   → Toast: "Profile settings saved successfully! ✅"
```

---

## ✅ Success Criteria

Username change **WORKING** jika:

1. ✅ Bisa ketik di input field
2. ✅ Console show log setiap perubahan
3. ✅ State ter-update dengan benar
4. ✅ Validation bekerja
5. ✅ Save berhasil ke localStorage
6. ✅ Data persist setelah refresh
7. ✅ Data terpisah per wallet
8. ✅ Toast notifications muncul

---

## 📞 Still Not Working?

Jika masih tidak berfungsi setelah semua langkah di atas:

1. **Share Console Logs**
   - Screenshot semua console logs
   - Include error messages (jika ada)

2. **Share Environment Info**
   - Browser: Chrome/Firefox/Safari/Edge
   - Version: ?
   - OS: Windows/Mac/Linux

3. **Share Test Results**
   - Checklist mana yang fail
   - Specific error messages
   - localStorage data (if any)

4. **Try Standalone Test**
   - Buka `test-profile-input.html`
   - Test di sana
   - Report hasil

---

**Last Updated:** 2024
**Status:** ✅ Fixed with Debugging Tools
**Test File:** `evonft-app/test-profile-input.html`
