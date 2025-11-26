# Migrasi ke RainbowKit

## Langkah-langkah Implementasi

### 1. Install Dependencies ✅
```bash
npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
```

### 2. Dapatkan WalletConnect Project ID
1. Kunjungi https://cloud.walletconnect.com
2. Buat project baru
3. Copy Project ID
4. Update di `evonft-app/src/config/rainbowkit.js`:
   ```javascript
   projectId: 'YOUR_PROJECT_ID_HERE'
   ```

### 3. Update App.jsx

Ganti import dan provider:

```javascript
// Ganti ini:
import { Web3Provider } from './context/Web3Context'
import Navbar from './components/Navbar'

// Dengan ini:
import { RainbowWeb3Provider } from './context/RainbowWeb3Context'
import NavbarRainbow from './components/NavbarRainbow'

// Ganti Web3Provider dengan RainbowWeb3Provider
function App() {
    return (
        <RainbowWeb3Provider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <NavbarRainbow />
                    {/* ... rest of code */}
                </div>
            </Router>
        </RainbowWeb3Provider>
    )
}
```

### 4. Update Import di Semua File

Ganti semua import Web3Context:

```javascript
// Dari:
import { useWeb3 } from '../context/Web3Context'

// Ke:
import { useWeb3 } from '../context/RainbowWeb3Context'
```

File yang perlu diupdate:
- `src/hooks/useContract.js`
- `src/components/MintNFT.jsx`
- `src/pages/*.jsx` (semua halaman yang menggunakan useWeb3)
- Dan file lainnya yang menggunakan Web3Context

### 5. Kustomisasi Theme (Opsional)

Tambahkan custom theme di `src/config/rainbowkit.js`:

```javascript
import { darkTheme } from '@rainbow-me/rainbowkit';

// Di RainbowKitProvider
<RainbowKitProvider theme={darkTheme({
    accentColor: '#8B5CF6', // primary color
    accentColorForeground: 'white',
    borderRadius: 'large',
})}>
```

## Keuntungan RainbowKit

✅ **Multi-wallet support** - MetaMask, WalletConnect, Coinbase, Rainbow, dll
✅ **Beautiful UI** - Modal yang modern dan responsive
✅ **Network switching** - Mudah switch network
✅ **Recent transactions** - Tracking transaksi otomatis
✅ **ENS support** - Menampilkan ENS names
✅ **Avatar support** - Menampilkan NFT avatars
✅ **Mobile optimized** - Support WalletConnect untuk mobile
✅ **Customizable** - Theme dan styling yang fleksibel

## Testing

1. Jalankan dev server:
   ```bash
   npm run dev
   ```

2. Test koneksi dengan berbagai wallet:
   - MetaMask
   - WalletConnect (mobile)
   - Coinbase Wallet
   - Rainbow Wallet

3. Test network switching ke Polygon Amoy

## Rollback (Jika Diperlukan)

Jika ada masalah, kembalikan ke Web3Context lama:

1. Revert changes di `App.jsx`
2. Gunakan `Navbar` dan `Web3Provider` yang lama
3. Hapus import RainbowKit

## File Baru yang Dibuat

- `src/config/rainbowkit.js` - Konfigurasi RainbowKit
- `src/context/RainbowWeb3Context.jsx` - Context provider baru
- `src/components/NavbarRainbow.jsx` - Navbar dengan RainbowKit button

## Catatan

- Web3Context lama masih ada dan bisa digunakan sebagai fallback
- RainbowWeb3Context kompatibel dengan API Web3Context yang lama
- Tidak perlu mengubah logic di komponen lain, hanya import path
