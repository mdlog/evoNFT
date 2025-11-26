const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🚀 Deploying All EvoNFT Contracts to", hre.network.name);
    console.log("=".repeat(60));

    const [deployer] = await hre.ethers.getSigners();
    console.log("\n📝 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC");

    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS || deployer.address;

    // ============ Deploy Main NFT Contract ============

    console.log("\n" + "=".repeat(60));
    console.log("1️⃣  Deploying EvolvableNFTExtended...");
    console.log("=".repeat(60));

    const EvolvableNFTExtended = await hre.ethers.getContractFactory("EvolvableNFTExtended");
    const nftContract = await EvolvableNFTExtended.deploy("EvoNFT", "EVONFT", AI_SIGNER);
    await nftContract.waitForDeployment();

    const nftAddress = await nftContract.getAddress();
    console.log("✅ EvolvableNFTExtended deployed to:", nftAddress);

    // ============ Deploy Staking Pool ============

    console.log("\n" + "=".repeat(60));
    console.log("2️⃣  Deploying StakingPool...");
    console.log("=".repeat(60));

    const StakingPool = await hre.ethers.getContractFactory("StakingPool");
    const stakingPool = await StakingPool.deploy(nftAddress);
    await stakingPool.waitForDeployment();

    const stakingAddress = await stakingPool.getAddress();
    console.log("✅ StakingPool deployed to:", stakingAddress);

    // Fund staking pool with initial rewards
    console.log("\n💰 Funding StakingPool with 10 MATIC...");
    const fundTx = await deployer.sendTransaction({
        to: stakingAddress,
        value: hre.ethers.parseEther("10")
    });
    await fundTx.wait();
    console.log("✅ StakingPool funded");

    // ============ Deploy Breeding Lab ============

    console.log("\n" + "=".repeat(60));
    console.log("3️⃣  Deploying BreedingLab...");
    console.log("=".repeat(60));

    const BreedingLab = await hre.ethers.getContractFactory("BreedingLab");
    const breedingLab = await BreedingLab.deploy(nftAddress);
    await breedingLab.waitForDeployment();

    const breedingAddress = await breedingLab.getAddress();
    console.log("✅ BreedingLab deployed to:", breedingAddress);

    // ============ Summary ============

    console.log("\n" + "=".repeat(60));
    console.log("📊 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));

    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployer: deployer.address,
        aiSigner: AI_SIGNER,
        contracts: {
            EvolvableNFTExtended: nftAddress,
            StakingPool: stakingAddress,
            BreedingLab: breedingAddress
        },
        timestamp: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    console.log("\n📋 Contract Addresses:");
    console.log("   NFT Contract:", nftAddress);
    console.log("   Staking Pool:", stakingAddress);
    console.log("   Breeding Lab:", breedingAddress);

    // Get contract info
    const mintPrice = await nftContract.mintPrice();
    const maxSupply = await nftContract.maxSupply();
    const cooldown = await nftContract.cooldown();
    const [basicFood, premiumFood, legendaryFood] = await nftContract.getFoodPrices();
    const trainPrice = await nftContract.getTrainPrice();
    const breedingFee = await breedingLab.breedingFee();

    console.log("\n💰 Prices:");
    console.log("   Mint:", hre.ethers.formatEther(mintPrice), "MATIC");
    console.log("   Basic Food:", hre.ethers.formatEther(basicFood), "MATIC");
    console.log("   Premium Food:", hre.ethers.formatEther(premiumFood), "MATIC");
    console.log("   Legendary Food:", hre.ethers.formatEther(legendaryFood), "MATIC");
    console.log("   Training:", hre.ethers.formatEther(trainPrice), "MATIC");
    console.log("   Breeding:", hre.ethers.formatEther(breedingFee), "MATIC");

    console.log("\n⚙️  Settings:");
    console.log("   Max Supply:", maxSupply.toString());
    console.log("   Cooldown:", cooldown.toString(), "seconds");

    // Save deployment info
    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const filename = `${hre.network.name}-complete-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n💾 Deployment info saved to:", filename);

    // Save for frontend
    const frontendConfig = {
        NFT_CONTRACT: nftAddress,
        STAKING_CONTRACT: stakingAddress,
        BREEDING_CONTRACT: breedingAddress,
        CHAIN_ID: deploymentInfo.chainId,
        NETWORK: hre.network.name
    };

    fs.writeFileSync(
        path.join(deploymentsDir, 'latest.json'),
        JSON.stringify(frontendConfig, null, 2)
    );

    console.log("💾 Frontend config saved to: latest.json");

    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n" + "=".repeat(60));
        console.log("🔍 VERIFICATION COMMANDS");
        console.log("=".repeat(60));
        console.log("\nRun these commands to verify contracts:\n");
        console.log(`npx hardhat verify --network ${hre.network.name} ${nftAddress} "EvoNFT" "EVONFT" "${AI_SIGNER}"`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${stakingAddress} "${nftAddress}"`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${breedingAddress} "${nftAddress}"`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n🎯 Next Steps:");
    console.log("1. Update frontend config with contract addresses");
    console.log("2. Start AI Engine with new contract address");
    console.log("3. Test all features");
    console.log("\n🚀 Happy Building!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
