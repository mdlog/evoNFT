const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🧬 Deploying NFT Breeding Contract...\n");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

    // Get NFT contract address from .env
    const nftContractAddress = process.env.VITE_NFT_CONTRACT || process.env.NFT_CONTRACT;

    if (!nftContractAddress) {
        throw new Error("❌ NFT_CONTRACT address not found in .env");
    }

    console.log("📍 NFT Contract:", nftContractAddress);

    // Deploy Breeding Contract
    console.log("🚀 Deploying NFTBreeding...");
    const NFTBreeding = await hre.ethers.getContractFactory("NFTBreeding");
    const breeding = await NFTBreeding.deploy(nftContractAddress);
    await breeding.waitForDeployment();

    const breedingAddress = await breeding.getAddress();
    console.log("✅ NFTBreeding deployed to:", breedingAddress);

    // Get initial configuration
    const breedingFee = await breeding.breedingFee();
    const cooldown = await breeding.breedingCooldown();
    const maxBreedCount = await breeding.maxBreedCount();

    console.log("\n📊 Initial Configuration:");
    console.log("   Breeding Fee:", hre.ethers.formatEther(breedingFee), "MATIC");
    console.log("   Cooldown:", Number(cooldown) / 3600, "hours");
    console.log("   Max Breed Count:", Number(maxBreedCount));

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        breedingContract: breedingAddress,
        nftContract: nftContractAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        breedingFee: hre.ethers.formatEther(breedingFee),
        cooldown: Number(cooldown),
        maxBreedCount: Number(maxBreedCount),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `breeding-${hre.network.name}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n💾 Deployment info saved to:", filename);

    // Update .env file
    console.log("\n📝 Add this to your .env file:");
    console.log(`VITE_BREEDING_CONTRACT=${breedingAddress}`);

    console.log("\n✅ Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Add VITE_BREEDING_CONTRACT to evonft-app/.env");
    console.log("2. Verify contract:");
    console.log(`   npx hardhat verify --network ${hre.network.name} ${breedingAddress} ${nftContractAddress}`);
    console.log("3. Grant minter role to breeding contract (if needed)");
    console.log("4. Update frontend to use breeding contract");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
