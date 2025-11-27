const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("💰 Checking Deployer Wallet Balance\n");
    console.log("📍 Wallet Address:", deployer.address);
    console.log("🔗 Explorer:", `https://amoy.polygonscan.com/address/${deployer.address}\n`);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInMatic = hre.ethers.formatEther(balance);
    
    console.log("💰 Balance:", balanceInMatic, "MATIC");
    console.log("💵 Estimated Value: ~$" + (parseFloat(balanceInMatic) * 0.5).toFixed(2), "(at $0.5/MATIC)\n");
    
    // Estimate deployment cost
    const estimatedCost = 0.5; // ~0.5 MATIC for 4 contracts
    console.log("📊 Deployment Estimate:");
    console.log("   Estimated Cost: ~" + estimatedCost + " MATIC");
    console.log("   Your Balance: " + balanceInMatic + " MATIC");
    
    if (parseFloat(balanceInMatic) < estimatedCost) {
        console.log("\n❌ Insufficient balance!");
        console.log("   Need at least " + estimatedCost + " MATIC");
        console.log("   Get testnet MATIC: https://faucet.polygon.technology");
    } else {
        console.log("\n✅ Sufficient balance for deployment!");
        console.log("   Remaining after deployment: ~" + (parseFloat(balanceInMatic) - estimatedCost).toFixed(4) + " MATIC");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
