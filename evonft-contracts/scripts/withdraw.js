const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.NFT_CONTRACT || "0xb45471de7F633C49d4e47B6c86E67B1Ce3665c55";
    
    console.log("💰 Withdrawing from contract:", contractAddress);
    
    const [signer] = await hre.ethers.getSigners();
    console.log("👤 Signer:", signer.address);
    
    // Get contract
    const contract = await hre.ethers.getContractAt("EvolvableNFTExtended", contractAddress);
    
    // Check balance
    const balance = await hre.ethers.provider.getBalance(contractAddress);
    console.log("💵 Contract balance:", hre.ethers.formatEther(balance), "MATIC");
    
    if (balance == 0n) {
        console.log("❌ No balance to withdraw");
        return;
    }
    
    // Withdraw
    console.log("\n🔄 Calling withdraw()...");
    const tx = await contract.withdraw();
    console.log("📝 Transaction hash:", tx.hash);
    
    console.log("⏳ Waiting for confirmation...");
    await tx.wait();
    
    console.log("✅ Withdrawal successful!");
    
    // Check new balance
    const newBalance = await hre.ethers.provider.getBalance(contractAddress);
    console.log("💵 New contract balance:", hre.ethers.formatEther(newBalance), "MATIC");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
