import { create } from 'ipfs-http-client';
import { logger } from './logger.js';
import { uploadJSONToPinata } from './pinataUpload.js';

// Initialize IPFS client (using Infura or local node)
const ipfsClient = process.env.IPFS_API_URL
    ? create({ url: process.env.IPFS_API_URL })
    : null;

/**
 * Upload JSON metadata to IPFS (via Pinata)
 */
export async function uploadToIPFS(metadata) {
    try {
        // Try Pinata first
        if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
            return await uploadJSONToPinata(metadata);
        }

        // Fallback to IPFS client
        if (!ipfsClient) {
            logger.warn('IPFS client not configured, using mock URI');
            const mockCID = 'Qm' + Math.random().toString(36).substring(2, 15);
            return `ipfs://${mockCID}`;
        }

        const metadataString = JSON.stringify(metadata, null, 2);
        const { cid } = await ipfsClient.add(metadataString);

        const uri = `ipfs://${cid.toString()}`;
        logger.info(`Metadata uploaded to IPFS: ${uri}`);

        return uri;
    } catch (error) {
        logger.error('Error uploading to IPFS:', error);
        throw error;
    }
}

/**
 * Upload image to IPFS
 */
export async function uploadImageToIPFS(imageBuffer) {
    try {
        // Try Pinata first
        if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
            return await uploadImageToPinata(imageBuffer);
        }

        // Fallback to IPFS client
        if (!ipfsClient) {
            logger.warn('IPFS client not configured, using mock URI');
            const mockCID = 'Qm' + Math.random().toString(36).substring(2, 15);
            return `ipfs://${mockCID}`;
        }

        const { cid } = await ipfsClient.add(imageBuffer);
        const uri = `ipfs://${cid.toString()}`;

        logger.info(`Image uploaded to IPFS: ${uri}`);
        return uri;
    } catch (error) {
        logger.error('Error uploading image to IPFS:', error);
        throw error;
    }
}

/**
 * Upload image to Pinata
 */
async function uploadImageToPinata(imageBuffer) {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    try {
        const FormData = (await import('form-data')).default;
        const form = new FormData();

        form.append('file', imageBuffer, {
            filename: `evonft-${Date.now()}.png`,
            contentType: 'image/png'
        });

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
                ...form.getHeaders()
            },
            body: form
        });

        const data = await response.json();
        const uri = `ipfs://${data.IpfsHash}`;

        logger.info(`Image uploaded to Pinata: ${uri}`);
        return uri;
    } catch (error) {
        logger.error('Error uploading image to Pinata:', error);
        throw error;
    }
}

/**
 * Pin content to ensure persistence
 */
export async function pinToIPFS(cid) {
    try {
        if (!ipfsClient) return;

        await ipfsClient.pin.add(cid);
        logger.info(`Content pinned: ${cid}`);
    } catch (error) {
        logger.error('Error pinning to IPFS:', error);
    }
}

/**
 * Alternative: Upload to Pinata
 */
export async function uploadToPinata(metadata) {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata credentials not configured');
    }

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            },
            body: JSON.stringify({
                pinataContent: metadata,
                pinataMetadata: {
                    name: `evonft-metadata-${Date.now()}.json`
                }
            })
        });

        const data = await response.json();
        const uri = `ipfs://${data.IpfsHash}`;

        logger.info(`Metadata uploaded to Pinata: ${uri}`);
        return uri;
    } catch (error) {
        logger.error('Error uploading to Pinata:', error);
        throw error;
    }
}
