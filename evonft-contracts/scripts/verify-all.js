const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🔍 Verifying All Contracts on PolygonScan\n");

    // Get latest deployment
    const deploymentsDir = path.join(__dirname, "../deployments");
    const files = fs.readdirSync(deploymentsDir)
        .filter(f => f.startsWith("all-") && f.endsWith(".json"))
        .sort()
        .reverse();

    if (files.length === 0) {
        console.error("❌ No deployment file found");
        process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync(path.join(deploymentsDir, files[0]), "utf8"));
    const AI_SIGNER = process.env.AI_SIGNER_ADDRESS;

    console.log("📋 Contracts to verify:");
    console.log("NFT:        ", deployment.contracts.nft);
    console.log("Staking:    ", deployment.contracts.staking);
    console.log("Breeding:   ", deployment.contracts.breeding);
    console.log("Marketplace:", deployment.contracts.marketplace);
    console.log("");

    // Verify NFT
    try {
        console.log("1️⃣ Verifying NFT...");
        await hre.run("verify:verify", {
            address: deployment.contracts.nft,
            constructorArguments: ["EvoNFT", "EVONFT", AI_SIGNER]
        });
        console.log("✅ NFT verified\n");
    } catch (error) {
        console.log("⚠️  NFT:", error.message, "\n");
    }

    // Verify Staking
    try {
        console.log("2️⃣ Verifying Staking...");
        await hre.run("verify:verify", {
            address: deployment.contracts.staking,
            constructorArguments: [deployment.contracts.nft]
        });
        console.log("✅ Staking verified\n");
    } catch (error) {
        console.log("⚠️  Staking:", error.message, "\n");
    }

    // Verify Breeding
    try {
        console.log("3️⃣ Verifying Breeding...");
        await hre.run("verify:verify", {
            address: deployment.contracts.breeding,
            constructorArguments: [deployment.contracts.nft]
        });
        console.log("✅ Breeding verified\n");
    } catch (error) {
        console.log("⚠️  Breeding:", error.message, "\n");
    }

    // Verify Marketplace
    try {
        console.log("4️⃣ Verifying Marketplace...");
        await hre.run("verify:verify", {
            address: deployment.contracts.marketplace,
            constructorArguments: [deployment.contracts.nft]
        });
        console.log("✅ Marketplace verified\n");
    } catch (error) {
        console.log("⚠️  Marketplace:", error.message, "\n");
    }

    console.log("✨ Verification complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
