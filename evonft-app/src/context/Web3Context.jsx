import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext()

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!')
            return
        }

        try {
            setIsConnecting(true)
            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.send('eth_requestAccounts', [])
            const signer = await provider.getSigner()

            setProvider(provider)
            setSigner(signer)
            setAccount(accounts[0])
        } catch (error) {
            console.error('Error connecting wallet:', error)
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
