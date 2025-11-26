const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔑 Granting Minter Role to Breeding Contract...\n");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("👤 Using account:", deployer.address);

    // Get addresses
    const nftAddress = process.env.VITE_NFT_CONTRACT || process.env.NFT_CONTRACT;

    if (!nftAddress) {
        throw new Error("❌ NFT_CONTRACT address not found in .env");
    }

    // Try to get breeding address from deployment file
    const deploymentFile = path.join(__dirname, '../deployments/breeding-amoy.json');
    let breedingAddress;

    if (fs.existsSync(deploymentFile)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
        breedingAddress = deployment.breedingContract;
        console.log("📍 Found breeding address from deployment file");
    } else {
        // Ask for manual input
        breedingAddress = process.env.VITE_BREEDING_CONTRACT;
        if (!breedingAddress) {
            throw new Error("❌ Breeding contract address not found. Please set VITE_BREEDING_CONTRACT in .env");
        }
    }

    console.log("📍 NFT Contract:", nftAddress);
    console.log("📍 Breeding Contract:", breedingAddress);
    console.log("");

    // Get NFT contract
    const nft = await hre.ethers.getContractAt("EvolvableNFTExtended", nftAddress);

    // Get MINTER_ROLE (it's a public variable, not a function)
    const MINTER_ROLE = await nft.MINTER_ROLE;
    console.log("🔑 MINTER_ROLE:", MINTER_ROLE);

    // Check if already has role
    const hasRole = await nft.hasRole(MINTER_ROLE, breedingAddress);

    if (hasRole) {
        console.log("✅ Breeding contract already has minter role!");
        return;
    }

    console.log("⏳ Granting minter role...");

    // Grant role
    const tx = await nft.grantRole(MINTER_ROLE, breedingAddress);
    console.log("📤 Transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ Transaction confirmed!");

    // Verify
    const hasRoleNow = await nft.hasRole(MINTER_ROLE, breedingAddress);

    if (hasRoleNow) {
        console.log("\n✅ SUCCESS! Breeding contract now has minter role!");
        console.log("\n📋 Next steps:");
        console.log("1. Update evonft-app/.env with VITE_BREEDING_CONTRACT");
        console.log("2. Restart frontend");
        console.log("3. Test breeding at /breeding");
    } else {
        console.log("\n❌ ERROR: Role grant failed!");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
