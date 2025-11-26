# 🌈 RainbowKit Quick Start

## Setup Cepat (5 Menit)

### 1. Dapatkan WalletConnect Project ID

```bash
# Buka browser dan kunjungi:
https://cloud.walletconnect.com

# 1. Sign up / Login
# 2. Create New Project
# 3. Copy Project ID
```

### 2. Update Project ID

Edit file `evonft-app/src/config/rainbowkit.js`:

```javascript
projectId: 'PASTE_YOUR_PROJECT_ID_HERE'
```

### 3. Jalankan Migration Script

```bash
./migrate-to-rainbowkit.sh
```

Atau manual update `evonft-app/src/App.jsx`:

```javascript
// Ganti import
import { RainbowWeb3Provider } from './context/RainbowWeb3Context'
import NavbarRainbow from './components/NavbarRainbow'

// Ganti provider
<RainbowWeb3Provider>
  <Router>
    <NavbarRainbow />
    {/* ... */}
  </Router>
</RainbowWeb3Provider>
```

### 4. Test

```bash
cd evonft-app
npm run dev
```

Buka http://localhost:5173 dan klik tombol "Connect Wallet"

## Fitur RainbowKit

### ✅ Yang Sudah Dikonfigurasi

- **Multi-wallet support**: MetaMask, WalletConnect, Coinbase, Rainbow, dll
- **Custom theme**: Matching dengan design EvoNFT (purple gradient)
- **Network support**: Polygon Amoy Testnet & Polygon Mainnet
- **Auto network switching**: Otomatis prompt untuk switch ke Polygon Amoy
- **Responsive UI**: Mobile-friendly dengan WalletConnect
- **Recent transactions**: Tracking transaksi otomatis

### 🎨 Custom Theme

Theme sudah disesuaikan dengan warna EvoNFT:
- Primary color: `#8B5CF6` (purple)
- Secondary color: `#EC4899` (pink)
- Dark mode dengan glass effect
- Gradient buttons

### 📱 Wallet yang Didukung

- MetaMask (Desktop & Mobile)
- WalletConnect (Semua mobile wallets)
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- Ledger
- Dan banyak lagi...

## Kustomisasi

### Ubah Wallet yang Ditampilkan

Edit `evonft-app/src/config/rainbowkit.js`:

```javascript
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { wallets } = getDefaultWallets({
  appName: 'EvoNFT',
  projectId: 'YOUR_PROJECT_ID',
});

export const config = createConfig({
  // ... config
  wallets: [
    ...wallets,
    // Tambah wallet custom
  ],
});
```

### Ubah Theme

Edit `customTheme` di `evonft-app/src/config/rainbowkit.js`:

```javascript
export const customTheme = {
  colors: {
    accentColor: '#YOUR_COLOR',
    // ... colors lainnya
  },
};
```

### Custom Connect Button

Ganti `<ConnectButton />` dengan custom button:

```javascript
import { ConnectButton } from '@rainbow-me/rainbowkit';

<ConnectButton.Custom>
  {({ account, chain, openConnectModal, openAccountModal }) => {
    return account ? (
      <button onClick={openAccountModal}>
        {account.displayName}
      </button>
    ) : (
      <button onClick={openConnectModal}>
        Connect Wallet
      </button>
    );
  }}
</ConnectButton.Custom>
```

## Troubleshooting

### Error: "Project ID is required"

Pastikan sudah update Project ID di `rainbowkit.js`

### Error: "Chain not configured"

Pastikan Polygon Amoy ada di chains config:

```javascript
chains: [polygonAmoy, polygon]
```

### Wallet tidak muncul

Clear browser cache dan reload

### Network tidak switch otomatis

Gunakan `switchToAmoy()` dari useWeb3 hook:

```javascript
const { switchToAmoy, isCorrectNetwork } = useWeb3();

if (!isCorrectNetwork) {
  await switchToAmoy();
}
```

## Resources

- [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)

## Support

Jika ada masalah, check:
1. Console browser untuk error messages
2. Network tab untuk failed requests
3. MetaMask untuk pending transactions
4. RAINBOWKIT_MIGRATION.md untuk detail lengkap
