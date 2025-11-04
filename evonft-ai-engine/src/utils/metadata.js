import OpenAI from 'openai';
import { logger } from './logger.js';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * Generate evolution metadata with AI assistance
 */
export async function generateEvolutionMetadata({
    tokenId,
    currentMetadata,
    evolutionType,
    signals,
    newVersion
}) {
    try {
        // Base metadata
        const newMetadata = {
            name: currentMetadata.name || `EvoNFT #${tokenId}`,
            description: await generateDescription(currentMetadata, evolutionType, signals),
            image: await generateImageURI(tokenId, evolutionType, newVersion),
            attributes: await generateAttributes(currentMetadata, evolutionType, signals),
            version: newVersion,
            evolutionType: evolutionType,
            lastUpdated: Math.floor(Date.now() / 1000),
            evolutionHistory: [
                ...(currentMetadata.evolutionHistory || []),
                {
                    version: newVersion,
                    type: evolutionType,
                    timestamp: Math.floor(Date.now() / 1000),
                    signals: signals
                }
            ]
        };

        return newMetadata;
    } catch (error) {
        logger.error('Error generating metadata:', error);
        throw error;
    }
}

/**
 * Generate AI-powered description
 */
async function generateDescription(currentMetadata, evolutionType, signals) {
    if (!openai) {
        return `This NFT has evolved to ${evolutionType} form based on its journey and interactions.`;
    }

    try {
        const prompt = `Generate a short, engaging description (max 100 words) for an evolving NFT that has reached ${evolutionType} evolution level. 
    
Current description: ${currentMetadata.description || 'A digital companion'}
Activity signals: ${JSON.stringify(signals)}

Make it mystical and exciting, focusing on growth and transformation.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.8
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        logger.error('Error generating AI description:', error);
        return `This NFT has evolved to ${evolutionType} form, growing stronger through its journey.`;
    }
}

/**
 * Generate image URI (placeholder or AI-generated)
 */
async function generateImageURI(tokenId, evolutionType, version) {
    // For MVP, use placeholder images
    // In production, integrate with Stable Diffusion / DALL-E / Midjourney

    const colorMap = {
        common: '94A3B8',
        rare: '3B82F6',
        epic: 'A855F7',
        legendary: 'F59E0B'
    };

    const color = colorMap[evolutionType] || '8B5CF6';

    // Placeholder image URL
    return `https://via.placeholder.com/512/${color}/FFFFFF?text=EvoNFT+${tokenId}+v${version}`;

    // TODO: Implement actual image generation
    // const imagePrompt = `A mystical ${evolutionType} creature, digital art, vibrant colors`;
    // const generatedImage = await generateWithStableDiffusion(imagePrompt);
    // return await uploadImageToIPFS(generatedImage);
}

/**
 * Generate evolved attributes
 */
async function generateAttributes(currentMetadata, evolutionType, signals) {
    const currentAttrs = currentMetadata.attributes || [];

    // Calculate stat increases based on evolution type
    const statBoost = {
        common: 1,
        rare: 2,
        epic: 3,
        legendary: 5
    }[evolutionType] || 1;

    // Update or add attributes
    const newAttributes = [];

    // Level
    const currentLevel = findAttribute(currentAttrs, 'level')?.value || 1;
    newAttributes.push({
        trait_type: 'level',
        value: currentLevel + 1
    });

    // Rarity
    newAttributes.push({
        trait_type: 'rarity',
        value: evolutionType
    });

    // Stats
    const stats = ['strength', 'intelligence', 'speed', 'endurance', 'luck'];
    stats.forEach(stat => {
        const current = findAttribute(currentAttrs, stat)?.value || 5;
        newAttributes.push({
            trait_type: stat,
            value: Math.min(current + statBoost, 100)
        });
    });

    // Activity-based traits
    if (signals.transactionCount > 50) {
        newAttributes.push({
            trait_type: 'trait',
            value: 'Active Trader'
        });
    }

    if (signals.stakingDays > 30) {
        newAttributes.push({
            trait_type: 'trait',
            value: 'Long-term Holder'
        });
    }

    // Evolution count
    newAttributes.push({
        trait_type: 'evolutions',
        value: (findAttribute(currentAttrs, 'evolutions')?.value || 0) + 1
    });

    return newAttributes;
}

/**
 * Helper: Find attribute by trait_type
 */
function findAttribute(attributes, traitType) {
    return attributes.find(attr => attr.trait_type === traitType);
}

/**
 * Generate evolution prompt for AI image generation
 */
export function generateImagePrompt(evolutionType, attributes) {
    const level = findAttribute(attributes, 'level')?.value || 1;

    const basePrompts = {
        common: 'a young mystical creature, soft glow',
        rare: 'a majestic creature with glowing aura, detailed',
        epic: 'a powerful legendary beast, epic lighting, highly detailed',
        legendary: 'an ancient divine entity, cosmic energy, masterpiece, ultra detailed'
    };

    return `${basePrompts[evolutionType]}, level ${level}, digital art, fantasy style, vibrant colors, 4k`;
}
