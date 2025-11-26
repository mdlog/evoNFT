/**
 * Script untuk check stats NFT langsung dari blockchain
 * Gunakan untuk verify apakah training sebelumnya tersimpan
 */

import { ethers } from 'ethers';

// Config - sesuaikan dengan .env
const RPC_URL = process.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology';
const CONTRACT_ADDRESS = process.env.VITE_NFT_CONTRACT_EXTENDED;

// ABI minimal untuk read stats
const ABI = [
    "function getTokenStats(uint256 tokenId) external view returns (uint8[5] memory)",
    "function tokenXP(uint256 tokenId) external view returns (uint256)",
    "function version(uint256 tokenId) external view returns (uint256)",
    "function ownerOf(uint256 tokenId) external view returns (address)"
];

async function checkStats(tokenId) {
    try {
        console.log('🔍 Checking NFT #' + tokenId + ' stats from blockchain...\n');

        // Connect to blockchain
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // Get data
        const [stats, xp, level, owner] = await Promise.all([
            contract.getTokenStats(tokenId),
            contract.tokenXP(tokenId),
            contract.version(tokenId),
            contract.ownerOf(tokenId)
        ]);

        // Display results
        console.log('📊 Stats (from blockchain):');
        console.log('   Strength:     ' + stats[0] + '/100');
        console.log('   Intelligence: ' + stats[1] + '/100');
        console.log('   Speed:        ' + stats[2] + '/100');
        console.log('   Endurance:    ' + stats[3] + '/100');
        console.log('   Luck:         ' + stats[4] + '/100');
        console.log('');
        console.log('📈 Progress:');
        console.log('   XP:    ' + xp.toString());
        console.log('   Level: ' + level.toString());
        console.log('');
        console.log('👤 Owner: ' + owner);
        console.log('');

        // Check if stats are default
        const allDefault = stats.every(s => Number(s) === 5);
        if (allDefault) {
            console.log('⚠️  All stats are still at default (5)');
            console.log('    This means no training has been done yet, OR');
            console.log('    Training transactions failed/reverted');
        } else {
            console.log('✅ Stats have been modified from default!');
            console.log('   Training data IS saved on blockchain');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('invalid token ID')) {
            console.log('\n💡 NFT #' + tokenId + ' does not exist');
        }
    }
}

// Get token ID from command line
const tokenId = process.argv[2];

if (!tokenId) {
    console.log('Usage: node check-stats.js <tokenId>');
    console.log('Example: node check-stats.js 0');
    process.exit(1);
}

checkStats(tokenId);
