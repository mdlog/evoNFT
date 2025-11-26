import Replicate from 'replicate';
import { logger } from './logger.js';
import { uploadImageToPinata } from './pinataUpload.js';

const replicate = process.env.REPLICATE_API_TOKEN
    ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
    : null;

/**
 * Generate AI image for evolved NFT
 */
export async function generateEvolutionImage(tokenId, evolutionType, version, metadata) {
    try {
        // If Replicate not configured, use placeholder
        if (!replicate) {
            logger.warn('Replicate not configured, using placeholder image');
            return generatePlaceholderImage(tokenId, evolutionType, version);
        }

        logger.info(`🎨 Generating AI image for token ${tokenId}, type: ${evolutionType}, version: ${version}`);

        // Generate unique prompt based on evolution type and metadata
        const prompt = generateImagePrompt(evolutionType, version, metadata);
        logger.info(`📝 Prompt: ${prompt}`);

        // Call Stable Diffusion (optimized for speed)
        const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
                input: {
                    prompt: prompt,
                    negative_prompt: "ugly, blurry, low quality, distorted, deformed, text, watermark",
                    width: 512,
                    height: 512,
                    num_inference_steps: 25,  // Reduced from 50 (faster, still good quality)
                    guidance_scale: 7.5       // Balanced
                }
            }
        );

        logger.info('AI image generated successfully');

        // Download image
        const imageUrl = output[0];
        const response = await fetch(imageUrl);
        const imageBuffer = await response.arrayBuffer();

        // Upload to Pinata
        logger.info('Uploading image to Pinata...');
        const ipfsUri = await uploadImageToPinata(Buffer.from(imageBuffer));
        logger.info(`Image uploaded successfully: ${ipfsUri}`);

        return ipfsUri;

    } catch (error) {
        logger.error('Error generating AI image:', error);
        // Fallback to placeholder
        return generatePlaceholderImage(tokenId, evolutionType, version);
    }
}

/**
 * Generate unique image prompt with variations
 */
function generateImagePrompt(evolutionType, version, metadata) {
    const creatureType = metadata?.attributes?.find(a => a.trait_type === 'Creature Type')?.value || 'mystical creature';

    // Get stats for variation
    const strength = metadata?.attributes?.find(a => a.trait_type === 'Strength')?.value || 5;
    const intelligence = metadata?.attributes?.find(a => a.trait_type === 'Intelligence')?.value || 5;
    const speed = metadata?.attributes?.find(a => a.trait_type === 'Speed')?.value || 5;
    const endurance = metadata?.attributes?.find(a => a.trait_type === 'Endurance')?.value || 5;
    const luck = metadata?.attributes?.find(a => a.trait_type === 'Luck')?.value || 5;

    // Base style per evolution type
    const styleMap = {
        common: 'cute, simple, soft colors, beginner form',
        rare: 'detailed, glowing aura, magical effects, intermediate form',
        epic: 'highly detailed, powerful, epic lighting, advanced form',
        legendary: 'masterpiece, divine, cosmic energy, ultimate form, ultra detailed'
    };

    const powerLevel = {
        common: 'young',
        rare: 'mature',
        epic: 'powerful',
        legendary: 'ancient divine'
    };

    // Stats-based variations
    const variations = [];
    if (strength > 7) variations.push('muscular', 'strong');
    if (intelligence > 7) variations.push('wise', 'mystical');
    if (speed > 7) variations.push('agile', 'swift');
    if (endurance > 7) variations.push('resilient', 'armored');
    if (luck > 7) variations.push('blessed', 'fortunate');

    // Random elements for uniqueness (seeded by timestamp for true randomness)
    const elements = [
        'fire', 'ice', 'lightning', 'nature', 'shadow', 'light',
        'water', 'earth', 'wind', 'crystal', 'plasma', 'void'
    ];

    const poses = [
        'standing proud', 'in action pose', 'majestic stance',
        'dynamic pose', 'heroic posture', 'battle ready',
        'resting majestically', 'soaring', 'charging forward'
    ];

    const environments = [
        'mystical forest', 'ancient ruins', 'cosmic space',
        'magical realm', 'ethereal landscape', 'volcanic terrain',
        'frozen tundra', 'celestial palace', 'enchanted garden',
        'stormy skies', 'underwater kingdom', 'floating islands'
    ];

    const effects = [
        'glowing particles', 'energy aura', 'magical sparkles',
        'swirling mist', 'radiant light', 'crackling energy',
        'flowing ribbons', 'shimmering waves', 'pulsing power'
    ];

    // Use timestamp + version for randomness (different each evolution)
    const seed = Date.now() + version;
    const randomElement = elements[seed % elements.length];
    const randomPose = poses[(seed * 2) % poses.length];
    const randomEnv = environments[(seed * 3) % environments.length];
    const randomEffect = effects[(seed * 5) % effects.length];

    // Build prompt components
    const style = styleMap[evolutionType] || styleMap.common;
    const power = powerLevel[evolutionType] || powerLevel.common;
    const variationText = variations.length > 0 ? variations.join(', ') + ', ' : '';

    // Construct unique prompt
    const prompt = `A ${power} ${creatureType}, ${variationText}${style}, ${randomElement} element, ${randomPose}, ${randomEnv} background, ${randomEffect}, fantasy digital art, vibrant colors, cinematic lighting, professional illustration, trending on artstation, 4k, highly detailed, version ${version}`;

    return prompt;
}

/**
 * Generate placeholder image (fallback)
 */
function generatePlaceholderImage(tokenId, evolutionType, version) {
    const colorMap = {
        common: '94A3B8',      // Gray
        rare: '3B82F6',        // Blue  
        epic: 'A855F7',        // Purple
        legendary: 'F59E0B'    // Gold
    };

    const color = colorMap[evolutionType] || '8B5CF6';
    const emoji = {
        common: '🐣',
        rare: '🦋',
        epic: '🦅',
        legendary: '🐉'
    }[evolutionType] || '✨';

    return `https://via.placeholder.com/512/${color}/FFFFFF?text=${emoji}+EvoNFT+${tokenId}+v${version}`;
}

/**
 * Generate batch images (for pre-generation)
 */
export async function generateBatchImages(tokens) {
    const results = [];

    for (const token of tokens) {
        try {
            const imageUri = await generateEvolutionImage(
                token.tokenId,
                token.evolutionType,
                token.version,
                token.metadata
            );

            results.push({
                tokenId: token.tokenId,
                success: true,
                imageUri
            });

            // Rate limiting - wait 2 seconds between generations
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            logger.error(`Error generating image for token ${token.tokenId}:`, error);
            results.push({
                tokenId: token.tokenId,
                success: false,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Test image generation
 */
export async function testImageGeneration() {
    logger.info('Testing AI image generation...');

    const testMetadata = {
        attributes: [
            { trait_type: 'Creature Type', value: 'Dragon' }
        ]
    };

    const imageUri = await generateEvolutionImage(
        999,
        'legendary',
        5,
        testMetadata
    );

    logger.info(`Test image generated: ${imageUri}`);
    return imageUri;
}
