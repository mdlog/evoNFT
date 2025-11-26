#!/usr/bin/env node

/**
 * Update all configs with deployed contract addresses
 * Usage: node update-configs.js <BREEDING_ADDRESS>
 */

const fs = require('fs');
const path = require('path');

const breedingAddress = process.argv[2];

if (!breedingAddress) {
    console.error('❌ Error: Please provide breeding contract address');
    console.log('Usage: node update-configs.js <BREEDING_ADDRESS>');
    process.exit(1);
}

console.log('🔄 Updating configurations...\n');

// 1. Update Frontend .env
const frontendEnvPath = path.join(__dirname, 'evonft-app', '.env');
let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
frontendEnv = frontendEnv.replace(
    /VITE_BREEDING_CONTRACT=.*/,
    `VITE_BREEDING_CONTRACT=${breedingAddress}`
);
fs.writeFileSync(frontendEnvPath, frontendEnv);
console.log('✅ Updated: evonft-app/.env');

// 2. Update deployment summary
const summaryPath = path.join(__dirname, 'DEPLOYMENT_SUMMARY.md');
let summary = fs.readFileSync(summaryPath, 'utf8');
summary = summary.replace(/PENDING/g, breedingAddress);
summary = summary.replace(/⏳ PENDING DEPLOYMENT/g, '✅ DEPLOYED');
summary = summary.replace(/🟡 Partial Deployment \(66% Complete\)/g, '🟢 Full Deployment (100% Complete)');
fs.writeFileSync(summaryPath, summary);
console.log('✅ Updated: DEPLOYMENT_SUMMARY.md');

// 3. Create final deployment info
const deploymentInfo = {
    network: 'amoy',
    chainId: '80002',
    deployer: '0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4',
    aiSigner: '0x3e4d881819768fab30c5a79F3A9A7e69f0a935a4',
    contracts: {
        NFT: '0xe31d18Fb9925f677451845997f64806a88264b3D',
        Staking: '0xB7d914D84d6b5f21ef53B4B56DCB56508115C838',
        Breeding: breedingAddress
    },
    timestamp: new Date().toISOString(),
    status: 'complete',
    explorerLinks: {
        NFT: `https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D`,
        Staking: `https://amoy.polygonscan.com/address/0xB7d914D84d6b5f21ef53B4B56DCB56508115C838`,
        Breeding: `https://amoy.polygonscan.com/address/${breedingAddress}`
    }
};

const deploymentPath = path.join(__dirname, 'evonft-contracts', 'deployments', 'latest.json');
fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
console.log('✅ Updated: evonft-contracts/deployments/latest.json');

console.log('\n' + '='.repeat(60));
console.log('🎉 ALL CONFIGURATIONS UPDATED!');
console.log('='.repeat(60));
console.log('\n📋 Contract Addresses:');
console.log('   NFT:      0xe31d18Fb9925f677451845997f64806a88264b3D');
console.log('   Staking:  0xB7d914D84d6b5f21ef53B4B56DCB56508115C838');
console.log('   Breeding:', breedingAddress);
console.log('\n🚀 Ready to start the application!');
console.log('\nFrontend:');
console.log('   cd evonft-app && npm run dev');
console.log('\nAI Engine:');
console.log('   cd evonft-ai-engine && npm run dev');
console.log('\n' + '='.repeat(60));
