import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Mint from './pages/Mint'
import Marketplace from './pages/Marketplace'
import MyCollection from './pages/MyCollection'
import NFTDetail from './pages/NFTDetail'
import BreedingLab from './pages/BreedingLab'
import Staking from './pages/Staking'
import Profile from './pages/Profile'

function App() {
    return (
        <Web3Provider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
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
        </Web3Provider>
    )
}

export default App
