/**
 * Debug script untuk marketplace
 * Jalankan di browser console untuk memeriksa data
 */

// Check environment variables
console.log('🔍 Environment Variables:');
console.log('VITE_NFT_CONTRACT:', import.meta.env.VITE_NFT_CONTRACT);
console.log('VITE_MARKETPLACE_CONTRACT:', import.meta.env.VITE_MARKETPLACE_CONTRACT);
console.log('VITE_STAKING_CONTRACT:', import.meta.env.VITE_STAKING_CONTRACT);
console.log('VITE_BREEDING_CONTRACT:', import.meta.env.VITE_BREEDING_CONTRACT);

// Check if contracts are loaded
import { CONTRACT_ADDRESS } from './src/config/contracts.js';
import { NFT_CONTRACT, MARKETPLACE_CONTRACT } from './src/config/contractsExtended.js';

console.log('📋 Contract Addresses:');
console.log('CONTRACT_ADDRESS (main):', CONTRACT_ADDRESS);
console.log('NFT_CONTRACT (extended):', NFT_CONTRACT);
console.log('MARKETPLACE_CONTRACT:', MARKETPLACE_CONTRACT);

// Test blockchain connection
async function testConnection() {
    try {
        const { ethers } = await import('ethers');
        
        // Test provider
        const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Blockchain connection OK, block:', blockNumber);
        
        // Test NFT contract
        if (CONTRACT_ADDRESS) {
            const nftContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                ['function totalMinted() view returns (uint256)'],
                provider
            );
            
            const totalMinted = await nftContract.totalMinted();
            console.log('✅ NFT Contract OK, total minted:', Number(totalMinted));
        } else {
            console.error('❌ NFT Contract address not set');
        }
        
        // Test Marketplace contract
        if (MARKETPLACE_CONTRACT) {
            const marketplaceContract = new ethers.Contract(
                MARKETPLACE_CONTRACT,
                ['function getMarketplaceStats() view returns (uint256, uint256, uint256, uint256)'],
                provider
            );
            
            const stats = await marketplaceContract.getMarketplaceStats();
            console.log('✅ Marketplace Contract OK, stats:', {
                totalListings: Number(stats[0]),
                totalSales: Number(stats[1]),
                totalVolume: ethers.formatEther(stats[2]),
                marketplaceFee: Number(stats[3])
            });
        } else {
            console.error('❌ Marketplace Contract address not set');
        }
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

// Run test
testConnection();