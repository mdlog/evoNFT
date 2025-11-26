const hre = require("hardhat");

async function main() {
    const tokenId = process.argv[2] || 9;
    console.log(`🔍 Checking NFT #${tokenId} status...\n`);

    const contractAddress = "0xe31d18Fb9925f677451845997f64806a88264b3D";
    const contract = await hre.ethers.getContractAt("EvolvableNFTExtended", contractAddress);

    try {
        // Check if token exists
        const owner = await contract.ownerOf(tokenId);
        console.log("✅ Token exists");
        console.log("   Owner:", owner);

        // Get stats
        const stats = await contract.getTokenStats(tokenId);
        console.log("\n📊 Stats:");
        console.log("   Strength:", stats[0].toString());
        console.log("   Intelligence:", stats[1].toString());
        console.log("   Speed:", stats[2].toString());
        console.log("   Endurance:", stats[3].toString());
        console.log("   Luck:", stats[4].toString());

        // Get XP and level
        const xp = await contract.tokenXP(tokenId);
        const level = await contract.version(tokenId);
        console.log("\n📈 Progress:");
        console.log("   XP:", xp.toString());
        console.log("   Level:", level.toString());

        // Get train price
        const trainPrice = await contract.getTrainPrice();
        console.log("\n💰 Train Price:", hre.ethers.formatEther(trainPrice), "MATIC");

        // Check signer balance
        const [signer] = await hre.ethers.getSigners();
        const balance = await hre.ethers.provider.getBalance(signer.address);
        console.log("\n👛 Your Balance:", hre.ethers.formatEther(balance), "MATIC");

        // Check if signer is owner
        const isOwner = owner.toLowerCase() === signer.address.toLowerCase();
        console.log("\n🔐 Ownership:");
        console.log("   You are owner:", isOwner ? "✅ YES" : "❌ NO");
        console.log("   Your address:", signer.address);

    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.message.includes("ERC721: invalid token ID")) {
            console.log("\n⚠️ NFT #" + tokenId + " does not exist yet. Mint it first!");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
