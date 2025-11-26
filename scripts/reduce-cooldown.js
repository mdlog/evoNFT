// Reduce evolution cooldown for testing
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: 'evonft-contracts/.env' });

const CONTRACT_ADDRESS = '0xe31d18Fb9925f677451845997f64806a88264b3D';
const RPC_URL = 'https://rpc-amoy.polygon.technology';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ABI = [
    "function cooldown() view returns (uint256)",
    "function setCooldown(uint256 _newCooldown) external",
    "function owner() view returns (address)"
];

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    console.log('🔍 Checking current cooldown...');
    const currentCooldown = await contract.cooldown();
    console.log(`Current cooldown: ${currentCooldown} seconds (${currentCooldown / 3600} hours)`);

    console.log('\n🔍 Checking contract owner...');
    const owner = await contract.owner();
    console.log(`Contract owner: ${owner}`);
    console.log(`Your address: ${wallet.address}`);

    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
        console.log('\n❌ You are not the contract owner!');
        console.log('Only the owner can change cooldown.');
        return;
    }

    // Set cooldown to 1 minute for testing
    const newCooldown = 60; // 60 seconds = 1 minute

    console.log(`\n📝 Setting cooldown to ${newCooldown} seconds...`);
    const tx = await contract.setCooldown(newCooldown);
    console.log(`Transaction sent: ${tx.hash}`);

    console.log('⏳ Waiting for confirmation...');
    await tx.wait();

    console.log('✅ Cooldown updated!');

    const updatedCooldown = await contract.cooldown();
    console.log(`New cooldown: ${updatedCooldown} seconds`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
