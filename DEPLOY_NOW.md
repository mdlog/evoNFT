# 🚀 Deploy Breeding Contract - ONE COMMAND

## Quick Deploy (Recommended)

Run this ONE command from project root:

```bash
chmod +x deploy-and-setup-breeding.sh
./deploy-and-setup-breeding.sh
```

This will:
1. ✅ Compile contract
2. ✅ Deploy to Polygon Amoy
3. ✅ Grant minter role
4. ✅ Update frontend .env

Then just restart frontend:
```bash
cd evonft-app
rm -rf node_modules/.vite
npm run dev
```

Done! Go to http://localhost:5173/breeding

---

## Manual Deploy (If Script Fails)

### Step 1: Compile & Deploy
```bash
cd evonft-contracts
npx hardhat compile
npx hardhat run scripts/deploy-breeding.js --network amoy
```

Copy the breeding contract address from output.

### Step 2: Grant Minter Role
```bash
npx hardhat run scripts/grant-minter-role.js --network amoy
```

Or manually:
```bash
npx hardhat console --network amoy
```
```javascript
const nft = await ethers.getContractAt('EvolvableNFTExtended', '0xe31d18Fb9925f677451845997f64806a88264b3D')
const breedingAddress = '0xYOUR_BREEDING_ADDRESS'
const MINTER_ROLE = await nft.MINTER_ROLE()
await nft.grantRole(MINTER_ROLE, breedingAddress)
console.log('✅ Done!')
.exit
```

### Step 3: Update .env
```bash
cd evonft-app
echo 'VITE_BREEDING_CONTRACT=0xYOUR_BREEDING_ADDRESS' >> .env
```

### Step 4: Restart Frontend
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## Verify Deployment

1. Check browser console (F12):
   ```
   🧬 Initializing Breeding Contract: 0x...
   ✅ Breeding read contract initialized
   ```

2. Go to /breeding page
3. Should see your NFTs
4. Can select parents
5. Can see predicted stats
6. "Start Breeding" button active

---

## Troubleshooting

### "Compilation failed"
```bash
cd evonft-contracts
npx hardhat clean
npx hardhat compile
```

### "Deployment failed"
- Check wallet has MATIC (need ~0.1)
- Check .env has VITE_NFT_CONTRACT
- Check network connection

### "Grant role failed"
- Make sure you're using deployer account
- Check NFT contract address is correct
- Try manual method above

### "Contract not connected" in frontend
```bash
# Check .env
cat evonft-app/.env | grep BREEDING

# Should show address
# If not, add manually
```

---

## Cost

- Deployment: ~0.05 MATIC
- Grant Role: ~0.01 MATIC
- **Total: ~0.06 MATIC**

---

## Success!

When working, you'll see:
- ✅ Breeding page loads
- ✅ Your NFTs appear in selection
- ✅ Can predict offspring stats
- ✅ Can breed successfully
- ✅ Offspring appears in collection

**Breeding Cost:** 0.02 MATIC + gas (~0.01) = **~0.03 MATIC per breeding**

---

**Ready? Run the script!** 🚀

```bash
chmod +x deploy-and-setup-breeding.sh
./deploy-and-setup-breeding.sh
```
