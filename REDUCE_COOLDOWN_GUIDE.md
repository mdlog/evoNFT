# 🕐 Reduce Cooldown untuk Testing

## Cara Tercepat - Via Browser Console

### Step 1: Buka Browser Console
1. Go to https://evonft.xyz
2. Press F12 atau Right-click → Inspect
3. Go to "Console" tab

### Step 2: Connect Wallet
Pastikan wallet sudah connected di aplikasi

### Step 3: Run Script

Copy-paste script ini ke console:

```javascript
// Reduce cooldown to 1 minute
(async () => {
    try {
        console.log('🔧 Reducing cooldown to 60 seconds...');
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const contractAddress = '0xe31d18Fb9925f677451845997f64806a88264b3D';
        const abi = ['function setCooldown(uint256 _newCooldown) external'];
        
        const contract = new ethers.Contract(contractAddress, abi, signer);
        
        const tx = await contract.setCooldown(60); // 60 seconds
        console.log('⏳ Transaction sent:', tx.hash);
        
        await tx.wait();
        console.log('✅ Cooldown reduced to 60 seconds!');
        console.log('🎉 Wait 1 minute, then you can evolve!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('Ownable')) {
            console.log('⚠️ Only contract owner can change cooldown');
        }
    }
})();
```

### Step 4: Wait & Test
1. Wait 1 minute
2. Go to NFT detail page
3. Click "🧬 Evolve Now"
4. Confirm transaction
5. Watch your NFT evolve! 🎉

---

## Alternative - Via Hardhat Script

Jika console script tidak work:

```bash
cd evonft-contracts
npx hardhat run scripts/reduce-cooldown.js --network amoy
```

---

## Verify Cooldown Changed

Check current cooldown:

```javascript
(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
        '0xe31d18Fb9925f677451845997f64806a88264b3D',
        ['function cooldown() view returns (uint256)'],
        provider
    );
    const cooldown = await contract.cooldown();
    console.log('Current cooldown:', Number(cooldown), 'seconds');
    console.log('That is:', Number(cooldown) / 60, 'minutes');
})();
```

---

## Reset to 24 Hours (Production)

When done testing:

```javascript
(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        '0xe31d18Fb9925f677451845997f64806a88264b3D',
        ['function setCooldown(uint256 _newCooldown) external'],
        signer
    );
    await contract.setCooldown(86400); // 24 hours
    console.log('✅ Cooldown reset to 24 hours');
})();
```

---

## Troubleshooting

### Error: "Only owner can call"
- You must be the contract owner
- Check: `await contract.owner()` should match your address

### Error: "User rejected transaction"
- Click "Confirm" in MetaMask

### Cooldown not changing
- Wait for transaction confirmation
- Check on Polygonscan: https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D

---

## 🎉 Ready to Test Evolution!

Once cooldown is reduced:
1. ✅ Backend AI ready
2. ✅ Frontend connected
3. ✅ Smart contract ready
4. ✅ Cooldown reduced
5. 🚀 Click "Evolve Now" and watch the magic!
