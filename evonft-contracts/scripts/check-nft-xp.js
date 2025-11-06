const { ethers } = require("hardhat");

/**
 * Script to check NFT XP directly from contract
 */
async function main() {
    const args = process.argv.slice(2);
    const tokenId = args[0] || "0";

    console.log("🔍 Checking NFT XP\n");

    const NFT_ADDRESS = process.env.NFT_CONTRACT || "0xe31d18Fb9925f677451845997f64806a88264b3D";

    console.log("📍 Contract Address:", NFT_ADDRESS);
    console.log("🎨 Token ID:", tokenId);
    console.log("");

    // Get contract
    const nft = await ethers.getContractAt("EvolvableNFTExtended", NFT_ADDRESS);

    try {
        // Check if token exists
        const owner = await nft.ownerOf(tokenId);
        console.log("👤 Owner:", owner);

        // Get XP
        const xp = await nft.tokenXP(tokenId);
        console.log("\n💫 XP Data:");
        console.log("   Raw XP:", xp.toString());

        // Get progress
        const progress = await nft.getTokenProgress(tokenId);
        console.log("\n📊 Progress Data:");
        console.log("   Current XP:", progress[0].toString());
        console.log("   Current Level:", progress[1].toString());
        console.log("   XP for Next Level:", progress[2].toString());
        console.log("   Progress:", progress[3].toString() + "%");

        // Get stats
        const stats = await nft.getTokenStats(tokenId);
        console.log("\n💪 Stats:");
        console.log("   Strength:", stats[0].toString());
        console.log("   Intelligence:", stats[1].toString());
        console.log("   Speed:", stats[2].toString());
        console.log("   Endurance:", stats[3].toString());
        console.log("   Luck:", stats[4].toString());

        // Get version (level)
        const version = await nft.version(tokenId);
        console.log("\n🎯 Version/Level:", version.toString());

        // Analysis
        console.log("\n📈 Analysis:");
        if (xp === 0n) {
            console.log("   ⚠️  XP is 0 - NFT has not been fed yet");
        } else {
            console.log("   ✅ XP is", xp.toString());
            console.log("   ✅ This represents approximately:");

            const basicFeeds = Number(xp) / 50;
            const premiumFeeds = Number(xp) / 200;
            const legendaryFeeds = Number(xp) / 500;
            const trains = Number(xp) / 100;

            console.log("      -", Math.floor(basicFeeds), "Basic Feeds (50 XP each)");
            console.log("      -", Math.floor(premiumFeeds), "Premium Feeds (200 XP each)");
            console.log("      -", Math.floor(legendaryFeeds), "Legendary Feeds (500 XP each)");
            console.log("      -", Math.floor(trains), "Training Sessions (100 XP each)");
        }

        // Check if should level up
        const xpForNextLevel = Number(progress[2]);
        if (Number(xp) >= xpForNextLevel) {
            console.log("\n   🎉 NFT should level up!");
            console.log("      Current XP:", xp.toString());
            console.log("      Required XP:", xpForNextLevel);
        }

    } catch (error) {
        console.error("\n❌ Error:", error.message);

        if (error.message.includes("ERC721NonexistentToken")) {
            console.error("   Token ID", tokenId, "does not exist");
        } else {
            console.error("   Full error:", error);
        }
    }
}

// Usage: npx hardhat run scripts/check-nft-xp.js --network amoy [tokenId]
// Example: npx hardhat run scripts/check-nft-xp.js --network amoy 0

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
