const hre = require("hardhat");

async function main() {
    console.log("🎨 Minting test NFT...\n");

    const [signer] = await hre.ethers.getSigners();
    console.log("Minting with account:", signer.address);

    const contractAddress = "0xe31d18Fb9925f677451845997f64806a88264b3D";
    const contract = await hre.ethers.getContractAt("EvolvableNFTExtended", contractAddress);

    // Check current total
    const totalBefore = await contract.totalMinted();
    console.log("Total minted before:", totalBefore.toString());

    // Mint price
    const mintPrice = await contract.mintPrice();
    console.log("Mint price:", hre.ethers.formatEther(mintPrice), "MATIC\n");

    // Test metadata URI
    const testURI = "ipfs://QmTest123/metadata.json";

    console.log("Minting NFT...");
    const tx = await contract.mint(signer.address, testURI, {
        value: mintPrice
    });

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ NFT minted successfully!");
    console.log("Block number:", receipt.blockNumber);

    // Get new total
    const totalAfter = await contract.totalMinted();
    console.log("\nTotal minted after:", totalAfter.toString());
    console.log("New NFT ID:", (totalAfter - 1n).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
