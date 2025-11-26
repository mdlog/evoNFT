import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext()

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)

    // Initialize provider on mount
    useEffect(() => {
        const initProvider = async () => {
            console.log('🔧 Initializing provider...')

            if (window.ethereum) {
                // Use MetaMask provider
                try {
                    const browserProvider = new ethers.BrowserProvider(window.ethereum)
                    const accounts = await browserProvider.send('eth_accounts', [])

                    if (accounts.length > 0) {
                        // Already connected
                        const signer = await browserProvider.getSigner()
                        setProvider(browserProvider)
                        setSigner(signer)
                        setAccount(accounts[0])
                        console.log('✅ Restored existing connection:', accounts[0])
                    } else {
                        // Not connected yet, but set provider for read-only
                        setProvider(browserProvider)
                        console.log('✅ MetaMask provider initialized (not connected)')
                    }
                } catch (error) {
                    console.error('Error initializing MetaMask provider:', error)
                    // Fallback to default RPC
                    const defaultProvider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology')
                    setProvider(defaultProvider)
                    console.log('✅ Fallback to default RPC provider')
                }
            } else {
                // No MetaMask, use default RPC
                const defaultProvider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology')
                setProvider(defaultProvider)
                console.log('✅ Default RPC provider initialized (no MetaMask)')
            }
        }

        initProvider()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        console.log('🔌 Connecting wallet...')

        if (!window.ethereum) {
            alert('Please install MetaMask!')
            return
        }

        try {
            setIsConnecting(true)
            const browserProvider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await browserProvider.send('eth_requestAccounts', [])
            const signer = await browserProvider.getSigner()

            console.log('📝 Setting provider, signer, and account...')
            setProvider(browserProvider)
            setSigner(signer)
            setAccount(accounts[0])

            console.log('✅ Wallet connected successfully!')
            console.log('   Account:', accounts[0])
            console.log('   Provider:', browserProvider)
            console.log('   Signer:', signer)
        } catch (error) {
            console.error('❌ Error connecting wallet:', error)
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnectWallet = () => {
        setAccount(null)
        setProvider(null)
        setSigner(null)
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0])
                } else {
                    disconnectWallet()
                }
            })

            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
        }
    }, [])

    // Debug: Log state changes
    useEffect(() => {
        console.log('🔄 Web3 State Updated:')
        console.log('   Account:', account)
        console.log('   Provider:', provider ? 'Available' : 'Not available')
        console.log('   Signer:', signer ? 'Available' : 'Not available')

        // Check network if provider available
        if (provider) {
            provider.getNetwork().then(network => {
                console.log('   Network:', network.name, '(Chain ID:', network.chainId.toString(), ')')
                if (network.chainId !== 80002n) {
                    console.warn('   ⚠️ WARNING: Not on Polygon Amoy! Expected Chain ID: 80002')
                }
            }).catch(err => {
                console.error('   ❌ Could not get network:', err)
            })
        }
    }, [account, provider, signer])

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            signer,
            isConnecting,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </Web3Context.Provider>
    )
}
