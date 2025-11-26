# Wireframes Overview

## Desktop Wireframes (1920x1080)

### Layout Grid System
- 12-column grid
- Gutter: 24px
- Margin: 48px
- Max content width: 1440px

### Navigation Structure
```
┌────────────────────────────────────────────────────────────┐
│ [Logo 200px] [Nav Items 600px]        [Actions 300px]     │
└────────────────────────────────────────────────────────────┘
```

---

## Tablet Wireframes (768x1024)

### Layout Grid System
- 8-column grid
- Gutter: 16px
- Margin: 24px
- Full width content

### Navigation Structure
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] [Nav Items]                    [☰ Menu] [Connect]  │
└────────────────────────────────────────────────────────────┘
```

---

## Mobile Wireframes (375x812)

### Layout Grid System
- 4-column grid
- Gutter: 16px
- Margin: 16px
- Full width content

### Navigation Structure
```
┌──────────────────────────────────┐
│ [Logo]              [☰] [Connect]│
└──────────────────────────────────┘

Mobile Menu (Drawer):
┌──────────────────────────────────┐
│ [✕]                              │
│                                  │
│ [Home]                           │
│ [Explore]                        │
│ [My NFTs]                        │
│ [Staking]                        │
│ [Profile]                        │
│                                  │
│ ─────────────────────────────    │
│                                  │
│ [Settings]                       │
│ [Help]                           │
│ [Disconnect]                     │
└──────────────────────────────────┘
```

---

## Responsive Breakpoints

```javascript
const breakpoints = {
  mobile: '320px - 767px',
  tablet: '768px - 1023px',
  desktop: '1024px - 1439px',
  wide: '1440px+'
}
```

---

## Component Sizing

### NFT Cards
- Desktop: 280px x 380px
- Tablet: 220px x 320px
- Mobile: Full width (343px) x 420px

### Modals
- Desktop: 600px width (centered)
- Tablet: 90% width (max 600px)
- Mobile: Full screen

### Buttons
- Large: 48px height
- Medium: 40px height
- Small: 32px height

---

## Interaction States

### Hover States
```
Default → Hover
─────────────────
Background: surface → surface + 10% lighter
Border: none → primary color
Shadow: md → lg
Transform: none → scale(1.02)
Transition: 200ms ease
```

### Active States
```
Default → Active
─────────────────
Background: surface → primary color
Text: textPrimary → white
Shadow: md → inner shadow
Transform: none → scale(0.98)
```

### Focus States
```
Default → Focus
─────────────────
Outline: none → 2px solid primary
Outline offset: 2px
```

### Disabled States
```
Default → Disabled
─────────────────
Opacity: 1 → 0.5
Cursor: pointer → not-allowed
Background: interactive → muted
```

---

## Animation Specifications

### Page Transitions
```
Duration: 300ms
Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
Type: Fade + Slide
```

### Modal Animations
```
Enter:
  - Backdrop: fade in (200ms)
  - Content: scale(0.95) → scale(1) + fade in (300ms)

Exit:
  - Content: scale(1) → scale(0.95) + fade out (200ms)
  - Backdrop: fade out (200ms)
```

### Loading States
```
Skeleton Loading:
  - Shimmer effect
  - Duration: 1500ms
  - Direction: left to right
  - Gradient: gray-700 → gray-600 → gray-700
```

### Micro-interactions
```
Button Click:
  - Scale: 1 → 0.95 → 1
  - Duration: 150ms

Card Hover:
  - Lift: translateY(0) → translateY(-4px)
  - Shadow: md → lg
  - Duration: 200ms

Toast Notification:
  - Enter: slide in from top + fade
  - Exit: slide out to top + fade
  - Duration: 300ms
```

---

## Accessibility Considerations

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Focus Indicators
- Visible focus ring on all interactive elements
- Minimum 2px outline
- High contrast color (primary)

### Touch Targets
- Minimum size: 44x44px
- Spacing between targets: 8px minimum

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for icons
- Alt text for images
- Live regions for dynamic content

---

## Loading States

### Page Load
```
┌──────────────────────────────────┐
│                                  │
│         [Logo Animation]         │
│                                  │
│         Loading...               │
│         [Progress Bar]           │
│                                  │
└──────────────────────────────────┘
```

### Content Load (Skeleton)
```
┌──────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                  │
│ ▓▓▓▓▓▓ ▓▓▓▓▓▓   │
│ ▓▓▓▓ ▓▓▓▓▓▓▓▓   │
│                  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└──────────────────┘
```

### Transaction Pending
```
┌──────────────────────────────────┐
│                                  │
│      [Animated Spinner]          │
│                                  │
│   Transaction Pending...         │
│   Please wait                    │
│                                  │
│   [View on Explorer]             │
│                                  │
└──────────────────────────────────┘
```

---

## Error States

### Form Validation
```
┌──────────────────────────────────┐
│ Username                         │
│ [invalid input_______________]   │
│ ⚠️ Username already taken        │
└──────────────────────────────────┘
```

### Network Error
```
┌──────────────────────────────────┐
│                                  │
│      [Error Icon]                │
│                                  │
│   Connection Lost                │
│   Please check your network      │
│                                  │
│   [Retry]                        │
│                                  │
└──────────────────────────────────┘
```

### Transaction Failed
```
┌──────────────────────────────────┐
│                                  │
│      [❌ Icon]                   │
│                                  │
│   Transaction Failed             │
│   Insufficient funds             │
│                                  │
│   [Try Again] [Cancel]           │
│                                  │
└──────────────────────────────────┘
```

---

## Success States

### Transaction Success
```
┌──────────────────────────────────┐
│                                  │
│      [✅ Icon + Confetti]        │
│                                  │
│   Success!                       │
│   Your NFT has been minted       │
│                                  │
│   [View NFT] [Mint Another]      │
│                                  │
└──────────────────────────────────┘
```

### Level Up
```
┌──────────────────────────────────┐
│                                  │
│   [Animated NFT Evolution]       │
│                                  │
│   🎉 Level Up! 🎉               │
│   Level 5 → Level 6              │
│                                  │
│   New Trait Unlocked:            │
│   🔥 Fire Breath                 │
│                                  │
│   [Awesome!]                     │
│                                  │
└──────────────────────────────────┘
```

---

## Prototype Links

### Figma Prototype Flow
1. Landing → Connect Wallet
2. Marketplace → NFT Detail → Purchase
3. My Collection → NFT Detail → Feed/Train
4. Breeding Lab → Select Parents → Breed
5. Staking → Stake NFT → Claim Rewards

### Interactive Hotspots
- All buttons and links
- NFT cards (hover + click)
- Form inputs
- Modal triggers
- Tab navigation

---

## Design Handoff Checklist

### Assets to Export
- [ ] All icons (SVG)
- [ ] Logo variations (SVG + PNG)
- [ ] NFT placeholder images
- [ ] Background patterns
- [ ] Illustration assets

### Specifications to Document
- [ ] Color palette (hex codes)
- [ ] Typography scale
- [ ] Spacing system
- [ ] Border radius values
- [ ] Shadow definitions
- [ ] Animation timings
- [ ] Breakpoint values

### Component States
- [ ] Default
- [ ] Hover
- [ ] Active
- [ ] Focus
- [ ] Disabled
- [ ] Loading
- [ ] Error
- [ ] Success

### Developer Notes
- [ ] Component hierarchy
- [ ] Reusable patterns
- [ ] Conditional logic
- [ ] Data requirements
- [ ] API endpoints needed
- [ ] Smart contract interactions
