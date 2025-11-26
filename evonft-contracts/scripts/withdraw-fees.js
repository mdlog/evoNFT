const { ethers } = require("hardhat");

/**
 * Script to withdraw accumulated fees from NFT contract
 * Only owner can run this
 */
async function main() {
    console.log("🏦 Withdrawing Fees from NFT Contract\n");

    // Contract address
    const NFT_ADDRESS = process.env.NFT_CONTRACT || "0xe31d18Fb9925f677451845997f64806a88264b3D";

    console.log("📍 Contract Address:", NFT_ADDRESS);

    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("👤 Signer Address:", signer.address);

    // Get contract
    const nft = await ethers.getContractAt("EvolvableNFTExtended", NFT_ADDRESS);

    // Check if signer is owner
    const owner = await nft.owner();
    console.log("👑 Contract Owner:", owner);

    if (signer.address.toLowerCase() !== owner.toLowerCase()) {
        console.error("\n❌ Error: You are not the contract owner!");
        console.error("   Only the owner can withdraw fees.");
        process.exit(1);
    }

    console.log("✅ You are the owner!\n");

    // Check contract balance
    const balance = await ethers.provider.getBalance(NFT_ADDRESS);
    const balanceInMatic = ethers.formatEther(balance);

    console.log("💰 Contract Balance:", balanceInMatic, "MATIC");

    if (balance === 0n) {
        console.log("\n⚠️  No balance to withdraw");
        return;
    }

    // Get signer balance before
    const signerBalanceBefore = await ethers.provider.getBalance(signer.address);
    console.log("💳 Your Balance Before:", ethers.formatEther(signerBalanceBefore), "MATIC\n");

    // Confirm withdrawal
    console.log("🔄 Withdrawing", balanceInMatic, "MATIC...");

    try {
        const tx = await nft.withdraw();
        console.log("📝 Transaction Hash:", tx.hash);
        console.log("⏳ Waiting for confirmation...");

        const receipt = await tx.wait();
        console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

        // Get signer balance after
        const signerBalanceAfter = await ethers.provider.getBalance(signer.address);
        const gained = signerBalanceAfter - signerBalanceBefore;

        console.log("\n💰 Withdrawal Summary:");
        console.log("   Amount Withdrawn:", balanceInMatic, "MATIC");
        console.log("   Gas Used:", ethers.formatEther(receipt.gasUsed * receipt.gasPrice), "MATIC");
        console.log("   Net Gain:", ethers.formatEther(gained), "MATIC");
        console.log("   Your Balance After:", ethers.formatEther(signerBalanceAfter), "MATIC");

        console.log("\n✅ Withdrawal successful!");

    } catch (error) {
        console.error("\n❌ Withdrawal failed:", error.message);

        if (error.message.includes("No balance")) {
            console.error("   Contract has no balance to withdraw");
        } else if (error.message.includes("Ownable")) {
            console.error("   You are not the owner");
        } else {
            console.error("   Full error:", error);
        }

        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
