# 🎨 AI Image Generation Setup

## Overview

Backend sekarang support AI image generation menggunakan **Stable Diffusion via Replicate API**.

Setiap kali NFT evolve, sistem akan:
1. Generate prompt berdasarkan evolution type & metadata
2. Call Stable Diffusion API untuk generate gambar
3. Upload gambar ke IPFS/Pinata
4. Update metadata dengan image URI baru

## 🔑 Get Replicate API Token

### Step 1: Sign Up
1. Go to https://replicate.com
2. Sign up dengan GitHub atau email
3. Verify email

### Step 2: Get API Token
1. Go to https://replicate.com/account/api-tokens
2. Click "Create token"
3. Copy token (starts with `r8_...`)

### Step 3: Add to .env
```bash
cd evonft-ai-engine
nano .env
```

Add:
```env
REPLICATE_API_TOKEN=r8_your_token_here
```

## 💰 Pricing

**Stable Diffusion XL:**
- Cost: ~$0.002 per image (512x512)
- Time: 5-10 seconds per image
- Quality: Excellent

**Free Tier:**
- $5 free credit on signup
- ~2,500 images free!

## 🧪 Test Image Generation

### Test via API:
```bash
curl -X POST http://localhost:3001/api/evolution/test-image
```

Expected response:
```json
{
  "success": true,
  "imageUri": "ipfs://Qm...",
  "message": "AI image generated successfully"
}
```

### Test via Code:
```javascript
import { testImageGeneration } from './utils/imageGenerator.js';

const imageUri = await testImageGeneration();
console.log('Generated:', imageUri);
```

## 🎨 How It Works

### 1. Prompt Generation

System generates prompts based on:
- **Evolution Type**: common, rare, epic, legendary
- **Creature Type**: from NFT metadata
- **Version**: evolution stage

Example prompts:
```
Common (v1):
"A young cat, cute, simple, soft colors, beginner form, fantasy digital art"

Rare (v2):
"A mature cat, detailed, glowing aura, magical effects, intermediate form, fantasy digital art"

Epic (v3):
"A powerful cat, highly detailed, epic lighting, advanced form, fantasy digital art"

Legendary (v4):
"An ancient divine cat, masterpiece, cosmic energy, ultimate form, ultra detailed, fantasy digital art"
```

### 2. Image Generation

```javascript
const output = await replicate.run(
    "stability-ai/sdxl",
    {
        input: {
            prompt: prompt,
            negative_prompt: "ugly, blurry, low quality",
            width: 512,
            height: 512,
            num_inference_steps: 30,
            guidance_scale: 7.5
        }
    }
);
```

### 3. IPFS Upload

Generated image is uploaded to:
- **Pinata** (if configured) - Recommended
- **IPFS** (if configured)
- **Mock URI** (fallback for testing)

## 🔧 Configuration Options

### Quality Settings

Edit `evonft-ai-engine/src/utils/imageGenerator.js`:

```javascript
// Higher quality (slower, more expensive)
{
    width: 1024,
    height: 1024,
    num_inference_steps: 50,  // More steps = better quality
    guidance_scale: 9.0        // Higher = more prompt adherence
}

// Faster (lower quality, cheaper)
{
    width: 512,
    height: 512,
    num_inference_steps: 20,
    guidance_scale: 7.0
}
```

### Custom Prompts

Modify `generateImagePrompt()` function:

```javascript
function generateImagePrompt(evolutionType, version, metadata) {
    // Add your custom prompt logic
    const creatureType = metadata?.attributes?.find(
        a => a.trait_type === 'Creature Type'
    )?.value || 'mystical creature';
    
    // Custom style per evolution
    const customStyle = {
        common: 'watercolor painting, soft',
        rare: 'oil painting, detailed',
        epic: '3D render, cinematic',
        legendary: 'concept art, masterpiece'
    }[evolutionType];
    
    return `A ${creatureType}, ${customStyle}, 4k, trending on artstation`;
}
```

## 🚀 Usage

### Automatic (During Evolution)

When user evolves NFT, image is automatically generated:

```javascript
// Frontend calls backend
const result = await requestEvolution(tokenId, signals);

// Backend generates image
const imageUri = await generateEvolutionImage(
    tokenId,
    evolutionType,
    version,
    metadata
);

// Image uploaded to IPFS
// Metadata updated with new image
```

### Manual (Pre-generation)

Generate images in batch:

```javascript
import { generateBatchImages } from './utils/imageGenerator.js';

const tokens = [
    { tokenId: 0, evolutionType: 'rare', version: 2, metadata: {...} },
    { tokenId: 1, evolutionType: 'epic', version: 3, metadata: {...} }
];

const results = await generateBatchImages(tokens);
```

## 🎯 Evolution Image Examples

### Common (Version 1)
- Young creature
- Simple design
- Soft colors
- Beginner form

### Rare (Version 2)
- Mature creature
- Glowing aura
- Magical effects
- Intermediate form

### Epic (Version 3)
- Powerful creature
- Epic lighting
- Highly detailed
- Advanced form

### Legendary (Version 4)
- Ancient divine creature
- Cosmic energy
- Ultra detailed
- Ultimate form

## 🔄 Fallback System

If AI generation fails:
1. Try Replicate API
2. If fails → Use placeholder image
3. Log error for debugging
4. Evolution continues (doesn't block)

## 📊 Monitoring

### Check Generation Stats

```bash
# View logs
tail -f /tmp/ai-backend.log | grep "AI image"

# Check Replicate usage
# Go to: https://replicate.com/account/billing
```

### Cost Tracking

```javascript
// Add to your code
let totalGenerations = 0;
let totalCost = 0;

function trackGeneration() {
    totalGenerations++;
    totalCost += 0.002; // $0.002 per image
    console.log(`Total: ${totalGenerations} images, $${totalCost.toFixed(3)}`);
}
```

## 🐛 Troubleshooting

### Error: "Replicate not configured"

**Solution**: Add REPLICATE_API_TOKEN to .env

### Error: "Rate limit exceeded"

**Solution**: 
- Wait a few seconds between generations
- Upgrade Replicate plan
- Use batch generation with delays

### Error: "IPFS upload failed"

**Solution**:
- Configure Pinata (recommended)
- Or use mock URIs for testing
- Check IPFS client connection

### Images look bad

**Solution**:
- Improve prompts
- Increase num_inference_steps
- Increase image size
- Try different models

## 🎨 Alternative Models

### DALL-E 3 (OpenAI)

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024"
});
```

Cost: $0.04 per image (20x more expensive)

### Midjourney (via API)

```javascript
// Requires Midjourney subscription + API access
// Cost: ~$0.05 per image
// Quality: Excellent
```

### Local Stable Diffusion

```javascript
// Run SD locally (free but requires GPU)
// Setup: https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

## 📚 Resources

- Replicate Docs: https://replicate.com/docs
- Stable Diffusion: https://stability.ai/
- IPFS: https://docs.ipfs.tech/
- Pinata: https://docs.pinata.cloud/

## ✅ Checklist

- [ ] Sign up for Replicate
- [ ] Get API token
- [ ] Add to .env
- [ ] Test image generation
- [ ] Configure Pinata (optional)
- [ ] Customize prompts (optional)
- [ ] Monitor costs
- [ ] Deploy to production

## 🎉 Ready!

Once configured, every evolution will generate unique AI images automatically!
