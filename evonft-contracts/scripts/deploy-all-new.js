const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying ALL NEW Contracts to", hre.network.name);
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS || deployer.address;
    console.log("🤖 AI Signer:", AI_SIGNER, "\n");

    // 1. Deploy NFT Contract
    console.log("1️⃣ Deploying EvolvableNFTExtended...");
    const EvolvableNFT = await hre.ethers.getContractFactory("EvolvableNFTExtended");
    const nft = await EvolvableNFT.deploy("EvoNFT", "EVONFT", AI_SIGNER);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("✅ NFT deployed:", nftAddress);

    // 2. Deploy Staking
    console.log("\n2️⃣ Deploying StakingPool...");
    const StakingPool = await hre.ethers.getContractFactory("StakingPool");
    const staking = await StakingPool.deploy(nftAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("✅ StakingPool deployed:", stakingAddress);

    // 3. Deploy Breeding
    console.log("\n3️⃣ Deploying NFTBreeding...");
    const NFTBreeding = await hre.ethers.getContractFactory("NFTBreeding");
    const breeding = await NFTBreeding.deploy(nftAddress);
    await breeding.waitForDeployment();
    const breedingAddress = await breeding.getAddress();
    console.log("✅ NFTBreeding deployed:", breedingAddress);

    // 4. Deploy Marketplace
    console.log("\n4️⃣ Deploying NFTMarketplace...");
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy(nftAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ NFTMarketplace deployed:", marketplaceAddress);

    // 5. Setup Complete (no role needed - breeding calls mint directly)
    console.log("\n5️⃣ Setup complete - Breeding can mint via public mint function");

    // Save deployment info
    const deployment = {
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            nft: nftAddress,
            staking: stakingAddress,
            breeding: breedingAddress,
            marketplace: marketplaceAddress
        }
    };

    const deploymentPath = path.join(__dirname, "../deployments", `all-${Date.now()}.json`);
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log("\n💾 Deployment saved:", deploymentPath);

    // Summary
    console.log("\n📋 ===== DEPLOYMENT SUMMARY =====");
    console.log("NFT:         ", nftAddress);
    console.log("Staking:     ", stakingAddress);
    console.log("Breeding:    ", breedingAddress);
    console.log("Marketplace: ", marketplaceAddress);

    console.log("\n📝 Update .env files with:");
    console.log(`VITE_NFT_CONTRACT=${nftAddress}`);
    console.log(`VITE_STAKING_CONTRACT=${stakingAddress}`);
    console.log(`VITE_BREEDING_CONTRACT=${breedingAddress}`);
    console.log(`VITE_MARKETPLACE_CONTRACT=${marketplaceAddress}`);

    console.log("\n🔍 Verify commands:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${nftAddress} "EvoNFT" "EVONFT" "${AI_SIGNER}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${stakingAddress} "${nftAddress}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${breedingAddress} "${nftAddress}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${marketplaceAddress} "${nftAddress}"`);

    console.log("\n✨ All contracts deployed successfully!");
    console.log("\n⚠️  IMPORTANT: You need to get more testnet MATIC from faucet before deployment!");
    console.log("   Faucet: https://faucet.polygon.technology");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
