const hre = require("hardhat");

async function main() {
    const nftAddress = "0x7c7e2a1a3E1A701d1E359347208c95f59E562887";
    const nft = await hre.ethers.getContractAt("EvolvableNFTExtended", nftAddress);

    console.log("Quick Check:\n");
    
    const total = await nft.totalMinted();
    console.log("Total Minted:", total.toString());
    
    if (total > 0) {
        for (let i = 0; i < total; i++) {
            try {
                const owner = await nft.ownerOf(i);
                const uri = await nft.tokenURI(i);
                console.log(`\nNFT #${i}:`);
                console.log("  Owner:", owner);
                console.log("  URI:", uri);
            } catch (e) {
                console.log(`\nNFT #${i}: ERROR -`, e.message);
            }
        }
    }
}

main().catch(console.error);
