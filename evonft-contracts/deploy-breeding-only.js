const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Deploying BreedingLab contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "MATIC\n");

    // NFT contract address from previous deployment
    const nftAddress = "0xe31d18Fb9925f677451845997f64806a88264b3D";
    console.log("NFT Contract:", nftAddress, "\n");

    // Deploy Breeding Lab
    console.log("Deploying BreedingLab...");
    const Breeding = await hre.ethers.getContractFactory("BreedingLab");
    const breeding = await Breeding.deploy(nftAddress);
    await breeding.waitForDeployment();
    const breedingAddress = await breeding.getAddress();
    console.log("✅ Breeding deployed:", breedingAddress, "\n");

    // Update deployment info
    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS || deployer.address;
    const stakingAddress = "0xB7d914D84d6b5f21ef53B4B56DCB56508115C838";

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
    console.log("\nAll Contract Addresses:");
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
