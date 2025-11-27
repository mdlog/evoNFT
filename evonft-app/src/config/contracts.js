/**
 * Smart Contract Configuration
 * Update CONTRACT_ADDRESS after deployment
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

// Current Network (change for production)
export const CURRENT_NETWORK = NETWORKS.AMOY;

// Contract Address - Read from environment variables
export const CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT || '';

if (!CONTRACT_ADDRESS) {
    console.error('❌ VITE_NFT_CONTRACT not set in .env file!');
}

// Contract ABI (minimal for frontend)
export const CONTRACT_ABI = [
    // Read functions
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalMinted() view returns (uint256)",
    "function maxSupply() view returns (uint256)",
    "function mintPrice() view returns (uint256)",
    "function cooldown() view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function getEvolutionInfo(uint256 tokenId) view returns (uint256, uint256, uint256, uint256)",
    "function canEvolve(uint256 tokenId) view returns (bool)",
    "function version(uint256 tokenId) view returns (uint256)",
    "function tokenXP(uint256 tokenId) view returns (uint256)",
    "function getTokenStats(uint256 tokenId) view returns (uint8[5])",
    "function getTokenProgress(uint256 tokenId) view returns (uint256, uint256, uint256, uint256)",

    // ERC-721 Approval functions (for marketplace)
    "function approve(address to, uint256 tokenId)",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function setApprovalForAll(address operator, bool approved)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",

    // Write functions
    "function mint(address to, string memory uri) payable returns (uint256)",
    "function feed(uint256 tokenId, uint8 foodType) payable",
    "function train(uint256 tokenId, uint8 statType) payable",

    // Events
    "event Minted(address indexed to, uint256 indexed tokenId, string uri)",
    "event Evolved(uint256 indexed tokenId, string oldURI, string newURI, uint256 version, uint256 timestamp)",
    "event Fed(uint256 indexed tokenId, uint8 foodType, uint256 xpGained, uint256 totalXP)",
    "event Trained(uint256 indexed tokenId, uint8 statType, uint8 newValue, uint256 xpGained)"
];

// Helper function to add network to MetaMask
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

// Helper function to switch network
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
        // If network not added, add it
        if (error.code === 4902) {
            await addNetworkToMetaMask(network);
        } else {
            throw error;
        }
    }
}

// Helper to get block explorer URL
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
