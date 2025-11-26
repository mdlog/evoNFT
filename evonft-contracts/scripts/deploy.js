const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying EvolvableNFT to", hre.network.name);

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC");

    // Deploy parameters
    const NAME = "EvoNFT";
    const SYMBOL = "EVONFT";
    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS || deployer.address;

    console.log("\n📋 Deployment Parameters:");
    console.log("   Name:", NAME);
    console.log("   Symbol:", SYMBOL);
    console.log("   AI Signer:", AI_SIGNER);

    // Deploy contract
    const EvolvableNFT = await hre.ethers.getContractFactory("EvolvableNFT");
    const evolvableNFT = await EvolvableNFT.deploy(NAME, SYMBOL, AI_SIGNER);

    await evolvableNFT.waitForDeployment();
    const contractAddress = await evolvableNFT.getAddress();

    console.log("\n✅ EvolvableNFT deployed to:", contractAddress);

    // Get contract info
    const mintPrice = await evolvableNFT.mintPrice();
    const maxSupply = await evolvableNFT.maxSupply();
    const cooldown = await evolvableNFT.cooldown();

    console.log("\n📊 Contract Info:");
    console.log("   Mint Price:", hre.ethers.formatEther(mintPrice), "MATIC");
    console.log("   Max Supply:", maxSupply.toString());
    console.log("   Cooldown:", cooldown.toString(), "seconds");

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contractAddress,
        deployer: deployer.address,
        aiSigner: AI_SIGNER,
        mintPrice: mintPrice.toString(),
        maxSupply: maxSupply.toString(),
        cooldown: cooldown.toString(),
        timestamp: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const filename = `${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n💾 Deployment info saved to:", filename);

    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n🔍 To verify contract, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${NAME}" "${SYMBOL}" "${AI_SIGNER}"`);
    }

    console.log("\n✨ Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
