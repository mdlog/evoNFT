#!/usr/bin/env node

const { ethers } = require('ethers');
require('dotenv').config({ path: './evonft-contracts/.env' });

async function checkBalance() {
    console.log('🔍 Checking Wallet Balance...\n');

    const rpcUrl = process.env.AMOY_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const aiSignerAddress = process.env.AI_SIGNER_ADDRESS;

    if (!rpcUrl || !privateKey) {
        console.error('❌ Missing RPC_URL or PRIVATE_KEY in .env');
        process.exit(1);
    }

    try {
        // Connect to Mumbai testnet
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        console.log('📍 Network: Polygon Amoy Testnet');
        console.log('🔗 RPC:', rpcUrl);
        console.log('');

        // Check deployer wallet
        console.log('👤 Deployer Wallet:');
        console.log('   Address:', wallet.address);
        const balance = await provider.getBalance(wallet.address);
        console.log('   Balance:', ethers.formatEther(balance), 'MATIC');
        console.log('');

        // Check AI signer address
        if (aiSignerAddress) {
            console.log('🤖 AI Signer Address:');
            console.log('   Address:', aiSignerAddress);
            const aiBalance = await provider.getBalance(aiSignerAddress);
            console.log('   Balance:', ethers.formatEther(aiBalance), 'MATIC');
            console.log('');
        }

        // Check if addresses match
        if (wallet.address.toLowerCase() === aiSignerAddress.toLowerCase()) {
            console.log('✅ Deployer and AI Signer are the same wallet (OK for testnet)');
        } else {
            console.log('⚠️  Deployer and AI Signer are different wallets');
        }
        console.log('');

        // Check if has enough balance
        const minBalance = ethers.parseEther('0.1');
        if (balance < minBalance) {
            console.log('⚠️  Low balance! You need at least 0.1 MATIC for deployment');
            console.log('');
            console.log('💰 Get testnet MATIC from faucet:');
            console.log('   https://faucet.polygon.technology/');
            console.log('   or');
            console.log('   https://mumbaifaucet.com/');
            console.log('');
            console.log('   Send to:', wallet.address);
        } else {
            console.log('✅ Balance sufficient for deployment!');
        }

        // Get network info
        const network = await provider.getNetwork();
        console.log('');
        console.log('🌐 Network Info:');
        console.log('   Chain ID:', network.chainId.toString());
        console.log('   Name:', network.name);

        const blockNumber = await provider.getBlockNumber();
        console.log('   Latest Block:', blockNumber);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkBalance();
