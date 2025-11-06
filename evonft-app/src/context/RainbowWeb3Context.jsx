import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { config, polygonAmoy, customTheme } from '../config/rainbowkit';
import { ethers } from 'ethers';

// Import RainbowKit CSS
import '@rainbow-me/rainbowkit/styles.css';

const Web3Context = createContext(null);

// Query client for React Query
const queryClient = new QueryClient();

// Inner component that uses wagmi hooks
function Web3ContextProvider({ children }) {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    // Get provider and signer
    const [signer, setSigner] = useState(null);
    const provider = useMemo(() => {
        if (!isConnected || !window.ethereum) {
            return null;
        }
        return new ethers.BrowserProvider(window.ethereum);
    }, [isConnected]);

    // Get signer asynchronously
    useEffect(() => {
        async function getSigner() {
            if (provider && isConnected) {
                try {
                    const signerInstance = await provider.getSigner();
                    setSigner(signerInstance);
                } catch (error) {
                    console.error('Error getting signer:', error);
                    setSigner(null);
                }
            } else {
                setSigner(null);
            }
        }
        getSigner();
    }, [provider, isConnected]);

    // Check if on correct network
    const isCorrectNetwork = chainId === polygonAmoy.id;

    // Switch to Polygon Amoy
    const switchToAmoy = async () => {
        try {
            await switchChain({ chainId: polygonAmoy.id });
        } catch (error) {
            console.error('Error switching network:', error);
            throw error;
        }
    };

    const value = {
        account: address,
        isConnected,
        disconnect,
        provider,
        signer,
        chainId,
        isCorrectNetwork,
        switchToAmoy,
        // Legacy compatibility
        connectWallet: () => { }, // RainbowKit handles this via ConnectButton
        disconnectWallet: disconnect,
        isConnecting: false
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
}

// Main provider wrapper
export function RainbowWeb3Provider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={customTheme}>
                    <Web3ContextProvider>
                        {children}
                    </Web3ContextProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

// Hook to use Web3 context
export function useWeb3() {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within RainbowWeb3Provider');
    }
    return context;
}
