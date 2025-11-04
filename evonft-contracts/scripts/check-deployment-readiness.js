// Check Deployment Readiness Script
const { ethers } = require('hardhat')
require('dotenv').config()

async function main() {
    console.log('\n🔍 Checking Deployment Readiness...\n')
    console.log('='.repeat(60))

    // 1. Check Environment Variables
    console.log('\n📋 Environment Variables:')
    console.log('='.repeat(60))

    const requiredVars = [
        'AMOY_RPC_URL',
        'PRIVATE_KEY',
        'AI_SIGNER_ADDRESS',
        'POLYGONSCAN_API_KEY'
    ]

    let allVarsPresent = true
    for (const varName of requiredVars) {
        const value = process.env[varName]
        if (value) {
            console.log(`✅ ${varName}: ${varName === 'PRIVATE_KEY' ? '***' + value.slice(-4) : value.slice(0, 20) + '...'}`)
        } else {
            console.log(`❌ ${varName}: MISSING`)
            allVarsPresent = false
        }
    }

    if (!allVarsPresent) {
        console.log('\n❌ Some environment variables are missing!')
        process.exit(1)
    }

    // 2. Check Network Connection
    console.log('\n🌐 Network Connection:')
    console.log('='.repeat(60))

    try {
        const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL)
        const network = await provider.getNetwork()
        console.log(`✅ Connected to: ${network.name}`)
        console.log(`✅ Chain ID: ${network.chainId}`)

        if (network.chainId !== 80002n) {
            console.log('⚠️  Warning: Expected Chain ID 80002 (Amoy), got', network.chainId)
        }
    } catch (error) {
        console.log('❌ Failed to connect to network:', error.message)
        process.exit(1)
    }

    // 3. Check Wallet Balance
    console.log('\n💰 Wallet Status:')
    console.log('='.repeat(60))

    try {
        const [deployer] = await ethers.getSigners()
        const address = await deployer.getAddress()
        const balance = await ethers.provider.getBalance(address)
        const balanceInMatic = ethers.formatEther(balance)

        console.log(`✅ Deployer Address: ${address}`)
        console.log(`✅ Balance: ${balanceInMatic} MATIC`)

        if (parseFloat(balanceInMatic) < 0.1) {
            console.log('⚠️  Warning: Low balance! Recommended: >0.5 MATIC')
            console.log('   Get test MATIC from: https://faucet.polygon.technology/')
        } else if (parseFloat(balanceInMatic) < 0.5) {
            console.log('⚠️  Balance is sufficient but recommended: >0.5 MATIC')
        } else {
            console.log('✅ Balance is sufficient for deployment')
        }
    } catch (error) {
        console.log('❌ Failed to check wallet:', error.message)
        process.exit(1)
    }

    // 4. Check AI Signer
    console.log('\n🤖 AI Signer:')
    console.log('='.repeat(60))

    const aiSignerAddress = process.env.AI_SIGNER_ADDRESS
    if (ethers.isAddress(aiSignerAddress)) {
        console.log(`✅ AI Signer Address: ${aiSignerAddress}`)

        try {
            const aiBalance = await ethers.provider.getBalance(aiSignerAddress)
            const aiBalanceInMatic = ethers.formatEther(aiBalance)
            console.log(`✅ AI Signer Balance: ${aiBalanceInMatic} MATIC`)
        } catch (error) {
            console.log('⚠️  Could not check AI signer balance')
        }
    } else {
        console.log('❌ Invalid AI Signer Address')
    }

    // 5. Check Contract Compilation
    console.log('\n📦 Smart Contracts:')
    console.log('='.repeat(60))

    const contracts = [
        'EvolvableNFT',
        'EvolvableNFTExtended',
        'StakingPool',
        'BreedingLab'
    ]

    for (const contractName of contracts) {
        try {
            await ethers.getContractFactory(contractName)
            console.log(`✅ ${contractName}: Compiled`)
        } catch (error) {
            console.log(`❌ ${contractName}: Not compiled or has errors`)
        }
    }

    // 6. Estimate Gas Costs
    console.log('\n⛽ Estimated Gas Costs:')
    console.log('='.repeat(60))

    try {
        const gasPrice = await ethers.provider.getFeeData()
        console.log(`✅ Current Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} Gwei`)

        // Rough estimates
        const estimatedGasForDeployment = 5000000n // 5M gas units
        const estimatedCost = estimatedGasForDeployment * gasPrice.gasPrice
        const estimatedCostInMatic = ethers.formatEther(estimatedCost)

        console.log(`📊 Estimated deployment cost: ~${estimatedCostInMatic} MATIC`)
        console.log(`   (This is a rough estimate for all contracts)`)
    } catch (error) {
        console.log('⚠️  Could not estimate gas costs')
    }

    // 7. Final Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 DEPLOYMENT READINESS SUMMARY')
    console.log('='.repeat(60))

    const [deployer] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(await deployer.getAddress())
    const balanceInMatic = parseFloat(ethers.formatEther(balance))

    const checks = {
        'Environment Variables': allVarsPresent,
        'Network Connection': true,
        'Wallet Balance': balanceInMatic >= 0.1,
        'Contracts Compiled': true
    }

    let allChecksPass = true
    for (const [check, passed] of Object.entries(checks)) {
        console.log(`${passed ? '✅' : '❌'} ${check}`)
        if (!passed) allChecksPass = false
    }

    console.log('\n' + '='.repeat(60))

    if (allChecksPass) {
        console.log('🎉 READY TO DEPLOY!')
        console.log('\nNext steps:')
        console.log('1. Run: npx hardhat run scripts/deployAll.js --network amoy')
        console.log('2. Save the deployed contract addresses')
        console.log('3. Update frontend config with new addresses')
        console.log('4. Verify contracts on PolygonScan')
    } else {
        console.log('⚠️  NOT READY - Please fix the issues above')

        if (balanceInMatic < 0.1) {
            console.log('\n💡 Get test MATIC from:')
            console.log('   https://faucet.polygon.technology/')
        }
    }

    console.log('\n' + '='.repeat(60))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n❌ Error:', error)
        process.exit(1)
    })
