# User Flows

## Flow 1: First-Time User Onboarding

```
START
  ↓
Landing Page
  ↓
[Connect Wallet] clicked
  ↓
Wallet Selection Modal
  ↓
MetaMask/WalletConnect prompt
  ↓
Wallet Connected ✓
  ↓
Welcome Modal (First-time only)
  ├─ "How it works" tutorial
  ├─ "Mint your first NFT" CTA
  └─ "Explore marketplace" CTA
  ↓
User chooses action
  ├─ Mint → Flow 2
  └─ Explore → Flow 3
```

---

## Flow 2: Minting First NFT

```
START (from onboarding or navbar)
  ↓
Mint Page
  ├─ Preview random NFT traits
  ├─ Show mint price
  └─ [Mint NFT] button
  ↓
Click [Mint NFT]
  ↓
Transaction Confirmation Modal
  ├─ Review details
  ├─ Gas estimate
  └─ [Confirm] button
  ↓
Wallet approval prompt
  ↓
Transaction pending...
  ├─ Show loading animation
  └─ "Don't close this window"
  ↓
Transaction confirmed ✓
  ↓
Success Modal
  ├─ Show minted NFT
  ├─ NFT details (ID, traits, level)
  ├─ [View NFT] button
  └─ [Mint Another] button
  ↓
User chooses action
  ├─ View NFT → NFT Detail Page
  └─ Mint Another → Repeat flow
```

---

## Flow 3: Exploring & Buying NFT

```
START
  ↓
Marketplace Page
  ├─ Browse NFT grid
  ├─ Apply filters (level, rarity, price)
  └─ Search by ID/name
  ↓
Click on NFT Card
  ↓
NFT Detail Page
  ├─ View 3D model
  ├─ Check stats & traits
  ├─ View evolution history
  └─ See price
  ↓
Decision point
  ├─ Not interested → Back to marketplace
  └─ Interested → Continue
  ↓
Click [Buy Now]
  ↓
Purchase Confirmation Modal
  ├─ NFT details
  ├─ Price breakdown
  ├─ Gas estimate
  └─ [Confirm Purchase]
  ↓
Wallet approval prompt
  ↓
Transaction pending...
  ↓
Transaction confirmed ✓
  ↓
Success Modal
  ├─ "NFT is now yours!"
  ├─ [View in Collection]
  └─ [Keep Exploring]
  ↓
NFT added to user's collection
```

---

## Flow 4: Interacting with Owned NFT

```
START
  ↓
My Collection Page
  ↓
Select NFT
  ↓
NFT Detail Page
  ↓
Choose action:
  ├─ Feed
  ├─ Train
  ├─ Stake
  ├─ List for Sale
  └─ Breed

─────────────────────
FEED PATH:
  ↓
Click [Feed]
  ↓
Feed Modal
  ├─ Select food type
  └─ See XP gain preview
  ↓
[Confirm Feed]
  ↓
Transaction approval
  ↓
Success! XP added
  ├─ Update XP bar
  └─ Check if leveled up
      ├─ Yes → Evolution animation
      └─ No → Return to detail page

─────────────────────
TRAIN PATH:
  ↓
Click [Train]
  ↓
Training Modal
  ├─ Select training type
  ├─ See stat increase
  └─ See XP gain
  ↓
[Start Training]
  ↓
Transaction approval
  ↓
Success! Stats updated
  └─ Return to detail page

─────────────────────
STAKE PATH:
  ↓
Click [Stake]
  ↓
Staking Confirmation Modal
  ├─ Show earning rate
  ├─ Show tier bonuses
  └─ Warning about locking
  ↓
[Confirm Stake]
  ↓
Transaction approval
  ↓
Success! NFT staked
  └─ Redirect to Staking page

─────────────────────
LIST FOR SALE PATH:
  ↓
Click [List for Sale]
  ↓
Listing Modal
  ├─ Set price
  ├─ Set duration
  └─ Preview fees
  ↓
[Create Listing]
  ↓
Transaction approval
  ↓
Success! Listed on marketplace
  └─ NFT marked as "Listed"

─────────────────────
BREED PATH:
  → See Flow 5
```

---

## Flow 5: Breeding NFTs

```
START
  ↓
Breeding Lab Page
  ↓
[Select Parent 1]
  ↓
Parent Selection Modal
  ├─ Show eligible NFTs
  ├─ Filter by breed count
  └─ Exclude staked/listed
  ↓
Select NFT → Parent 1 set ✓
  ↓
[Select Parent 2]
  ↓
Parent Selection Modal
  ├─ Show compatible NFTs
  └─ Exclude Parent 1
  ↓
Select NFT → Parent 2 set ✓
  ↓
Offspring Preview Generated
  ├─ Show predicted traits
  ├─ Show compatibility score
  ├─ Show success rate
  └─ Show breeding cost
  ↓
Review details
  ↓
Check confirmation box
  ↓
[Start Breeding] enabled
  ↓
Click [Start Breeding]
  ↓
Transaction approval
  ↓
Breeding initiated ✓
  ├─ Both parents locked
  ├─ 24h countdown starts
  └─ Show progress page
  ↓
Wait 24 hours...
  ├─ User can check progress anytime
  └─ Notification when complete
  ↓
Breeding Complete!
  ↓
Hatching Animation
  ↓
Reveal New NFT
  ├─ Show offspring details
  ├─ Show inherited traits
  └─ Show rarity
  ↓
[View NFT] → NFT Detail Page
```

---

## Flow 6: Staking & Earning

```
START
  ↓
Staking Pool Page
  ↓
[Stake New] clicked
  ↓
NFT Selection Modal
  ├─ Show eligible NFTs
  ├─ Multi-select enabled
  └─ Show earning preview
  ↓
Select NFT(s)
  ↓
Review staking details
  ├─ Earning rate
  ├─ Tier bonuses
  └─ Warnings
  ↓
[Stake Selected]
  ↓
Transaction approval
  ↓
NFTs staked ✓
  ├─ Start earning XP
  └─ Start earning MATIC
  ↓
Return to Staking page
  ├─ View staked NFTs
  └─ Track earnings
  ↓
Time passes...
  ├─ Earnings accumulate
  └─ Tier upgrades
  ↓
User returns
  ↓
[Claim Rewards]
  ↓
Claim Modal
  ├─ Show pending rewards
  └─ Choose claim options
  ↓
[Confirm Claim]
  ↓
Transaction approval
  ↓
Rewards claimed ✓
  ├─ XP added to NFTs
  └─ MATIC sent to wallet
  ↓
Optional: [Unstake]
  ↓
Unstake Confirmation
  ├─ Show tier loss warning
  └─ Auto-claim remaining rewards
  ↓
[Confirm Unstake]
  ↓
Transaction approval
  ↓
NFT unstaked ✓
  └─ 24h cooldown before re-stake
```

---

## Flow 7: Selling NFT

```
START
  ↓
My Collection Page
  ↓
Select NFT to sell
  ↓
NFT Detail Page
  ↓
[List for Sale]
  ↓
Listing Modal
  ├─ Enter price (MATIC)
  ├─ Select duration (7/14/30 days)
  ├─ Preview marketplace fee (2.5%)
  └─ Preview net earnings
  ↓
[Create Listing]
  ↓
Transaction approval
  ↓
Listed successfully ✓
  ├─ NFT appears on marketplace
  └─ NFT marked as "Listed" in collection
  ↓
Wait for buyer...
  ├─ Can view listing anytime
  └─ Can delist if needed
  ↓
Buyer purchases
  ↓
Notification: "NFT Sold!"
  ├─ MATIC sent to wallet
  ├─ NFT transferred to buyer
  └─ Activity logged
  ↓
END
```

---

## Flow 8: Evolution & Level Up

```
START (automatic trigger)
  ↓
NFT gains enough XP
  ↓
Level up condition met
  ↓
Evolution Animation
  ├─ Visual transformation
  ├─ Particle effects
  └─ Sound effects
  ↓
Level Up Modal
  ├─ "Level X → Level Y"
  ├─ New stats revealed
  ├─ New traits unlocked (if any)
  └─ Visual changes shown
  ↓
Celebration confetti 🎉
  ↓
[View Updated NFT]
  ↓
NFT Detail Page
  ├─ Updated level badge
  ├─ Updated stats
  ├─ New traits displayed
  └─ Updated image (if evolved)
  ↓
Achievement unlocked (if milestone)
  └─ Notification shown
  ↓
END
```

---

## Flow 9: Profile Management

```
START
  ↓
Click [Profile] in navbar
  ↓
Profile Page
  ├─ View stats
  ├─ View activity
  └─ View achievements
  ↓
[Edit Profile]
  ↓
Edit Profile Modal
  ├─ Change username
  ├─ Update bio
  ├─ Change avatar
  │   ├─ Upload image
  │   └─ Use owned NFT
  └─ Add social links
  ↓
[Save Changes]
  ↓
Profile updated ✓
  ↓
Return to Profile Page
  ↓
Optional: [Settings]
  ↓
Settings Tab
  ├─ Notification preferences
  ├─ Privacy settings
  └─ Wallet management
  ↓
Update settings
  ↓
[Save Settings]
  ↓
Settings saved ✓
```

---

## Flow 10: Error Handling

```
Transaction Failed
  ↓
Error Modal
  ├─ Show error message
  ├─ Show reason (if available)
  └─ Suggest solutions
  ↓
User options:
  ├─ [Try Again]
  ├─ [Cancel]
  └─ [Get Help] → Support page

Insufficient Funds
  ↓
Warning Modal
  ├─ "Insufficient MATIC"
  ├─ Show required amount
  └─ Show current balance
  ↓
[Add Funds] → External bridge/exchange

Network Error
  ↓
Error Toast
  ├─ "Connection lost"
  └─ Auto-retry in background
  ↓
Connection restored
  └─ Success toast

Wallet Disconnected
  ↓
Redirect to Home
  ├─ Show "Wallet disconnected"
  └─ [Reconnect] button
```

---

## Key User Journeys Summary

1. **New User**: Connect → Mint → Interact → Evolve
2. **Collector**: Browse → Buy → Collect → Showcase
3. **Trader**: Buy Low → Evolve → Sell High
4. **Breeder**: Collect Parents → Breed → Sell Offspring
5. **Staker**: Stake → Earn → Compound → Unstake
6. **Gamer**: Level Up → Unlock Traits → Compete

Each flow is designed to be intuitive, with clear CTAs and feedback at every step.
