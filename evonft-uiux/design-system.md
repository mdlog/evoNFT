# EvoNFT Design System

## Brand Identity

### Mission
Membuat NFT yang hidup dan berkembang, menciptakan pengalaman digital yang personal dan bermakna.

### Values
- **Evolution**: Pertumbuhan berkelanjutan
- **Engagement**: Interaksi yang meaningful
- **Community**: Membangun bersama
- **Innovation**: Teknologi cutting-edge

---

## Visual Language

### Design Principles

1. **Clarity First**
   - Informasi penting mudah ditemukan
   - Hierarki visual yang jelas
   - Minimal cognitive load

2. **Delightful Interactions**
   - Smooth animations
   - Rewarding feedback
   - Playful micro-interactions

3. **Consistent & Scalable**
   - Reusable components
   - Predictable patterns
   - Easy to maintain

4. **Accessible to All**
   - WCAG 2.1 AA compliant
   - Keyboard navigation
   - Screen reader friendly

---

## Color System

### Primary Palette
```
Purple (Primary)
├─ 50:  #FAF5FF
├─ 100: #F3E8FF
├─ 200: #E9D5FF
├─ 300: #D8B4FE
├─ 400: #C084FC
├─ 500: #A855F7  ← Base
├─ 600: #9333EA
├─ 700: #7E22CE
├─ 800: #6B21A8
└─ 900: #581C87

Green (Secondary)
├─ 50:  #ECFDF5
├─ 100: #D1FAE5
├─ 200: #A7F3D0
├─ 300: #6EE7B7
├─ 400: #34D399
├─ 500: #10B981  ← Base
├─ 600: #059669
├─ 700: #047857
├─ 800: #065F46
└─ 900: #064E3B

Amber (Accent)
├─ 50:  #FFFBEB
├─ 100: #FEF3C7
├─ 200: #FDE68A
├─ 300: #FCD34D
├─ 400: #FBBF24
├─ 500: #F59E0B  ← Base
├─ 600: #D97706
├─ 700: #B45309
├─ 800: #92400E
└─ 900: #78350F
```

### Neutral Palette
```
Slate (Background & Text)
├─ 50:  #F8FAFC
├─ 100: #F1F5F9
├─ 200: #E2E8F0
├─ 300: #CBD5E1
├─ 400: #94A3B8
├─ 500: #64748B
├─ 600: #475569
├─ 700: #334155
├─ 800: #1E293B  ← Surface
└─ 900: #0F172A  ← Background
```

### Semantic Colors
```
Success: #10B981 (Green-500)
Error:   #EF4444 (Red-500)
Warning: #F59E0B (Amber-500)
Info:    #3B82F6 (Blue-500)
```

### Rarity Colors
```
Common:    #94A3B8 (Slate-400)
Uncommon:  #10B981 (Green-500)
Rare:      #3B82F6 (Blue-500)
Epic:      #A855F7 (Purple-500)
Legendary: #F59E0B (Amber-500)
```

### Usage Guidelines
- **Primary**: CTAs, links, active states
- **Secondary**: Success states, growth indicators
- **Accent**: Rewards, achievements, highlights
- **Background**: Main app background
- **Surface**: Cards, modals, elevated content
- **Text Primary**: Main content (Slate-50)
- **Text Secondary**: Supporting text (Slate-400)

---

## Typography

### Font Families
```
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'JetBrains Mono', 'Courier New', monospace
```

### Type Scale
```
Display:  64px / 72px (1.125)  - Bold
H1:       48px / 56px (1.167)  - Bold
H2:       36px / 44px (1.222)  - Bold
H3:       30px / 38px (1.267)  - Semibold
H4:       24px / 32px (1.333)  - Semibold
H5:       20px / 28px (1.400)  - Semibold
H6:       18px / 26px (1.444)  - Semibold
Body L:   18px / 28px (1.556)  - Regular
Body M:   16px / 24px (1.500)  - Regular
Body S:   14px / 20px (1.429)  - Regular
Caption:  12px / 16px (1.333)  - Regular
Overline: 10px / 16px (1.600)  - Medium (uppercase)
```

### Font Weights
```
Regular:  400
Medium:   500
Semibold: 600
Bold:     700
```

### Usage Guidelines
- **Display**: Hero sections, major announcements
- **H1-H3**: Page titles, section headers
- **H4-H6**: Card titles, subsections
- **Body L**: Important body text, descriptions
- **Body M**: Standard body text
- **Body S**: Secondary information, captions
- **Caption**: Timestamps, metadata
- **Overline**: Labels, categories
- **Monospace**: Wallet addresses, token IDs, code

---

## Spacing System

### Scale (8px base)
```
0:   0px
1:   4px   (0.5 × base)
2:   8px   (1 × base)
3:   12px  (1.5 × base)
4:   16px  (2 × base)
5:   20px  (2.5 × base)
6:   24px  (3 × base)
8:   32px  (4 × base)
10:  40px  (5 × base)
12:  48px  (6 × base)
16:  64px  (8 × base)
20:  80px  (10 × base)
24:  96px  (12 × base)
```

### Usage Guidelines
- **Component padding**: 4, 6 (16px, 24px)
- **Section spacing**: 8, 12, 16 (32px, 48px, 64px)
- **Element gaps**: 2, 3, 4 (8px, 12px, 16px)
- **Page margins**: 6, 8, 12 (24px, 32px, 48px)

---

## Layout

### Grid System
```
Desktop (1440px+):
  - Columns: 12
  - Gutter: 24px
  - Margin: 48px

Tablet (768px - 1439px):
  - Columns: 8
  - Gutter: 16px
  - Margin: 24px

Mobile (< 768px):
  - Columns: 4
  - Gutter: 16px
  - Margin: 16px
```

### Container Widths
```
Max width: 1440px
Centered with auto margins
```

### Breakpoints
```javascript
const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px'
}
```

---

## Border Radius

### Scale
```
none: 0px
sm:   4px   - Small elements, badges
md:   8px   - Buttons, inputs
lg:   12px  - Cards, modals
xl:   16px  - Large cards
2xl:  24px  - Hero sections
full: 9999px - Pills, avatars
```

---

## Shadows

### Elevation System
```
xs:   0 1px 2px rgba(0, 0, 0, 0.05)
sm:   0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06)
md:   0 4px 6px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.06)
lg:   0 10px 15px rgba(0, 0, 0, 0.1),
      0 4px 6px rgba(0, 0, 0, 0.05)
xl:   0 20px 25px rgba(0, 0, 0, 0.1),
      0 10px 10px rgba(0, 0, 0, 0.04)
2xl:  0 25px 50px rgba(0, 0, 0, 0.25)
```

### Glow Effects
```
primary: 0 0 20px rgba(168, 85, 247, 0.4)
success: 0 0 20px rgba(16, 185, 129, 0.4)
accent:  0 0 20px rgba(245, 158, 11, 0.4)
```

---

## Iconography

### Icon Set
- **Library**: Heroicons v2 (outline & solid)
- **Size scale**: 16px, 20px, 24px, 32px, 48px
- **Stroke width**: 1.5px (outline)

### Custom Icons
- NFT traits (fire, water, earth, air, etc.)
- Evolution stages
- Achievement badges
- Rarity indicators

### Usage Guidelines
- Use outline for navigation and actions
- Use solid for active states and emphasis
- Maintain consistent stroke width
- Ensure 1:1 aspect ratio

---

## Animations

### Timing Functions
```javascript
const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

### Duration Scale
```javascript
const duration = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms'
}
```

### Animation Types
```
Fade:     opacity transition
Slide:    transform translateY/X
Scale:    transform scale
Rotate:   transform rotate
Bounce:   spring easing + scale
Shimmer:  gradient animation
```

---

## Accessibility

### Color Contrast
- Text on background: ≥ 4.5:1
- Large text (18px+): ≥ 3:1
- UI components: ≥ 3:1

### Focus States
- Visible focus ring: 2px solid primary
- Offset: 2px
- Never remove focus indicators

### Touch Targets
- Minimum size: 44x44px
- Spacing: ≥ 8px between targets

### Motion
- Respect prefers-reduced-motion
- Provide alternatives to animations
- Keep animations under 500ms

### Screen Readers
- Semantic HTML
- ARIA labels for icons
- Alt text for images
- Live regions for updates

---

## Component Patterns

### Cards
```
Background: surface (Slate-800)
Border: 1px solid Slate-700
Border radius: lg (12px)
Padding: 6 (24px)
Shadow: md
Hover: shadow lg + translateY(-4px)
```

### Buttons
```
Primary:
  - Background: Primary-500
  - Text: White
  - Hover: Primary-600
  - Active: Primary-700

Secondary:
  - Background: Transparent
  - Border: 1px solid Primary-500
  - Text: Primary-500
  - Hover: Background Primary-500/10

Ghost:
  - Background: Transparent
  - Text: Slate-50
  - Hover: Background Slate-800
```

### Inputs
```
Background: Slate-900
Border: 1px solid Slate-700
Border radius: md (8px)
Padding: 3 4 (12px 16px)
Focus: Border Primary-500 + shadow
Error: Border Error + error message
```

### Modals
```
Backdrop: rgba(0, 0, 0, 0.75)
Container: Surface (Slate-800)
Border radius: xl (16px)
Padding: 6 (24px)
Shadow: 2xl
Max width: 600px
```

---

## Implementation Notes

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #A855F7;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  
  /* Spacing */
  --spacing-unit: 8px;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}
```

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
        accent: {...}
      },
      fontFamily: {
        sans: ['Inter', ...],
        mono: ['JetBrains Mono', ...]
      },
      spacing: {...},
      borderRadius: {...},
      boxShadow: {...}
    }
  }
}
```

---

## Design Tokens Export

### For Developers
- JSON format for easy import
- CSS variables for runtime theming
- Tailwind config for utility classes

### For Designers
- Figma styles library
- Sketch symbols
- Adobe XD components

---

## Version History

- v1.0 (Current): Initial design system
- Future: Dark/Light mode toggle
- Future: Customizable themes
