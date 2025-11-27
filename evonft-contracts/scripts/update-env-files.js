const fs = require("fs");
const path = require("path");

// Get deployment file (latest)
const deploymentsDir = path.join(__dirname, "../deployments");
const files = fs.readdirSync(deploymentsDir)
    .filter(f => f.startsWith("all-") && f.endsWith(".json"))
    .sort()
    .reverse();

if (files.length === 0) {
    console.error("❌ No deployment file found");
    process.exit(1);
}

const latestFile = path.join(deploymentsDir, files[0]);
const deployment = JSON.parse(fs.readFileSync(latestFile, "utf8"));

console.log("📝 Updating .env files with new addresses...\n");

// Update contracts .env
const contractsEnvPath = path.join(__dirname, "../.env");
let contractsEnv = fs.readFileSync(contractsEnvPath, "utf8");

contractsEnv = contractsEnv.replace(/NFT_CONTRACT=.*/g, `NFT_CONTRACT=${deployment.contracts.nft}`);
contractsEnv = contractsEnv.replace(/VITE_NFT_CONTRACT=.*/g, `VITE_NFT_CONTRACT=${deployment.contracts.nft}`);
contractsEnv = contractsEnv.replace(/STAKING_CONTRACT=.*/g, `STAKING_CONTRACT=${deployment.contracts.staking}`);
contractsEnv = contractsEnv.replace(/BREEDING_CONTRACT=.*/g, `BREEDING_CONTRACT=${deployment.contracts.breeding}`);
contractsEnv = contractsEnv.replace(/MARKETPLACE_CONTRACT=.*/g, `MARKETPLACE_CONTRACT=${deployment.contracts.marketplace}`);

fs.writeFileSync(contractsEnvPath, contractsEnv);
console.log("✅ Updated:", contractsEnvPath);

// Update app .env
const appEnvPath = path.join(__dirname, "../../evonft-app/.env");
if (fs.existsSync(appEnvPath)) {
    let appEnv = fs.readFileSync(appEnvPath, "utf8");
    
    appEnv = appEnv.replace(/VITE_NFT_CONTRACT=.*/g, `VITE_NFT_CONTRACT=${deployment.contracts.nft}`);
    appEnv = appEnv.replace(/VITE_STAKING_CONTRACT=.*/g, `VITE_STAKING_CONTRACT=${deployment.contracts.staking}`);
    appEnv = appEnv.replace(/VITE_BREEDING_CONTRACT=.*/g, `VITE_BREEDING_CONTRACT=${deployment.contracts.breeding}`);
    appEnv = appEnv.replace(/VITE_MARKETPLACE_CONTRACT=.*/g, `VITE_MARKETPLACE_CONTRACT=${deployment.contracts.marketplace}`);
    
    fs.writeFileSync(appEnvPath, appEnv);
    console.log("✅ Updated:", appEnvPath);
}

console.log("\n📋 New Addresses:");
console.log("NFT:        ", deployment.contracts.nft);
console.log("Staking:    ", deployment.contracts.staking);
console.log("Breeding:   ", deployment.contracts.breeding);
console.log("Marketplace:", deployment.contracts.marketplace);
console.log("\n✨ Done!");
