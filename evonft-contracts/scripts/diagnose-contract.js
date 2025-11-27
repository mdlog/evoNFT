const hre = require("hardhat");

async function main() {
    const nftAddress = "0x7c7e2a1a3E1A701d1E359347208c95f59E562887";
    const [signer] = await hre.ethers.getSigners();
    
    console.log("🔍 Contract Diagnostics\n");
    console.log("Contract Address:", nftAddress);
    console.log("Network:", hre.network.name);
    console.log("Signer:", signer.address);
    console.log("Signer Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), "MATIC\n");

    // Check if contract exists
    const code = await hre.ethers.provider.getCode(nftAddress);
    if (code === "0x") {
        console.log("❌ ERROR: No contract found at this address!");
        console.log("The contract may not be deployed on this network.");
        return;
    }
    console.log("✅ Contract exists\n");

    const nft = await hre.ethers.getContractAt("EvolvableNFTExtended", nftAddress);

    // Check total minted
    try {
        const totalMinted = await nft.totalMinted();
        console.log("📊 Total NFTs Minted:", totalMinted.toString());
        
        if (totalMinted === 0n) {
            console.log("\n⚠️  No NFTs have been minted yet!");
            console.log("This is why the frontend shows errors - NFT #0 doesn't exist.");
            console.log("\n💡 Solution: Mint an NFT first using the frontend or run:");
            console.log("   npx hardhat run scripts/mint-test-nft.js --network amoy");
        } else {
            console.log("\n✅ NFTs exist! Checking NFT #0...\n");
            
            const owner = await nft.ownerOf(0);
            console.log("Owner of NFT #0:", owner);
            
            const stats = await nft.getTokenStats(0);
            console.log("Stats:", stats);
            
            const xp = await nft.tokenXP(0);
            console.log("XP:", xp.toString());
        }
    } catch (error) {
        console.log("❌ Error calling contract:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
