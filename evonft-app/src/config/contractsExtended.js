/**
 * Extended Smart Contract Configuration
 * Update addresses after deployment
 */

// Network Configuration
export const NETWORKS = {
    AMOY: {
        chainId: 80002,
        name: 'Polygon Amoy Testnet',
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        blockExplorer: 'https://amoy.polygonscan.com',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        }
    },
    POLYGON: {
        chainId: 137,
        name: 'Polygon Mainnet',
        rpcUrl: 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        }
    }
};

export const CURRENT_NETWORK = NETWORKS.AMOY;

// Contract Addresses (update after deployment)
export const NFT_CONTRACT = import.meta.env.VITE_NFT_CONTRACT || '';
export const STAKING_CONTRACT = import.meta.env.VITE_STAKING_CONTRACT || '';
export const BREEDING_CONTRACT = import.meta.env.VITE_BREEDING_CONTRACT || '';

// Legacy support
export const CONTRACT_ADDRESS = NFT_CONTRACT;

// NFT Contract ABI (Extended)
export const NFT_ABI = [
    // Read functions
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalMinted() view returns (uint256)",
    "function maxSupply() view returns (uint256)",
    "function mintPrice() view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function getEvolutionInfo(uint256 tokenId) view returns (uint256, uint256, uint256, uint256)",
    "function canEvolve(uint256 tokenId) view returns (bool)",
    "function version(uint256 tokenId) view returns (uint256)",
    "function tokenXP(uint256 tokenId) view returns (uint256)",
    "function getTokenStats(uint256 tokenId) view returns (uint8[5])",
    "function getTokenProgress(uint256 tokenId) view returns (uint256, uint256, uint256, uint256)",
    "function getFoodPrices() view returns (uint256, uint256, uint256)",
    "function getTrainPrice() view returns (uint256)",
    "function approve(address to, uint256 tokenId) external",

    // Write functions
    "function mint(address to, string memory uri) payable returns (uint256)",
    "function feed(uint256 tokenId, uint8 foodType) payable",
    "function train(uint256 tokenId, uint8 statType) payable",

    // Events
    "event Minted(address indexed to, uint256 indexed tokenId, string uri)",
    "event Evolved(uint256 indexed tokenId, string oldURI, string newURI, uint256 version, uint256 timestamp)",
    "event Fed(uint256 indexed tokenId, uint8 foodType, uint256 xpGained, uint256 totalXP)",
    "event Trained(uint256 indexed tokenId, uint8 statType, uint8 newValue, uint256 xpGained)",
    "event LevelUp(uint256 indexed tokenId, uint256 newLevel, uint256 totalXP)"
];

// Legacy support
export const CONTRACT_ABI = NFT_ABI;

// Staking Contract ABI
export const STAKING_ABI = [
    "function stake(uint256 tokenId) external",
    "function unstake(uint256 tokenId) external",
    "function claimRewards(uint256 tokenId) external",
    "function batchStake(uint256[] calldata tokenIds) external",
    "function batchClaimRewards(uint256[] calldata tokenIds) external",
    "function getPendingRewards(uint256 tokenId) view returns (uint256, uint256)",
    "function getStakeTier(uint256 tokenId) view returns (string, uint256)",
    "function getUserStakes(address user) view returns (uint256[])",
    "function getStakeInfo(uint256 tokenId) view returns (address, uint256, uint256, uint256, uint256, uint256)",
    "function totalStaked() view returns (uint256)",
    "event Staked(address indexed user, uint256 indexed tokenId, uint256 timestamp)",
    "event Unstaked(address indexed user, uint256 indexed tokenId, uint256 timestamp)",
    "event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 xp, uint256 matic)"
];

// Breeding Contract ABI
export const BREEDING_ABI = [
    "function breed(uint256 parent1, uint256 parent2, string calldata offspringURI) payable returns (uint256)",
    "function completeBreeding(uint256 breedingId, string calldata offspringURI) external",
    "function isBreedingReady(uint256 breedingId) view returns (bool)",
    "function getTimeRemaining(uint256 breedingId) view returns (uint256)",
    "function getBreedingInfo(uint256 breedingId) view returns (uint256, uint256, address, uint256, bool, uint256, uint256)",
    "function canBreed(uint256 tokenId) view returns (bool)",
    "function getBreedCount(uint256 tokenId) view returns (uint256)",
    "function getCompatibility(uint256 parent1, uint256 parent2) view returns (uint256)",
    "function breedingFee() view returns (uint256)",
    "event BreedingStarted(uint256 indexed breedingId, address indexed owner, uint256 parent1, uint256 parent2, uint256 startTime)",
    "event BreedingCompleted(uint256 indexed breedingId, uint256 indexed offspringId, uint256 parent1, uint256 parent2)"
];

// Constants
export const FOOD_TYPES = {
    BASIC: 0,
    PREMIUM: 1,
    LEGENDARY: 2
};

export const STAT_TYPES = {
    STRENGTH: 0,
    INTELLIGENCE: 1,
    SPEED: 2,
    ENDURANCE: 3,
    LUCK: 4
};

export const STAT_NAMES = ['Strength', 'Intelligence', 'Speed', 'Endurance', 'Luck'];

// Helper functions
export async function addNetworkToMetaMask(network = CURRENT_NETWORK) {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer]
            }]
        });
    } catch (error) {
        console.error('Error adding network:', error);
        throw error;
    }
}

export async function switchNetwork(network = CURRENT_NETWORK) {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${network.chainId.toString(16)}` }]
        });
    } catch (error) {
        if (error.code === 4902) {
            await addNetworkToMetaMask(network);
        } else {
            throw error;
        }
    }
}

export function getExplorerUrl(type, value, network = CURRENT_NETWORK) {
    const base = network.blockExplorer;
    switch (type) {
        case 'tx':
            return `${base}/tx/${value}`;
        case 'address':
            return `${base}/address/${value}`;
        case 'token':
            return `${base}/token/${value}`;
        case 'nft':
            return `${base}/nft/${value}`;
        default:
            return base;
    }
}
