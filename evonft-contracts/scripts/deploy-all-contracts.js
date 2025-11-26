const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying All Contracts to", hre.network.name);
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

    // Get NFT contract address from env
    const NFT_CONTRACT = process.env.VITE_NFT_CONTRACT || process.env.NFT_CONTRACT;
    console.log("📍 NFT Contract:", NFT_CONTRACT, "\n");

    // Deploy Staking
    console.log("1️⃣ Deploying StakingPool...");
    const StakingPool = await hre.ethers.getContractFactory("StakingPool");
    const staking = await StakingPool.deploy(NFT_CONTRACT);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("✅ StakingPool deployed:", stakingAddress);

    // Deploy Breeding
    console.log("\n2️⃣ Deploying NFTBreeding...");
    const NFTBreeding = await hre.ethers.getContractFactory("NFTBreeding");
    const breeding = await NFTBreeding.deploy(NFT_CONTRACT);
    await breeding.waitForDeployment();
    const breedingAddress = await breeding.getAddress();
    console.log("✅ NFTBreeding deployed:", breedingAddress);

    // Deploy Marketplace
    console.log("\n3️⃣ Deploying NFTMarketplace...");
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy(NFT_CONTRACT);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ NFTMarketplace deployed:", marketplaceAddress);

    // Summary
    console.log("\n📋 Deployment Summary:");
    console.log("NFT:         ", NFT_CONTRACT);
    console.log("Staking:     ", stakingAddress);
    console.log("Breeding:    ", breedingAddress);
    console.log("Marketplace: ", marketplaceAddress);

    console.log("\n🔍 Verify commands:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${stakingAddress} "${NFT_CONTRACT}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${breedingAddress} "${NFT_CONTRACT}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${marketplaceAddress} "${NFT_CONTRACT}"`);

    console.log("\n✨ All contracts deployed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
