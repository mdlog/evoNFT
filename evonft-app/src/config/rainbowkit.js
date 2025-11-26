import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy, polygon } from 'wagmi/chains';

// RainbowKit Configuration
export const config = getDefaultConfig({
    appName: 'EvoNFT',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
    chains: [polygonAmoy, polygon],
    ssr: false,
});

// Custom theme matching EvoNFT design
export const customTheme = {
    blurs: {
        modalOverlay: 'blur(8px)',
    },
    colors: {
        accentColor: '#8B5CF6', // primary-500
        accentColorForeground: 'white',
        actionButtonBorder: 'rgba(139, 92, 246, 0.3)',
        actionButtonBorderMobile: 'rgba(139, 92, 246, 0.3)',
        actionButtonSecondaryBackground: 'rgba(139, 92, 246, 0.1)',
        closeButton: 'rgba(148, 163, 184, 0.5)',
        closeButtonBackground: 'rgba(30, 41, 59, 0.8)',
        connectButtonBackground: 'linear-gradient(to right, #8B5CF6, #EC4899)',
        connectButtonBackgroundError: '#EF4444',
        connectButtonInnerBackground: 'rgba(30, 41, 59, 0.8)',
        connectButtonText: 'white',
        connectButtonTextError: 'white',
        connectionIndicator: '#10B981',
        downloadBottomCardBackground: 'rgba(30, 41, 59, 0.9)',
        downloadTopCardBackground: 'rgba(30, 41, 59, 0.9)',
        error: '#EF4444',
        generalBorder: 'rgba(71, 85, 105, 0.5)',
        generalBorderDim: 'rgba(71, 85, 105, 0.3)',
        menuItemBackground: 'rgba(51, 65, 85, 0.5)',
        modalBackdrop: 'rgba(0, 0, 0, 0.8)',
        modalBackground: 'rgba(15, 23, 42, 0.95)',
        modalBorder: 'rgba(71, 85, 105, 0.5)',
        modalText: 'white',
        modalTextDim: 'rgba(148, 163, 184, 1)',
        modalTextSecondary: 'rgba(148, 163, 184, 0.8)',
        profileAction: 'rgba(51, 65, 85, 0.8)',
        profileActionHover: 'rgba(71, 85, 105, 0.8)',
        profileForeground: 'rgba(30, 41, 59, 0.9)',
        selectedOptionBorder: 'rgba(139, 92, 246, 0.5)',
        standby: 'rgba(236, 72, 153, 1)',
    },
    fonts: {
        body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    radii: {
        actionButton: '12px',
        connectButton: '12px',
        menuButton: '12px',
        modal: '16px',
        modalMobile: '16px',
    },
    shadows: {
        connectButton: '0 4px 12px rgba(139, 92, 246, 0.3)',
        dialog: '0 20px 60px rgba(0, 0, 0, 0.5)',
        profileDetailsAction: '0 2px 8px rgba(0, 0, 0, 0.2)',
        selectedOption: '0 0 0 2px rgba(139, 92, 246, 0.5)',
        selectedWallet: '0 0 0 2px rgba(139, 92, 246, 0.5)',
        walletLogo: '0 2px 8px rgba(0, 0, 0, 0.2)',
    },
};

// Export chains for easy access
export { polygonAmoy, polygon };
