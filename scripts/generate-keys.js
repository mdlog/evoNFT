#!/usr/bin/env node

/**
 * Generate secure keys for EvoNFT project
 * NEVER share or commit these keys!
 */

const crypto = require('crypto');
const { Wallet } = require('ethers');

console.log('🔐 Generating Secure Keys for EvoNFT\n');
console.log('⚠️  IMPORTANT: Keep these keys SECRET and SECURE!\n');
console.log('='.repeat(60));

// Generate Deployer Wallet
console.log('\n📝 DEPLOYER WALLET (for contract deployment)');
console.log('-'.repeat(60));
const deployerWallet = Wallet.createRandom();
console.log('Private Key:', deployerWallet.privateKey);
console.log('Address:', deployerWallet.address);
console.log('Mnemonic:', deployerWallet.mnemonic.phrase);

// Generate AI Signer Wallet
console.log('\n🤖 AI SIGNER WALLET (for evolution signatures)');
console.log('-'.repeat(60));
const aiSignerWallet = Wallet.createRandom();
console.log('Private Key:', aiSignerWallet.privateKey);
console.log('Address:', aiSignerWallet.address);
console.log('Mnemonic:', aiSignerWallet.mnemonic.phrase);

// Generate API Keys
console.log('\n🔑 API KEYS (random secure strings)');
console.log('-'.repeat(60));
console.log('API Key 1:', crypto.randomBytes(32).toString('hex'));
console.log('API Key 2:', crypto.randomBytes(32).toString('hex'));

console.log('\n' + '='.repeat(60));
console.log('\n📋 NEXT STEPS:\n');
console.log('1. Copy these values to your .env file');
console.log('2. NEVER commit .env to git');
console.log('3. Fund deployer wallet with testnet MATIC:');
console.log('   https://faucet.polygon.technology/');
console.log('4. Keep backup of mnemonic phrases in secure location');
console.log('5. For production, use hardware wallet or KMS\n');

console.log('⚠️  WARNING: This terminal output contains sensitive data!');
console.log('   Clear your terminal history after copying keys.\n');
