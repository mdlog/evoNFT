const hre = require("hardhat");

async function main() {
    const contractAddress = "0xe31d18Fb9925f677451845997f64806a88264b3D";
    const userAddress = "0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4";

    console.log("🔍 Checking NFT ownership...\n");
    console.log("Contract:", contractAddress);
    console.log("User:", userAddress);
    console.log("=".repeat(60));

    const nft = await hre.ethers.getContractAt("EvolvableNFTExtended", contractAddress);

    // Check total minted
    const totalMinted = await nft.totalMinted();
    console.log("\n📊 Total Minted:", totalMinted.toString());

    // Check user balance
    const balance = await nft.balanceOf(userAddress);
    console.log("💰 User Balance:", balance.toString(), "NFTs");

    if (Number(balance) === 0) {
        console.log("\n❌ User has no NFTs!");
        console.log("\nPossible reasons:");
        console.log("1. Mint transaction failed");
        console.log("2. Mint transaction not confirmed yet");
        console.log("3. NFT transferred to another address");
        return;
    }

    // Find owned tokens
    console.log("\n🔍 Scanning for owned tokens...");
    const ownedTokens = [];

    for (let i = 0; i < Number(totalMinted); i++) {
        try {
            const owner = await nft.ownerOf(i);
            if (owner.toLowerCase() === userAddress.toLowerCase()) {
                ownedTokens.push(i);
                console.log(`✅ Token #${i} owned by user`);

                // Get token details
                const uri = await nft.tokenURI(i);
                const version = await nft.version(i);
                console.log(`   URI: ${uri}`);
                console.log(`   Version: ${version.toString()}`);
            }
        } catch (err) {
            // Token doesn't exist
            continue;
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📋 SUMMARY");
    console.log("=".repeat(60));
    console.log("Total Minted:", totalMinted.toString());
    console.log("User Balance:", balance.toString());
    console.log("Owned Tokens:", ownedTokens.join(", ") || "None");
    console.log("=".repeat(60));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
