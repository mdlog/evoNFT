# NFT History Feature ✅

## Overview

Menambahkan fitur history/activity log di halaman detail NFT yang menampilkan semua transaksi feed dan train yang dilakukan user terhadap NFT-nya.

## Features

### 📜 Activity Types

1. **Feed Events** 🍖
   - Basic Food (+50 XP)
   - Premium Food (+200 XP)
   - Legendary Food (+500 XP)

2. **Train Events** 💪
   - Strength training
   - Intelligence training
   - Speed training
   - Endurance training
   - Luck training
   - Each gives +100 XP

3. **Level Up Events** ⭐
   - Automatic when XP threshold reached
   - Shows new level achieved

## Implementation

### 1. New Hook: `useNFTHistory`

**File:** `evonft-app/src/hooks/useNFTHistory.js`

```javascript
export function useNFTHistory(tokenId) {
    // Fetches blockchain events:
    // - Fed events
    // - Trained events
    // - LevelUp events
    
    // Returns sorted history (newest first)
    return { history, loading };
}
```

**How it works:**
1. Query blockchain for events using `contract.queryFilter()`
2. Fetch event details including timestamp and transaction hash
3. Format events into activity objects
4. Sort by timestamp (newest first)

### 2. Updated NFTDetailIntegrated

**File:** `evonft-app/src/pages/NFTDetailIntegrated.jsx`

**Changes:**
- Import `useNFTHistory` hook
- Fetch history data
- Display in 'history' tab

## UI Design

### Activity Card

Each activity shows:
- **Icon** - Emoji representing activity type
- **Title** - Action performed
- **Description** - Details of the action
- **XP Gained** - Amount of XP earned
- **Timestamp** - When it happened
- **Transaction Link** - Link to blockchain explorer

### Example Display:

```
🍖 Fed Premium Food
   Gained 200 XP
   +200 XP
   Jan 15, 2024, 10:30 AM    View TX ↗

💪 Trained Strength
   Strength increased to 6
   +100 XP
   Jan 15, 2024, 9:15 AM     View TX ↗

⭐ Level Up!
   Reached Level 2
   Jan 14, 2024, 8:00 PM     View TX ↗
```

## Data Source

### Blockchain Events

Events are emitted by smart contract:

```solidity
// Feed event
event Fed(
    uint256 indexed tokenId, 
    uint8 foodType, 
    uint256 xpGained, 
    uint256 totalXP
);

// Train event
event Trained(
    uint256 indexed tokenId, 
    uint8 statType, 
    uint8 newValue, 
    uint256 xpGained
);

// Level up event
event LevelUp(
    uint256 indexed tokenId, 
    uint256 newLevel, 
    uint256 totalXP
);
```

### Event Filtering

```javascript
// Get all Fed events for specific token
const fedFilter = contract.filters.Fed(tokenId);
const fedEvents = await contract.queryFilter(fedFilter);

// Get all Trained events
const trainedFilter = contract.filters.Trained(tokenId);
const trainedEvents = await contract.queryFilter(trainedFilter);

// Get all LevelUp events
const levelUpFilter = contract.filters.LevelUp(tokenId);
const levelUpEvents = await contract.queryFilter(levelUpFilter);
```

## Activity Object Structure

```javascript
{
    type: 'feed' | 'train' | 'levelup',
    icon: '🍖' | '💪' | '⭐',
    title: 'Fed Premium Food',
    description: 'Gained 200 XP',
    xp: 200,
    totalXP: 500,
    timestamp: 1705315800,
    txHash: '0x...',
    blockNumber: 12345678
}
```

## Loading States

### 1. Loading
```
⟳ Loading history...
```

### 2. Empty State
```
📜 No Activity Yet
Feed or train your NFT to see activity here!
```

### 3. With Data
Shows list of activities sorted by time

## Performance

### Optimization

1. **Event Filtering** - Only fetch events for specific tokenId
2. **Caching** - Results cached in component state
3. **Lazy Loading** - Only loads when tab is active (future improvement)

### Considerations

- First load may take 2-3 seconds (fetching from blockchain)
- Subsequent loads are instant (cached)
- No pagination needed for now (most NFTs have < 100 activities)

## Future Improvements

### 1. Pagination
```javascript
// Load more activities
const [page, setPage] = useState(1);
const ITEMS_PER_PAGE = 10;
```

### 2. Filters
```javascript
// Filter by activity type
const [filter, setFilter] = useState('all'); // 'all' | 'feed' | 'train' | 'levelup'
```

### 3. Search
```javascript
// Search by date or description
const [search, setSearch] = useState('');
```

### 4. Export
```javascript
// Export history to CSV
function exportHistory() {
    // Convert to CSV and download
}
```

### 5. Real-time Updates
```javascript
// Listen for new events
contract.on('Fed', (tokenId, foodType, xpGained, totalXP) => {
    // Add to history
});
```

## Testing

### Test Scenarios

1. **New NFT (No History)**
   - Should show empty state
   - Message: "No Activity Yet"

2. **After Feed**
   - Feed NFT
   - Refresh page
   - Should show feed event in history

3. **After Train**
   - Train NFT
   - Refresh page
   - Should show train event in history

4. **Multiple Activities**
   - Feed multiple times
   - Train multiple times
   - Should show all activities sorted by time

5. **Level Up**
   - Feed until level up
   - Should show level up event

### Console Logs

```
📜 Loading history for NFT #0...
   Found 3 feed events
   Found 2 train events
   Found 1 level up events
   ✅ Loaded 6 total activities
```

## Error Handling

### No Events
```javascript
if (history.length === 0) {
    // Show empty state
}
```

### Event Query Failed
```javascript
catch (err) {
    console.warn('⚠️ Could not load feed events:', err.message);
    // Continue with other event types
}
```

### Network Error
```javascript
if (!contract) {
    console.log('⏸️ useNFTHistory: Waiting for contract');
    return;
}
```

## Files Modified

1. ✅ `evonft-app/src/hooks/useNFTHistory.js` - New hook
2. ✅ `evonft-app/src/pages/NFTDetailIntegrated.jsx` - Updated to use hook

## Benefits

✅ **Transparency** - Users can see all their NFT interactions
✅ **Verification** - Each activity links to blockchain transaction
✅ **Engagement** - Visual feedback of progress
✅ **Trust** - All data from blockchain, not database

## Example Usage

```javascript
import { useNFTHistory } from '../hooks/useNFTHistory';

function NFTDetail() {
    const { id } = useParams();
    const { history, loading } = useNFTHistory(id);
    
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                history.map(activity => (
                    <ActivityCard key={activity.txHash} activity={activity} />
                ))
            )}
        </div>
    );
}
```

## Summary

| Feature | Status |
|---------|--------|
| **Feed History** | ✅ Implemented |
| **Train History** | ✅ Implemented |
| **Level Up History** | ✅ Implemented |
| **Timestamp** | ✅ Implemented |
| **TX Links** | ✅ Implemented |
| **Loading State** | ✅ Implemented |
| **Empty State** | ✅ Implemented |
| **Sorting** | ✅ Newest first |

---

**Result:** Users can now see complete history of all interactions with their NFT! 📜✨
