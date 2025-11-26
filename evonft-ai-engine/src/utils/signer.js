import { ethers } from 'ethers';

/**
 * Sign evolution request using EIP-712
 */
export async function signEvolveRequest(
    wallet,
    contractAddress,
    tokenId,
    newURI,
    nonce,
    deadline
) {
    // EIP-712 Domain
    const domain = {
        name: 'EvoNFT',
        version: '1',
        chainId: await wallet.provider.getNetwork().then(n => n.chainId),
        verifyingContract: contractAddress
    };

    // EIP-712 Types
    const types = {
        EvolveRequest: [
            { name: 'tokenId', type: 'uint256' },
            { name: 'newURI', type: 'string' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ]
    };

    // Values
    const value = {
        tokenId: tokenId,
        newURI: newURI,
        nonce: nonce,
        deadline: deadline
    };

    // Sign
    const signature = await wallet.signTypedData(domain, types, value);

    return signature;
}

/**
 * Verify signature (for testing)
 */
export function verifyEvolveSignature(
    signature,
    contractAddress,
    chainId,
    tokenId,
    newURI,
    nonce,
    deadline
) {
    const domain = {
        name: 'EvoNFT',
        version: '1',
        chainId: chainId,
        verifyingContract: contractAddress
    };

    const types = {
        EvolveRequest: [
            { name: 'tokenId', type: 'uint256' },
            { name: 'newURI', type: 'string' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ]
    };

    const value = {
        tokenId: tokenId,
        newURI: newURI,
        nonce: nonce,
        deadline: deadline
    };

    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);

    return recoveredAddress;
}
