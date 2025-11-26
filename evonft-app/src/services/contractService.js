import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';

/**
 * Service untuk contract operations
 */
export class ContractService {
    constructor(signerOrProvider) {
        this.contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signerOrProvider
        );
    }

    /**
     * Mint new NFT
     */
    async mint(to, uri, value) {
        try {
            const tx = await this.contract.mint(to, uri, { value });
            const receipt = await tx.wait();

            // Extract tokenId from Minted event
            const event = receipt.logs.find(log => {
                try {
                    const parsed = this.contract.interface.parseLog(log);
                    return parsed.name === 'Minted';
                } catch {
                    return false;
                }
            });

            if (event) {
                const parsed = this.contract.interface.parseLog(event);
                return {
                    success: true,
                    tokenId: Number(parsed.args.tokenId),
                    txHash: receipt.hash,
                    blockNumber: receipt.blockNumber
                };
            }

            return {
                success: true,
                txHash: receipt.hash,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            console.error('Mint error:', error);
            throw error;
        }
    }

    /**
     * Get NFT metadata
     */
    async getNFTMetadata(tokenId) {
        try {
            const uri = await this.contract.tokenURI(tokenId);
            const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

            const response = await fetch(metadataUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch metadata');
            }

            const metadata = await response.json();
            return metadata;
        } catch (error) {
            console.error('Get metadata error:', error);
            throw error;
        }
    }

    /**
     * Get evolution info
     */
    async getEvolutionInfo(tokenId) {
        try {
            const [version, lastEvolved, nextEvolveTime, nonce] =
                await this.contract.getEvolutionInfo(tokenId);

            return {
                version: Number(version),
                lastEvolved: Number(lastEvolved),
                nextEvolveTime: Number(nextEvolveTime),
                nonce: Number(nonce)
            };
        } catch (error) {
            console.error('Get evolution info error:', error);
            throw error;
        }
    }

    /**
     * Check if NFT can evolve
     */
    async canEvolve(tokenId) {
        try {
            return await this.contract.canEvolve(tokenId);
        } catch (error) {
            console.error('Can evolve check error:', error);
            throw error;
        }
    }

    /**
     * Get owner of NFT
     */
    async ownerOf(tokenId) {
        try {
            return await this.contract.ownerOf(tokenId);
        } catch (error) {
            console.error('Owner of error:', error);
            throw error;
        }
    }

    /**
     * Get user's NFT balance
     */
    async balanceOf(address) {
        try {
            const balance = await this.contract.balanceOf(address);
            return Number(balance);
        } catch (error) {
            console.error('Balance of error:', error);
            throw error;
        }
    }

    /**
     * Get contract stats
     */
    async getStats() {
        try {
            const [totalMinted, maxSupply, mintPrice, cooldown] = await Promise.all([
                this.contract.totalMinted(),
                this.contract.maxSupply(),
                this.contract.mintPrice(),
                this.contract.cooldown()
            ]);

            return {
                totalMinted: Number(totalMinted),
                maxSupply: Number(maxSupply),
                mintPrice: ethers.formatEther(mintPrice),
                mintPriceWei: mintPrice.toString(),
                cooldown: Number(cooldown),
                cooldownHours: Number(cooldown) / 3600
            };
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }

    /**
     * Listen for events
     */
    onMinted(callback) {
        this.contract.on('Minted', (to, tokenId, uri, event) => {
            callback({
                to,
                tokenId: Number(tokenId),
                uri,
                txHash: event.log.transactionHash,
                blockNumber: event.log.blockNumber
            });
        });
    }

    onEvolved(callback) {
        this.contract.on('Evolved', (tokenId, oldURI, newURI, version, timestamp, event) => {
            callback({
                tokenId: Number(tokenId),
                oldURI,
                newURI,
                version: Number(version),
                timestamp: Number(timestamp),
                txHash: event.log.transactionHash,
                blockNumber: event.log.blockNumber
            });
        });
    }

    /**
     * Remove event listeners
     */
    removeAllListeners() {
        this.contract.removeAllListeners();
    }
}

/**
 * Helper functions
 */

/**
 * Upload metadata to IPFS
 * Now using real IPFS via Pinata
 */
export { uploadMetadataToIPFS } from './ipfsService';

/**
 * Generate initial metadata for new NFT
 */
export function generateInitialMetadata(tokenId) {
    // Rarity distribution: 60% common, 30% uncommon, 10% rare
    const rand = Math.random();
    let rarity;

    if (rand < 0.6) {
        rarity = 'common';
    } else if (rand < 0.9) {
        rarity = 'uncommon';
    } else {
        rarity = 'rare';
    }

    // Stats start at 5 (consistent with contract)
    // Users can increase stats through training
    const INITIAL_STAT_VALUE = 5;

    const traits = ['🔥', '💧', '🌍', '💨', '⚡', '🌟'];
    const shuffledTraits = [...traits].sort(() => Math.random() - 0.5);
    const selectedTraits = shuffledTraits.slice(0, Math.floor(Math.random() * 3) + 1);

    // Creature types based on rarity (lowercase to match nft-visuals.js)
    const creatureTypes = {
        common: ['cat', 'rabbit'],
        uncommon: ['wolf', 'fox'],
        rare: ['dragon', 'phoenix', 'unicorn', 'griffin']
    };

    const availableTypes = creatureTypes[rarity];
    const creatureType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    // Capitalize creature type for display
    const creatureTypeDisplay = creatureType.charAt(0).toUpperCase() + creatureType.slice(1);

    const metadata = {
        name: `EvoNFT #${tokenId}`,
        description: `A ${rarity} ${creatureTypeDisplay} that grows and evolves with you. Train to increase stats!`,
        image: `https://via.placeholder.com/512/8B5CF6/FFFFFF?text=EvoNFT+${tokenId}`,
        attributes: [
            { trait_type: 'Level', value: 1 },
            { trait_type: 'Rarity', value: rarity },
            { trait_type: 'Creature Type', value: creatureTypeDisplay },
            // All stats start at 5 (consistent with smart contract)
            { trait_type: 'Strength', value: INITIAL_STAT_VALUE },
            { trait_type: 'Intelligence', value: INITIAL_STAT_VALUE },
            { trait_type: 'Speed', value: INITIAL_STAT_VALUE },
            { trait_type: 'Endurance', value: INITIAL_STAT_VALUE },
            { trait_type: 'Luck', value: INITIAL_STAT_VALUE }
        ],
        version: 1,
        evolutionType: 'genesis',
        lastUpdated: Math.floor(Date.now() / 1000),
        traits: selectedTraits,
        rarity: rarity,
        creatureType: creatureType // lowercase for SVG generation
    };

    // Debug: Log generated metadata
    console.log('🎲 Generated Metadata:', {
        tokenId,
        rarity,
        creatureType: creatureTypeDisplay,
        initialStats: INITIAL_STAT_VALUE,
        note: 'All stats start at 5 (consistent with contract). Use Train to increase!'
    });

    return metadata;
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;

    if (diff <= 0) return 'Ready';

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
}

/**
 * Parse contract error
 */
export function parseContractError(error) {
    if (error.reason) return error.reason;
    if (error.message) {
        if (error.message.includes('user rejected')) {
            return 'Transaction rejected by user';
        }
        if (error.message.includes('insufficient funds')) {
            return 'Insufficient funds for transaction';
        }
        if (error.message.includes('Cooldown not passed')) {
            return 'Evolution cooldown not passed yet';
        }
    }
    return 'Transaction failed. Please try again.';
}
