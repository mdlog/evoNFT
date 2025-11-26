const { ethers } = require("hardhat");

async function main() {
    console.log("🏪 Deploying NFT Marketplace...\n");

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC\n");

    // Get NFT contract address
    const NFT_CONTRACT = process.env.NFT_CONTRACT || process.env.VITE_NFT_CONTRACT;

    if (!NFT_CONTRACT) {
        console.error("❌ Error: NFT_CONTRACT not set in environment");
        console.error("   Set VITE_NFT_CONTRACT in .env file");
        process.exit(1);
    }

    console.log("📍 NFT Contract:", NFT_CONTRACT);

    // Deploy Marketplace
    console.log("\n🚀 Deploying NFTMarketplace...");
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy(NFT_CONTRACT);

    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();

    console.log("✅ NFTMarketplace deployed to:", marketplaceAddress);

    // Get initial stats
    const fee = await marketplace.marketplaceFee();
    console.log("\n📊 Initial Configuration:");
    console.log("   Marketplace Fee:", Number(fee) / 100, "%");
    console.log("   NFT Contract:", NFT_CONTRACT);

    // Save deployment info
    console.log("\n💾 Saving deployment info...");
    const fs = require('fs');
    const deploymentInfo = {
        network: network.name,
        marketplaceAddress: marketplaceAddress,
        nftContract: NFT_CONTRACT,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        marketplaceFee: Number(fee) / 100 + "%"
    };

    fs.writeFileSync(
        'deployments/marketplace-' + network.name + '.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n📝 Next Steps:");
    console.log("1. Update .env file:");
    console.log(`   VITE_MARKETPLACE_CONTRACT=${marketplaceAddress}`);
    console.log("\n2. Verify contract:");
    console.log(`   npx hardhat verify --network ${network.name} ${marketplaceAddress} ${NFT_CONTRACT}`);
    console.log("\n3. Test marketplace:");
    console.log("   - List an NFT for sale");
    console.log("   - Buy an NFT");
    console.log("   - Cancel a listing");

    console.log("\n✅ Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
