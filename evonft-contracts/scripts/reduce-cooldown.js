// Reduce evolution cooldown for testing
const hre = require("hardhat");

const CONTRACT_ADDRESS = '0xe31d18Fb9925f677451845997f64806a88264b3D';

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log('🔍 Using account:', deployer.address);

    const contract = await hre.ethers.getContractAt('EvolvableNFTExtended', CONTRACT_ADDRESS);

    console.log('\n🔍 Checking current cooldown...');
    const currentCooldown = await contract.cooldown();
    console.log(`Current cooldown: ${currentCooldown} seconds (${Number(currentCooldown) / 3600} hours)`);

    console.log('\n🔍 Checking contract owner...');
    const owner = await contract.owner();
    console.log(`Contract owner: ${owner}`);
    console.log(`Your address: ${deployer.address}`);

    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.log('\n❌ You are not the contract owner!');
        console.log('Only the owner can change cooldown.');
        return;
    }

    // Set cooldown to 1 minute for testing
    const newCooldown = 60; // 60 seconds = 1 minute

    console.log(`\n📝 Setting cooldown to ${newCooldown} seconds (1 minute)...`);
    const tx = await contract.setCooldown(newCooldown);
    console.log(`Transaction sent: ${tx.hash}`);

    console.log('⏳ Waiting for confirmation...');
    await tx.wait();

    console.log('✅ Cooldown updated!');

    const updatedCooldown = await contract.cooldown();
    console.log(`New cooldown: ${updatedCooldown} seconds`);
    console.log('\n🎉 You can now test evolution with 1-minute cooldown!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
