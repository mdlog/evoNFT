# Component Library

## Core Components

### 1. Navbar
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] EvoNFT        [Explore] [Stake] [My NFTs]  [Connect] │
└─────────────────────────────────────────────────────────────┘
```

**Props:**
- isConnected: boolean
- walletAddress: string
- onConnect: function
- onDisconnect: function

**States:**
- Default (not connected)
- Connected (shows wallet address)
- Mobile (hamburger menu)

---

### 2. NFT Card
```
┌──────────────────┐
│                  │
│   [NFT Image]    │
│   Level Badge    │
│                  │
├──────────────────┤
│ EvoNFT #1234     │
│ ⭐⭐⭐ Rare       │
├──────────────────┤
│ Level: 5         │
│ XP: 2,450/5,000  │
├──────────────────┤
│ 💎 2.5 MATIC     │
├──────────────────┤
│ [Action Button]  │
└──────────────────┘
```

**Props:**
- nft: object (id, name, level, xp, image, rarity, price)
- variant: 'marketplace' | 'collection' | 'staked'
- onAction: function
- showPrice: boolean

**Variants:**
- Marketplace: Shows price + Buy button
- Collection: Shows XP bar + Manage button
- Staked: Shows earnings + Unstake button

---

### 3. Stats Card
```
┌──────────────┐
│   12,543     │
│   [Icon]     │
│   Total      │
│   Minted     │
└──────────────┘
```

**Props:**
- value: string | number
- label: string
- icon: ReactNode
- trend: 'up' | 'down' | 'neutral' (optional)
- trendValue: string (optional)

---

### 4. Progress Bar
```
████████░░ 80%
```

**Props:**
- current: number
- max: number
- showPercentage: boolean
- color: 'primary' | 'success' | 'warning' | 'danger'
- size: 'sm' | 'md' | 'lg'

---

### 5. Level Badge
```
┌─────────┐
│ LVL 5   │
└─────────┘
```

**Props:**
- level: number
- size: 'sm' | 'md' | 'lg'
- variant: 'default' | 'gold' | 'legendary'

---

### 6. Trait Icon
```
🔥 Fire Breath
```

**Props:**
- trait: object (name, icon, rarity)
- showName: boolean
- size: 'sm' | 'md' | 'lg'

---

### 7. Button
```
[Primary Button]
[Secondary Button]
[Outline Button]
[Icon Button]
```

**Props:**
- variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- size: 'sm' | 'md' | 'lg'
- icon: ReactNode (optional)
- loading: boolean
- disabled: boolean
- fullWidth: boolean

---

### 8. Modal
```
┌─────────────────────────────┐
│ Modal Title         [✕]     │
├─────────────────────────────┤
│                             │
│   Modal Content             │
│                             │
├─────────────────────────────┤
│ [Cancel]      [Confirm]     │
└─────────────────────────────┘
```

**Props:**
- isOpen: boolean
- onClose: function
- title: string
- children: ReactNode
- size: 'sm' | 'md' | 'lg' | 'xl'
- showFooter: boolean

---

### 9. Tabs
```
[Active Tab] [Inactive Tab] [Inactive Tab]
─────────────
```

**Props:**
- tabs: array of {id, label, content}
- activeTab: string
- onChange: function
- variant: 'default' | 'pills'

---

### 10. Filter Sidebar
```
┌─────────────┐
│  FILTERS    │
│             │
│ Category    │
│ ☑️ Option 1 │
│ ☐ Option 2  │
│             │
│ [Apply]     │
│ [Reset]     │
└─────────────┘
```

**Props:**
- filters: array of filter groups
- activeFilters: object
- onChange: function
- onApply: function
- onReset: function

---

### 11. Search Bar
```
┌────────────────────────────────────┐
│ 🔍 Search NFT by name or ID...     │
└────────────────────────────────────┘
```

**Props:**
- placeholder: string
- value: string
- onChange: function
- onSearch: function
- debounceMs: number

---

### 12. Wallet Connect Button
```
[🦊 Connect Wallet]
```

**Props:**
- onConnect: function
- connectedAddress: string
- showBalance: boolean

**States:**
- Disconnected: "Connect Wallet"
- Connecting: "Connecting..." (loading)
- Connected: "0x742d...f0bEb" (truncated address)

---

### 13. Toast Notification
```
┌─────────────────────────────────┐
│ ✅ Transaction Successful!      │
│ Your NFT has been minted        │
└─────────────────────────────────┘
```

**Props:**
- type: 'success' | 'error' | 'warning' | 'info'
- title: string
- message: string
- duration: number
- onClose: function

---

### 14. Loading Spinner
```
    ⟳
  Loading...
```

**Props:**
- size: 'sm' | 'md' | 'lg'
- text: string (optional)
- fullScreen: boolean

---

### 15. Empty State
```
┌─────────────────────────────┐
│                             │
│      [Empty Icon]           │
│                             │
│   No items found            │
│   Try adjusting filters     │
│                             │
│   [Action Button]           │
│                             │
└─────────────────────────────┘
```

**Props:**
- icon: ReactNode
- title: string
- description: string
- action: {label, onClick} (optional)

---

### 16. Dropdown Menu
```
┌─────────────────┐
│ ✓ Option 1      │
│   Option 2      │
│   Option 3      │
│ ─────────────── │
│   Delete        │
└─────────────────┘
```

**Props:**
- items: array of {label, value, icon, onClick}
- trigger: ReactNode
- align: 'left' | 'right'

---

### 17. Tooltip
```
[Hover me]
    ↓
┌─────────────┐
│ Tooltip text│
└─────────────┘
```

**Props:**
- content: string | ReactNode
- position: 'top' | 'bottom' | 'left' | 'right'
- children: ReactNode

---

### 18. Avatar
```
┌─────┐
│ [A] │  or  [Image]
└─────┘
```

**Props:**
- src: string (optional)
- alt: string
- size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- fallback: string (initials)

---

### 19. Countdown Timer
```
⏱️ 23h 45m 12s
```

**Props:**
- targetDate: Date
- onComplete: function
- format: 'full' | 'short'

---

### 20. Rarity Badge
```
⭐⭐⭐⭐⭐ Legendary
```

**Props:**
- rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
- showLabel: boolean
- size: 'sm' | 'md' | 'lg'

---

## Composite Components

### 21. NFT Grid
- Container for multiple NFT Cards
- Handles responsive layout
- Supports infinite scroll/pagination

### 22. Evolution Timeline
- Visual representation of NFT evolution stages
- Shows current level and next milestones
- Interactive (click to see details)

### 23. Breeding Selector
- Two-panel parent selection
- Shows compatibility score
- Displays predicted offspring

### 24. Staking Dashboard
- Overview of staked NFTs
- Earnings calculator
- Tier progress indicators

### 25. Activity Feed
- List of recent activities
- Filterable by type
- Real-time updates

---

## Design Tokens

### Colors
```javascript
const colors = {
  primary: '#8B5CF6',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6'
}
```

### Spacing
```javascript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px'
}
```

### Border Radius
```javascript
const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
}
```

### Shadows
```javascript
const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
}
```
