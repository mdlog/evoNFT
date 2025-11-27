const hre = require("hardhat");

async function main() {
    const contracts = {
        'NFT': '0xb45471de7F633C49d4e47B6c86E67B1Ce3665c55',
        'Staking': '0x7432BCb3605bc754E5606Bd6c6E6042168cE7427',
        'Breeding': '0xD7236c8F8ABA01F064307864B27E020b787a262f',
        'Marketplace': '0x1d328AcFcFd011b57a04c8f717c6E691bba4eEb8'
    };

    const [signer] = await hre.ethers.getSigners();
    console.log("👤 Signer:", signer.address);
    console.log("");

    let totalWithdrawn = 0n;

    for (const [name, address] of Object.entries(contracts)) {
        console.log(`💰 ${name} Contract: ${address}`);
        
        const balance = await hre.ethers.provider.getBalance(address);
        console.log(`   Balance: ${hre.ethers.formatEther(balance)} MATIC`);
        
        if (balance === 0n) {
            console.log(`   ⏭️  Skipping (no balance)\n`);
            continue;
        }

        try {
            // Get contract with withdraw function
            const contract = await hre.ethers.getContractAt("EvolvableNFTExtended", address);
            
            console.log(`   🔄 Withdrawing...`);
            const tx = await contract.withdraw();
            console.log(`   📝 TX: ${tx.hash}`);
            
            await tx.wait();
            console.log(`   ✅ Withdrawn!\n`);
            
            totalWithdrawn += balance;
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    console.log(`\n📊 Total Withdrawn: ${hre.ethers.formatEther(totalWithdrawn)} MATIC`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
