import axios from 'axios';

/**
 * IPFS Service using Pinata
 * Documentation: https://docs.pinata.cloud
 */

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Pinata API endpoints
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} IPFS URI (ipfs://...)
 */
export async function uploadMetadataToIPFS(metadata) {
    try {
        if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
            console.warn('⚠️ Pinata credentials not configured, using mock IPFS');
            return generateMockIPFSUri(metadata);
        }

        // Prepare headers
        const headers = PINATA_JWT
            ? {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
            : {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
                'Content-Type': 'application/json'
            };

        // Upload to Pinata
        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
            {
                pinataContent: metadata,
                pinataMetadata: {
                    name: metadata.name || `NFT-${Date.now()}`,
                },
                pinataOptions: {
                    cidVersion: 1
                }
            },
            { headers }
        );

        const ipfsHash = response.data.IpfsHash;
        const ipfsUri = `ipfs://${ipfsHash}`;

        return ipfsUri;

    } catch (error) {
        console.error('❌ IPFS upload error:', error.message);
        console.warn('⚠️ Falling back to mock IPFS');
        return generateMockIPFSUri(metadata);
    }
}

/**
 * Upload image to IPFS via Pinata
 * @param {File|Blob} file - Image file
 * @returns {Promise<string>} IPFS URI (ipfs://...)
 */
export async function uploadImageToIPFS(file) {
    try {
        if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
            throw new Error('Pinata credentials not configured');
        }

        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: file.name || `image-${Date.now()}`,
        });
        formData.append('pinataMetadata', metadata);

        const headers = PINATA_JWT
            ? { 'Authorization': `Bearer ${PINATA_JWT}` }
            : {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            };

        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        const ipfsHash = response.data.IpfsHash;
        const ipfsUri = `ipfs://${ipfsHash}`;

        return ipfsUri;

    } catch (error) {
        console.error('❌ Image upload error:', error.message);
        throw error;
    }
}

/**
 * Get IPFS content via Pinata gateway
 * @param {string} ipfsUri - IPFS URI (ipfs://...)
 * @returns {string} Gateway URL
 */
export function getIPFSGatewayUrl(ipfsUri) {
    if (!ipfsUri) return '';

    const hash = ipfsUri.replace('ipfs://', '');
    return `${PINATA_GATEWAY}/${hash}`;
}

/**
 * Fetch metadata from IPFS
 * @param {string} ipfsUri - IPFS URI (ipfs://...)
 * @returns {Promise<Object>} Metadata object
 */
export async function fetchMetadataFromIPFS(ipfsUri) {
    try {
        const url = getIPFSGatewayUrl(ipfsUri);
        const response = await axios.get(url, {
            timeout: 10000
        });

        return response.data;

    } catch (error) {
        console.error('❌ Fetch metadata error:', error.message);
        throw error;
    }
}

/**
 * Test Pinata connection
 * @returns {Promise<boolean>} True if connected
 */
export async function testPinataConnection() {
    try {
        if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
            console.error('❌ Pinata credentials not configured');
            return false;
        }

        const headers = PINATA_JWT
            ? { 'Authorization': `Bearer ${PINATA_JWT}` }
            : {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            };

        const response = await axios.get(
            `${PINATA_API_URL}/data/testAuthentication`,
            { headers }
        );

        return true;

    } catch (error) {
        console.error('❌ Pinata connection failed:', error.message);
        return false;
    }
}

/**
 * Generate mock IPFS URI (fallback)
 * @param {Object} metadata - Metadata object
 * @returns {string} Mock IPFS URI
 */
function generateMockIPFSUri(metadata) {
    // Store metadata in localStorage for mock retrieval
    const mockCID = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    try {
        localStorage.setItem(`ipfs_${mockCID}`, JSON.stringify(metadata));
    } catch (err) {
        console.warn('⚠️ Could not store mock metadata:', err.message);
    }

    return `ipfs://${mockCID}`;
}

/**
 * Get mock metadata from localStorage
 * @param {string} ipfsUri - Mock IPFS URI
 * @returns {Object|null} Metadata object or null
 */
export function getMockMetadata(ipfsUri) {
    try {
        const hash = ipfsUri.replace('ipfs://', '');
        const stored = localStorage.getItem(`ipfs_${hash}`);

        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.warn('⚠️ Could not retrieve mock metadata:', err.message);
    }

    return null;
}

// Export configuration status
export const isPinataConfigured = () => {
    return !!(PINATA_JWT || (PINATA_API_KEY && PINATA_SECRET_KEY));
};

export default {
    uploadMetadataToIPFS,
    uploadImageToIPFS,
    getIPFSGatewayUrl,
    fetchMetadataFromIPFS,
    testPinataConnection,
    getMockMetadata,
    isPinataConfigured
};
