const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Starting deployment to Polygon Amoy Testnet...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "MATIC\n");

    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS || deployer.address;
    console.log("AI Signer:", AI_SIGNER, "\n");

    // Deploy NFT Contract
    console.log("1. Deploying EvolvableNFTExtended...");
    const NFT = await hre.ethers.getContractFactory("EvolvableNFTExtended");
    const nft = await NFT.deploy("EvoNFT", "EVONFT", AI_SIGNER);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("✅ NFT deployed:", nftAddress, "\n");

    // Deploy Staking Pool
    console.log("2. Deploying StakingPool...");
    const Staking = await hre.ethers.getContractFactory("StakingPool");
    const staking = await Staking.deploy(nftAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("✅ Staking deployed:", stakingAddress, "\n");

    // Fund staking pool with smaller amount
    console.log("3. Funding StakingPool with 0.1 MATIC...");
    try {
        const fundTx = await deployer.sendTransaction({
            to: stakingAddress,
            value: hre.ethers.parseEther("0.1")
        });
        await fundTx.wait();
        console.log("✅ Staking funded\n");
    } catch (error) {
        console.log("⚠️  Skipping funding (insufficient balance)\n");
    }

    // Deploy Breeding Lab
    console.log("4. Deploying BreedingLab...");
    const Breeding = await hre.ethers.getContractFactory("BreedingLab");
    const breeding = await Breeding.deploy(nftAddress);
    await breeding.waitForDeployment();
    const breedingAddress = await breeding.getAddress();
    console.log("✅ Breeding deployed:", breedingAddress, "\n");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployer: deployer.address,
        aiSigner: AI_SIGNER,
        contracts: {
            NFT: nftAddress,
            Staking: stakingAddress,
            Breeding: breedingAddress
        },
        timestamp: new Date().toISOString()
    };

    const deploymentsDir = path.join(__dirname, 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    fs.writeFileSync(
        path.join(deploymentsDir, 'latest.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nContract Addresses:");
    console.log("NFT Contract:", nftAddress);
    console.log("Staking Pool:", stakingAddress);
    console.log("Breeding Lab:", breedingAddress);
    console.log("\nSaved to: deployments/latest.json");
    console.log("\nVerify with:");
    console.log(`npx hardhat verify --network amoy ${nftAddress} "EvoNFT" "EVONFT" "${AI_SIGNER}"`);
    console.log(`npx hardhat verify --network amoy ${stakingAddress} "${nftAddress}"`);
    console.log(`npx hardhat verify --network amoy ${breedingAddress} "${nftAddress}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
