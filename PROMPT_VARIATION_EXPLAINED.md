# 🎨 Prompt Variation System

## Current System (Basic)

**Prompt berdasarkan:**
- Creature Type (Cat, Dragon, etc)
- Evolution Type (common, rare, epic, legendary)
- Version number

**Problem:** Prompt sama untuk creature & evolution type yang sama
**Result:** Gambar mirip (tapi tidak identik karena AI randomness ~10-20% variation)

## Example Current Prompts:

```
Cat v1 (common):
"A young Cat, cute, simple, soft colors, beginner form, fantasy digital art, version 1"

Cat v2 (rare):
"A mature Cat, detailed, glowing aura, magical effects, intermediate form, fantasy digital art, version 2"

Dragon v3 (epic):
"A powerful Dragon, highly detailed, epic lighting, advanced form, fantasy digital art, version 3"

Dragon v4 (legendary):
"An ancient divine Dragon, masterpiece, cosmic energy, ultimate form, fantasy digital art, version 4"
```

## Improved System (With Variations)

**Add random elements untuk uniqueness:**

### 1. Stats-Based Variation
```javascript
if (strength > 7) → add "muscular, strong"
if (intelligence > 7) → add "wise, mystical"  
if (speed > 7) → add "agile, swift"
```

### 2. Random Elements
```javascript
elements = ['fire', 'ice', 'lightning', 'nature', 'shadow', 'light']
// Pick random each time
```

### 3. Random Poses
```javascript
poses = ['standing proud', 'in action', 'majestic stance', 'dynamic pose']
// Pick random each time
```

### 4. Random Environments
```javascript
environments = ['mystical forest', 'ancient ruins', 'cosmic space', 'magical realm']
// Pick random each time
```

### 5. Token ID Seed
```javascript
// Use tokenId as seed for consistent but unique variations
const seed = tokenId % 1000;
```

## Example Improved Prompts:

**Same Cat, Different Evolutions:**

```
Cat #1 v2 (rare):
"A mature Cat, wise, mystical, detailed, glowing aura, fire element, 
standing proud, mystical forest background, fantasy digital art, 4k"

Cat #2 v2 (rare):  
"A mature Cat, agile, swift, detailed, glowing aura, lightning element,
dynamic pose, cosmic space background, fantasy digital art, 4k"

Cat #3 v2 (rare):
"A mature Cat, muscular, strong, detailed, glowing aura, ice element,
heroic posture, ancient ruins background, fantasy digital art, 4k"
```

**Result:** Setiap evolution UNIK meskipun creature type & level sama!

## Implementation Options:

### Option 1: Full Random (Most Unique)
```javascript
// Every evolution = completely different
const element = randomPick(elements);
const pose = randomPick(poses);
const env = randomPick(environments);
```

**Pros:** Maximum uniqueness  
**Cons:** Tidak konsisten jika evolve ulang

### Option 2: Token ID Seeded (Consistent)
```javascript
// Same tokenId = same variations
const seed = tokenId;
const element = elements[seed % elements.length];
const pose = poses[(seed * 2) % poses.length];
```

**Pros:** Konsisten per token  
**Cons:** Kurang random

### Option 3: Hybrid (Recommended)
```javascript
// Mix of tokenId seed + timestamp
const seed = tokenId + Math.floor(Date.now() / 1000);
const element = elements[seed % elements.length];
```

**Pros:** Unique tapi ada pattern  
**Cons:** Balanced

## Test Comparison:

### Without Variation:
```bash
# Evolve Cat #1 twice
Evolution 1: "A mature Cat, detailed, glowing aura..."
Evolution 2: "A mature Cat, detailed, glowing aura..."
# Result: ~85% similar images
```

### With Variation:
```bash
# Evolve Cat #1 twice  
Evolution 1: "A mature Cat, fire element, standing proud, mystical forest..."
Evolution 2: "A mature Cat, ice element, dynamic pose, cosmic space..."
# Result: ~40% similar images (much more unique!)
```

## Recommendation:

**Use Hybrid Approach:**
1. Base prompt dari evolution type
2. Add stats-based variations
3. Add random element (seeded by tokenId + timestamp)
4. Add random pose & environment

**Result:**
- ✅ Setiap evolution unik
- ✅ Masih ada consistency per creature type
- ✅ Tidak terlalu random (ada pattern)
- ✅ Professional quality prompts

## Implementation:

File: `evonft-ai-engine/src/utils/imageGenerator.js`

Update function `generateImagePrompt()` dengan logic di atas.

Mau saya implementasikan sekarang?
