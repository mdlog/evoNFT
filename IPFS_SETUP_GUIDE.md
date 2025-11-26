# 📦 IPFS Setup Guide - Pinata Integration

## Quick Start (5 Minutes)

### Step 1: Create Pinata Account

1. Visit: https://app.pinata.cloud
2. Sign up for free account
3. Verify email

### Step 2: Get API Keys

**Option A: JWT Token (Recommended)**

1. Go to: https://app.pinata.cloud/developers/api-keys
2. Click "New Key"
3. Name: "EvoNFT"
4. Permissions: Check "pinFileToIPFS" and "pinJSONToIPFS"
5. Click "Create Key"
6. Copy the JWT token

**Option B: API Key + Secret**

1. Go to API Keys page
2. Create new key with pinning permissions
3. Copy API Key and API Secret

### Step 3: Add to .env

Edit `evonft-app/.env`:

```env
# Option A: Using JWT (Recommended)
VITE_PINATA_JWT=your_jwt_token_here

# Option B: Using API Key + Secret
VITE_PINATA_API_KEY=your_api_key_here
VITE_PINATA_SECRET_KEY=your_secret_key_here
```

### Step 4: Test Connection

```bash
cd evonft-app
npm run dev
```

Open browser console and run:
```javascript
import { testPinataConnection } from './src/services/ipfsService';
testPinataConnection();
```

Should see: `✅ Pinata connection successful`

### Step 5: Mint NFT

1. Connect wallet
2. Go to Mint page
3. Click "Mint NFT"
4. Check console for:
   ```
   📤 Uploading metadata to IPFS via Pinata...
   ✅ Uploaded to IPFS: ipfs://Qm...
   ```

## Features

### Real IPFS Upload
- ✅ Metadata uploaded to Pinata
- ✅ Permanent storage
- ✅ Fast gateway access
- ✅ Decentralized

### Automatic Fallback
- ⚠️ If Pinata not configured → Mock IPFS
- ⚠️ If upload fails → Mock IPFS
- 💾 Mock data stored in localStorage

### Gateway Access
```javascript
// IPFS URI
ipfs://QmXxx...

// Gateway URL
https://gateway.pinata.cloud/ipfs/QmXxx...
```

## API Usage

### Upload Metadata
```javascript
import { uploadMetadataToIPFS } from './services/ipfsService';

const metadata = {
    name: "EvoNFT #1",
    description: "An evolving NFT",
    attributes: [...]
};

const ipfsUri = await uploadMetadataToIPFS(metadata);
// Returns: ipfs://QmXxx...
```

### Upload Image
```javascript
import { uploadImageToIPFS } from './services/ipfsService';

const file = document.querySelector('input[type="file"]').files[0];
const ipfsUri = await uploadImageToIPFS(file);
// Returns: ipfs://QmXxx...
```

### Get Gateway URL
```javascript
import { getIPFSGatewayUrl } from './services/ipfsService';

const url = getIPFSGatewayUrl('ipfs://QmXxx...');
// Returns: https://gateway.pinata.cloud/ipfs/QmXxx...
```

### Fetch Metadata
```javascript
import { fetchMetadataFromIPFS } from './services/ipfsService';

const metadata = await fetchMetadataFromIPFS('ipfs://QmXxx...');
// Returns: { name: "...", description: "...", ... }
```

## Pinata Dashboard

### View Uploads
1. Go to: https://app.pinata.cloud/pinmanager
2. See all uploaded files
3. View details, download, or delete

### Monitor Usage
1. Go to: https://app.pinata.cloud/billing
2. Check storage used
3. Free tier: 1 GB storage, 100 GB bandwidth/month

### API Keys
1. Go to: https://app.pinata.cloud/developers/api-keys
2. Manage keys
3. Revoke if compromised
4. Create new keys

## Pricing

### Free Tier
- ✅ 1 GB storage
- ✅ 100 GB bandwidth/month
- ✅ Unlimited pins
- ✅ Perfect for testing

### Paid Plans
- Picnic: $20/month (100 GB storage)
- Submarine: $100/month (1 TB storage)
- Custom: Enterprise pricing

## Troubleshooting

### Error: "Pinata credentials not configured"
**Solution**: Add VITE_PINATA_JWT to .env

### Error: "401 Unauthorized"
**Solution**: 
- Check JWT token is correct
- Regenerate API key if needed
- Verify permissions enabled

### Error: "Upload failed"
**Solution**:
- Check internet connection
- Verify Pinata service status
- Check API quota not exceeded

### Mock IPFS Used
**Cause**: Pinata not configured or upload failed
**Solution**: 
- Add Pinata credentials
- Check console for error details

## Security

### Best Practices
- ✅ Never commit .env to git
- ✅ Use JWT tokens (more secure)
- ✅ Rotate keys periodically
- ✅ Limit key permissions
- ✅ Monitor usage

### .gitignore
Ensure `.env` is in `.gitignore`:
```
.env
.env.local
.env.*.local
```

## Testing

### Test Upload
```javascript
// Test metadata upload
const testMetadata = {
    name: "Test NFT",
    description: "Testing IPFS upload",
    attributes: []
};

const uri = await uploadMetadataToIPFS(testMetadata);
console.log('Uploaded:', uri);

// Fetch back
const fetched = await fetchMetadataFromIPFS(uri);
console.log('Fetched:', fetched);
```

### Test Connection
```javascript
const isConnected = await testPinataConnection();
console.log('Connected:', isConnected);
```

## Migration from Mock

### Before (Mock IPFS)
```javascript
// Mock URI
ipfs://QmMockHash123

// Data in localStorage
localStorage.getItem('ipfs_QmMockHash123')
```

### After (Real IPFS)
```javascript
// Real URI
ipfs://QmRealHash456

// Data on Pinata
https://gateway.pinata.cloud/ipfs/QmRealHash456
```

### Existing NFTs
- Old NFTs with mock URIs still work
- New NFTs use real IPFS
- Can migrate old NFTs manually

## Advanced

### Custom Gateway
```javascript
// Use custom gateway
const CUSTOM_GATEWAY = 'https://ipfs.io/ipfs';
const url = `${CUSTOM_GATEWAY}/${hash}`;
```

### Pinata Submarine
```javascript
// Dedicated gateway (paid feature)
const SUBMARINE_GATEWAY = 'https://mygateway.mypinata.cloud/ipfs';
```

### CID Version
```javascript
// Use CIDv1 (default)
pinataOptions: {
    cidVersion: 1
}
```

## Resources

- Pinata Docs: https://docs.pinata.cloud
- IPFS Docs: https://docs.ipfs.tech
- Pinata Dashboard: https://app.pinata.cloud
- Pinata Status: https://status.pinata.cloud

## Support

### Pinata Support
- Email: team@pinata.cloud
- Discord: https://discord.gg/pinata
- Twitter: @pinatacloud

### Common Issues
- Rate limiting: Upgrade plan
- Storage full: Delete old pins
- Gateway slow: Use Submarine

---

**Status**: ✅ Ready to Use
**Last Updated**: 2025-11-06
**Version**: 1.0.0
