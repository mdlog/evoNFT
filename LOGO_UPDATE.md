# 🎨 Logo Update Instructions

## Changes Made

### 1. Navbar Logo
**File:** `evonft-app/src/components/Navbar.jsx`

**Before:**
```jsx
<div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
    <span className="text-xl">🐉</span>
</div>
```

**After:**
```jsx
<img 
    src="/logo.png" 
    alt="EvoNFT Logo" 
    className="w-10 h-10 rounded-xl group-hover:scale-110 transition-transform duration-300 object-contain"
/>
```

### 2. Favicon
**File:** `evonft-app/index.html`

**Before:**
```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**After:**
```html
<link rel="icon" type="image/png" href="/logo.png" />
```

## How to Apply

### Step 1: Copy Logo File

Run this command:
```bash
chmod +x copy-logo.sh
./copy-logo.sh
```

Or manually:
```bash
cp /media/mdlog/mdlog/Project-MDlabs/polygon-nft/evoNFT-logo1.png evonft-app/public/logo.png
```

### Step 2: Verify File Exists

```bash
ls -la evonft-app/public/logo.png
```

Should show:
```
-rw-rw-r-- 1 mdlog mdlog 102362 ... evonft-app/public/logo.png
```

### Step 3: Restart Frontend

```bash
cd evonft-app
npm run dev
```

### Step 4: Clear Browser Cache

Hard refresh in browser:
- Chrome/Edge: Ctrl+Shift+R
- Firefox: Ctrl+F5

## Verification

After restart, you should see:

1. **Navbar Logo** - Custom logo instead of 🐉 emoji
2. **Browser Tab** - Custom favicon instead of Vite logo
3. **Hover Effect** - Logo scales up on hover

## Troubleshooting

### Logo not showing
- Check file exists: `ls evonft-app/public/logo.png`
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for 404 errors

### Logo too big/small
Edit Navbar.jsx:
```jsx
className="w-10 h-10"  // Change size here
```

### Logo not centered
Add to className:
```jsx
className="... object-contain"  // or object-cover
```

## Logo Specifications

- **File:** evoNFT-logo1.png
- **Size:** 102,362 bytes
- **Location:** `/media/mdlog/mdlog/Project-MDlabs/polygon-nft/evoNFT-logo1.png`
- **Target:** `evonft-app/public/logo.png`

## Additional Customization

### Change Logo Size
```jsx
// Small
className="w-8 h-8"

// Medium (current)
className="w-10 h-10"

// Large
className="w-12 h-12"
```

### Add Background
```jsx
className="w-10 h-10 bg-white/10 rounded-xl p-1"
```

### Add Border
```jsx
className="w-10 h-10 border-2 border-primary-500 rounded-xl"
```

---

**Status:** Ready to apply
**Time:** 2 minutes
