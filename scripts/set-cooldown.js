// Set evolution cooldown period
const hre = require("hardhat");

const CONTRACT_ADDRESS = '0xe31d18Fb9925f677451845997f64806a88264b3D';

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log('🔧 Setting evolution cooldown...');
    console.log('Using account:', deployer.address);

    const contract = await hre.ethers.getContractAt('EvolvableNFTExtended', CONTRACT_ADDRESS);

    // Check current cooldown
    const currentCooldown = await contract.cooldown();
    console.log(`\nCurrent cooldown: ${currentCooldown} seconds (${Number(currentCooldown) / 3600} hours)`);

    // Choose cooldown period
    const options = {
        '1': { seconds: 60, name: '1 minute (testing)' },
        '2': { seconds: 300, name: '5 minutes (demo)' },
        '3': { seconds: 3600, name: '1 hour (fast)' },
        '4': { seconds: 21600, name: '6 hours (moderate)' },
        '5': { seconds: 86400, name: '24 hours (production)' }
    };

    console.log('\nAvailable options:');
    console.log('1. 1 minute (testing)');
    console.log('2. 5 minutes (demo)');
    console.log('3. 1 hour (fast)');
    console.log('4. 6 hours (moderate)');
    console.log('5. 24 hours (production)');

    // Get choice from command line argument or use default
    const choice = process.argv[2] || '2'; // Default to 5 minutes
    const selected = options[choice];

    if (!selected) {
        console.log('❌ Invalid choice');
        return;
    }

    console.log(`\n📝 Setting cooldown to: ${selected.name}`);

    const tx = await contract.setCooldown(selected.seconds);
    console.log(`Transaction sent: ${tx.hash}`);

    console.log('⏳ Waiting for confirmation...');
    await tx.wait();

    console.log('✅ Cooldown updated!');

    const newCooldown = await contract.cooldown();
    console.log(`New cooldown: ${newCooldown} seconds (${Number(newCooldown) / 3600} hours)`);

    console.log('\n🎉 Done! You can now evolve with new cooldown period.');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
