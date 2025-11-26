import axios from 'axios';
import FormData from 'form-data';
import { logger } from './logger.js';

/**
 * Upload image buffer to Pinata
 */
export async function uploadImageToPinata(imageBuffer) {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata credentials not configured');
    }

    try {
        const formData = new FormData();
        formData.append('file', imageBuffer, {
            filename: `evonft-${Date.now()}.png`,
            contentType: 'image/png'
        });

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                },
                maxBodyLength: Infinity
            }
        );

        const ipfsHash = response.data.IpfsHash;
        const uri = `ipfs://${ipfsHash}`;

        logger.info(`✅ Image uploaded to Pinata: ${uri}`);
        logger.info(`   View at: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

        return uri;

    } catch (error) {
        logger.error('❌ Pinata upload error:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Upload JSON metadata to Pinata
 */
export async function uploadJSONToPinata(jsonData) {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata credentials not configured');
    }

    try {
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            {
                pinataContent: jsonData,
                pinataMetadata: {
                    name: `evonft-metadata-${Date.now()}.json`
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                }
            }
        );

        const ipfsHash = response.data.IpfsHash;
        const uri = `ipfs://${ipfsHash}`;

        logger.info(`✅ Metadata uploaded to Pinata: ${uri}`);

        return uri;

    } catch (error) {
        logger.error('❌ Pinata JSON upload error:', error.response?.data || error.message);
        throw error;
    }
}
