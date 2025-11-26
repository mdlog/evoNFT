# 🌈 RainbowKit Integration

## Setup (2 Menit)

### 1. Get WalletConnect Project ID

```bash
# Visit: https://cloud.walletconnect.com
# 1. Sign up / Login
# 2. Click "Create New Project"
# 3. Enter project name: "EvoNFT"
# 4. Copy the Project ID
```

### 2. Add to .env

```bash
# Add to evonft-app/.env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Update App.jsx

```javascript
// Change imports
import { RainbowWeb3Provider } from './context/RainbowWeb3Context'
import NavbarRainbow from './components/NavbarRainbow'

// Change provider
function App() {
    return (
        <RainbowWeb3Provider>
            <Router>
                <NavbarRainbow />
                {/* rest of your app */}
            </Router>
        </RainbowWeb3Provider>
    )
}
```

### 4. Run

```bash
npm run dev
```

## What You Get

### 🎨 Beautiful UI
- Modern wallet connection modal
- Smooth animations
- Mobile responsive
- Custom EvoNFT theme (purple gradient)

### 💼 Multiple Wallets
- MetaMask
- WalletConnect (all mobile wallets)
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- Ledger
- 50+ more wallets

### 🔧 Developer Features
- TypeScript support
- React hooks
- Automatic transaction tracking
- ENS name resolution
- Network switching
- Recent transactions

## Usage

### Connect Button

```javascript
import { ConnectButton } from '@rainbow-me/rainbowkit';

<ConnectButton />
```

### Custom Button

```javascript
<ConnectButton.Custom>
  {({ account, chain, openConnectModal }) => (
    <button onClick={openConnectModal}>
      {account ? account.displayName : 'Connect'}
    </button>
  )}
</ConnectButton.Custom>
```

### Use Web3 Hook

```javascript
import { useWeb3 } from '../context/RainbowWeb3Context';

function MyComponent() {
  const { 
    account,          // User address
    isConnected,      // Connection status
    disconnect,       // Disconnect function
    provider,         // Ethers provider
    signer,           // Ethers signer
    chainId,          // Current chain ID
    isCorrectNetwork, // Check if on Polygon Amoy
    switchToAmoy      // Switch to Polygon Amoy
  } = useWeb3();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {account}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

## Customization

### Theme

Edit `src/config/rainbowkit.js`:

```javascript
export const customTheme = {
  colors: {
    accentColor: '#8B5CF6', // Change primary color
    // ... more colors
  },
};
```

### Chains

```javascript
import { polygon, polygonAmoy, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  chains: [polygonAmoy, polygon, mainnet], // Add more chains
  // ...
});
```

### Wallets

```javascript
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { wallets } = getDefaultWallets({
  appName: 'EvoNFT',
  projectId: 'YOUR_PROJECT_ID',
});

// Customize wallet list
```

## Migration from Old Web3Context

### Before
```javascript
import { useWeb3 } from './context/Web3Context'

const { account, connectWallet } = useWeb3()

<button onClick={connectWallet}>Connect</button>
```

### After
```javascript
import { useWeb3 } from './context/RainbowWeb3Context'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const { account } = useWeb3()

<ConnectButton />
```

## Troubleshooting

### "Project ID is required"
Add `VITE_WALLETCONNECT_PROJECT_ID` to `.env`

### Wallet not connecting
1. Check console for errors
2. Try different wallet
3. Clear browser cache
4. Check network configuration

### Network switch fails
1. Manually add network in wallet
2. Check RPC URL in config
3. Verify chain ID

### Build errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [RainbowKit Docs](https://www.rainbowkit.com)
- [Wagmi Docs](https://wagmi.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Viem Docs](https://viem.sh)

## Files Created

```
evonft-app/
├── src/
│   ├── config/
│   │   └── rainbowkit.js          # RainbowKit config
│   ├── context/
│   │   └── RainbowWeb3Context.jsx # Web3 provider
│   └── components/
│       └── NavbarRainbow.jsx      # Navbar with ConnectButton
├── .env.example                    # Environment template
└── RAINBOWKIT_README.md           # This file
```

## Support

Need help? Check:
1. Console errors
2. Network tab
3. RainbowKit Discord
4. GitHub issues
5. Documentation files

---

**Ready to use!** 🚀
