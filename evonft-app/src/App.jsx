import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RainbowWeb3Provider } from './context/RainbowWeb3Context'
import NavbarRainbow from './components/NavbarRainbow'
import Footer from './components/Footer'
import Home from './pages/Home'
import Mint from './pages/Mint'
import Marketplace from './pages/Marketplace'
import MyCollection from './pages/MyCollectionIntegrated'
import NFTDetail from './pages/NFTDetailIntegrated'
import BreedingLab from './pages/BreedingLabIntegrated'
import Staking from './pages/StakingIntegrated'
import Profile from './pages/Profile'

function App() {
    return (
        <RainbowWeb3Provider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <NavbarRainbow />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/mint" element={<Mint />} />
                            <Route path="/explore" element={<Marketplace />} />
                            <Route path="/my-nfts" element={<MyCollection />} />
                            <Route path="/nft/:id" element={<NFTDetail />} />
                            <Route path="/breeding" element={<BreedingLab />} />
                            <Route path="/staking" element={<Staking />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>                    </main>
                    <Footer />
                </div>
            </Router>
        </RainbowWeb3Provider>
    )
}

export default App
