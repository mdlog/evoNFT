# EvoNFT - UI/UX Design Structure

## Project Overview
Aplikasi dApp untuk Smart NFTs yang berkembang seiring waktu di Polygon network.

## Design System

### Color Palette
- Primary: #8B5CF6 (Purple) - Evolution & Magic
- Secondary: #10B981 (Green) - Growth & Progress
- Accent: #F59E0B (Amber) - Rewards & Achievements
- Background: #0F172A (Dark Blue)
- Surface: #1E293B (Slate)
- Text Primary: #F1F5F9
- Text Secondary: #94A3B8

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Monospace: JetBrains Mono (untuk addresses & stats)

### Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## User Personas

### Persona 1: Collector
- Ingin memiliki NFT unik yang berkembang
- Fokus pada visual evolution
- Suka showcase koleksi

### Persona 2: Trader
- Mencari NFT dengan potential value tinggi
- Fokus pada stats dan rarity
- Aktif di marketplace

### Persona 3: Gamer
- Ingin interact dengan NFT
- Fokus pada leveling dan achievements
- Suka competitive features

## Information Architecture

```
├── Home
├── Explore (Marketplace)
├── My Collection
│   ├── NFT Detail
│   │   ├── Overview
│   │   ├── Evolution History
│   │   ├── Stats & Traits
│   │   └── Actions (Feed, Train, Stake)
│   └── Breeding Lab
├── Leaderboard
├── Staking Pool
└── Profile
    ├── Wallet Info
    ├── Activity History
    └── Settings
```

## Screen Specifications

Lihat folder `/screens` untuk detail setiap halaman.
Lihat folder `/components` untuk reusable components.
Lihat folder `/user-flows` untuk user journey maps.
