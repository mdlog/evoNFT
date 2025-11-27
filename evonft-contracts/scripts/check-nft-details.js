const hre = require("hardhat");

async function main() {
    const nftAddress = process.env.VITE_NFT_CONTRACT || process.env.NFT_CONTRACT;
    const [signer] = await hre.ethers.getSigners();
    const nft = await hre.ethers.getContractAt("EvolvableNFTExtended", nftAddress);

    console.log("🔍 Checking NFT Details\n");
    console.log("Contract:", nftAddress);
    console.log("Signer:", signer.address, "\n");

    const totalMinted = await nft.totalMinted();
    console.log("Total Minted:", totalMinted.toString());

    if (totalMinted > 0) {
        const tokenId = totalMinted - 1n;
        console.log("\n📊 NFT #" + tokenId.toString() + " Details:");

        // Get stats
        const stats = await nft.getTokenStats(tokenId);
        console.log("\nStats:");
        console.log("  💪 Strength:", stats[0]);
        console.log("  🧠 Intelligence:", stats[1]);
        console.log("  ⚡ Speed:", stats[2]);
        console.log("  🛡️ Endurance:", stats[3]);
        console.log("  🍀 Luck:", stats[4]);

        // Get progress
        const progress = await nft.getTokenProgress(tokenId);
        console.log("\nProgress:");
        console.log("  Level:", progress.currentLevel.toString());
        console.log("  XP:", progress.currentXP.toString());
        console.log("  Next Level XP:", progress.xpForNextLevel.toString());
        console.log("  Progress:", progress.xpProgress.toString() + "%");

        // Get owner
        const owner = await nft.ownerOf(tokenId);
        console.log("\nOwner:", owner);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
