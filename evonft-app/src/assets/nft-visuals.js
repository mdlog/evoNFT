// NFT Visual System - Dynamic SVG Generation for EvoNFTs

// Base creature types with their visual characteristics
export const creatureTypes = {
    dragon: {
        name: 'Dragon',
        emoji: '🐉',
        colors: ['#ff6b6b', '#ee5a24', '#ff9ff3', '#54a0ff'],
        rarity: 'legendary',
        baseStats: { power: 85, speed: 70, intelligence: 90 }
    },
    phoenix: {
        name: 'Phoenix',
        emoji: '🔥',
        colors: ['#ff6348', '#ff4757', '#ffa502', '#ff6b81'],
        rarity: 'legendary',
        baseStats: { power: 80, speed: 95, intelligence: 75 }
    },
    unicorn: {
        name: 'Unicorn',
        emoji: '🦄',
        colors: ['#a29bfe', '#fd79a8', '#fdcb6e', '#e17055'],
        rarity: 'epic',
        baseStats: { power: 70, speed: 85, intelligence: 95 }
    },
    griffin: {
        name: 'Griffin',
        emoji: '🦅',
        colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'],
        rarity: 'epic',
        baseStats: { power: 75, speed: 90, intelligence: 80 }
    },
    wolf: {
        name: 'Wolf',
        emoji: '🐺',
        colors: ['#636e72', '#2d3436', '#74b9ff', '#0984e3'],
        rarity: 'rare',
        baseStats: { power: 70, speed: 80, intelligence: 70 }
    },
    fox: {
        name: 'Fox',
        emoji: '🦊',
        colors: ['#e17055', '#d63031', '#fdcb6e', '#e84393'],
        rarity: 'rare',
        baseStats: { power: 60, speed: 85, intelligence: 85 }
    },
    cat: {
        name: 'Cat',
        emoji: '🐱',
        colors: ['#74b9ff', '#0984e3', '#00b894', '#00cec9'],
        rarity: 'common',
        baseStats: { power: 50, speed: 75, intelligence: 80 }
    },
    rabbit: {
        name: 'Rabbit',
        emoji: '🐰',
        colors: ['#fd79a8', '#e84393', '#fdcb6e', '#e17055'],
        rarity: 'common',
        baseStats: { power: 40, speed: 90, intelligence: 60 }
    }
}

// Evolution stages that affect visual appearance
export const evolutionStages = {
    1: { name: 'Newborn', size: 0.8, glow: 0, effects: [] },
    2: { name: 'Young', size: 0.9, glow: 0.1, effects: ['sparkle'] },
    3: { name: 'Adult', size: 1, glow: 0.2, effects: ['sparkle'] },
    4: { name: 'Mature', size: 1.1, glow: 0.3, effects: ['sparkle', 'aura'] },
    5: { name: 'Elder', size: 1.2, glow: 0.4, effects: ['sparkle', 'aura'] },
    6: { name: 'Ancient', size: 1.3, glow: 0.5, effects: ['sparkle', 'aura', 'lightning'] },
    7: { name: 'Legendary', size: 1.4, glow: 0.6, effects: ['sparkle', 'aura', 'lightning'] },
    8: { name: 'Mythical', size: 1.5, glow: 0.7, effects: ['sparkle', 'aura', 'lightning', 'cosmic'] },
    9: { name: 'Divine', size: 1.6, glow: 0.8, effects: ['sparkle', 'aura', 'lightning', 'cosmic'] },
    10: { name: 'Transcendent', size: 1.8, glow: 1, effects: ['sparkle', 'aura', 'lightning', 'cosmic', 'reality'] }
}

// Rarity levels with visual modifiers
export const rarityLevels = {
    common: {
        name: 'Common',
        color: '#74b9ff',
        borderGlow: 'rgba(116, 185, 255, 0.3)',
        multiplier: 1,
        effects: []
    },
    rare: {
        name: 'Rare',
        color: '#00b894',
        borderGlow: 'rgba(0, 184, 148, 0.4)',
        multiplier: 1.25,
        effects: ['shimmer']
    },
    epic: {
        name: 'Epic',
        color: '#a29bfe',
        borderGlow: 'rgba(162, 155, 254, 0.5)',
        multiplier: 1.5,
        effects: ['shimmer', 'pulse']
    },
    legendary: {
        name: 'Legendary',
        color: '#fd79a8',
        borderGlow: 'rgba(253, 121, 168, 0.6)',
        multiplier: 2,
        effects: ['shimmer', 'pulse', 'rainbow']
    }
}

// Generate SVG for NFT based on its properties
export function generateNFTVisual(nftData) {
    const { tokenId, level = 1, creatureType = 'cat', rarity = 'common' } = nftData

    const creature = creatureTypes[creatureType] || creatureTypes.cat
    const evolution = evolutionStages[Math.min(level, 10)]
    const rarityData = rarityLevels[rarity]

    const size = 200 * evolution.size
    const centerX = size / 2
    const centerY = size / 2

    // Generate unique color based on tokenId
    const colorIndex = tokenId % creature.colors.length
    const primaryColor = creature.colors[colorIndex]
    const secondaryColor = creature.colors[(colorIndex + 1) % creature.colors.length]

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradients -->
                <radialGradient id="bg-${tokenId}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.1" />
                </radialGradient>
                
                <linearGradient id="creature-${tokenId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${primaryColor}" />
                    <stop offset="100%" style="stop-color:${secondaryColor}" />
                </linearGradient>
                
                <!-- Glow effect -->
                <filter id="glow-${tokenId}">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <!-- Sparkle animation -->
                <g id="sparkle-${tokenId}">
                    <circle r="2" fill="white" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
                    </circle>
                </g>
            </defs>
            
            <!-- Background -->
            <circle cx="${centerX}" cy="${centerY}" r="${size / 2 - 10}" fill="url(#bg-${tokenId})" 
                    stroke="${rarityData.color}" stroke-width="3" 
                    style="filter: drop-shadow(0 0 10px ${rarityData.borderGlow})"/>
            
            <!-- Main creature body -->
            <circle cx="${centerX}" cy="${centerY}" r="${size / 4}" fill="url(#creature-${tokenId})" 
                    filter="url(#glow-${tokenId})" opacity="${0.8 + evolution.glow * 0.2}"/>
            
            <!-- Creature emoji/icon -->
            <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" 
                  font-size="${size / 4}" opacity="0.9">${creature.emoji}</text>
            
            <!-- Sparkle effects for higher levels -->
            ${evolution.effects.includes('sparkle') ? `
                <use href="#sparkle-${tokenId}" x="${centerX - 40}" y="${centerY - 40}"/>
                <use href="#sparkle-${tokenId}" x="${centerX + 40}" y="${centerY - 40}"/>
                <use href="#sparkle-${tokenId}" x="${centerX - 40}" y="${centerY + 40}"/>
                <use href="#sparkle-${tokenId}" x="${centerX + 40}" y="${centerY + 40}"/>
            ` : ''}
            
            <!-- Aura effect for high levels -->
            ${evolution.effects.includes('aura') ? `
                <circle cx="${centerX}" cy="${centerY}" r="${size / 3}" fill="none" 
                        stroke="${primaryColor}" stroke-width="2" opacity="0.3">
                    <animate attributeName="r" values="${size / 3};${size / 3 + 10};${size / 3}" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite"/>
                </circle>
            ` : ''}
        </svg>
    `
}

// Generate placeholder image data URL
export function generateNFTImageURL(nftData) {
    const svg = generateNFTVisual(nftData)
    const encodedSvg = encodeURIComponent(svg)
    return `data:image/svg+xml,${encodedSvg}`
}

// Get random creature type based on rarity
export function getRandomCreatureType(rarity = 'common') {
    const creaturesOfRarity = Object.entries(creatureTypes)
        .filter(([_, creature]) => creature.rarity === rarity)

    if (creaturesOfRarity.length === 0) {
        // Fallback to any creature if no match
        const allCreatures = Object.keys(creatureTypes)
        return allCreatures[Math.floor(Math.random() * allCreatures.length)]
    }

    const randomIndex = Math.floor(Math.random() * creaturesOfRarity.length)
    return creaturesOfRarity[randomIndex][0]
}

// Generate complete NFT metadata
export function generateNFTMetadata(tokenId, overrides = {}) {
    const rarities = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'legendary']
    let rarity = overrides.rarity || rarities[Math.floor(Math.random() * rarities.length)]

    // Validate and normalize rarity
    const validRarities = ['common', 'rare', 'epic', 'legendary']
    if (!validRarities.includes(rarity)) {
        // Map old rarity names to new ones
        const rarityMap = {
            'uncommon': 'rare',
            'normal': 'common',
            'mythic': 'legendary',
            'mythical': 'legendary'
        }
        rarity = rarityMap[rarity] || 'common'
    }

    const creatureType = overrides.creatureType || getRandomCreatureType(rarity)
    const level = overrides.level || Math.floor(Math.random() * 5) + 1

    const creature = creatureTypes[creatureType] || creatureTypes.cat
    const rarityData = rarityLevels[rarity] || rarityLevels.common

    const nftData = {
        tokenId,
        name: `${creature.name} #${tokenId}`,
        description: `A ${rarityData.name} ${creature.name} that grows stronger through interaction and training.`,
        level,
        creatureType,
        rarity,
        traits: [
            { trait_type: 'Creature Type', value: creature.name },
            { trait_type: 'Rarity', value: rarityData.name },
            { trait_type: 'Level', value: level },
            { trait_type: 'Power', value: Math.floor(creature.baseStats.power * rarityData.multiplier) },
            { trait_type: 'Speed', value: Math.floor(creature.baseStats.speed * rarityData.multiplier) },
            { trait_type: 'Intelligence', value: Math.floor(creature.baseStats.intelligence * rarityData.multiplier) }
        ],
        ...overrides
    }

    nftData.image = generateNFTImageURL(nftData)
    return nftData
}

// Evolution visual effects
export const visualEffects = {
    sparkle: {
        name: 'Sparkle',
        description: 'Magical sparkles around the creature',
        minLevel: 2
    },
    aura: {
        name: 'Aura',
        description: 'Glowing aura indicating power',
        minLevel: 4
    },
    lightning: {
        name: 'Lightning',
        description: 'Electric energy crackling around',
        minLevel: 6
    },
    cosmic: {
        name: 'Cosmic',
        description: 'Stars and cosmic energy',
        minLevel: 8
    },
    reality: {
        name: 'Reality Distortion',
        description: 'Bends reality around the creature',
        minLevel: 10
    }
}