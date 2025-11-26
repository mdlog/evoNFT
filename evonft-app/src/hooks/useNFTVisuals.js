import { useState, useEffect, useMemo } from 'react'
import { generateNFTMetadata, getRandomCreatureType } from '../assets/nft-visuals'

// Hook untuk mengelola visual NFT
export function useNFTVisuals(nfts = []) {
    const [visualNFTs, setVisualNFTs] = useState([])
    const [loading, setLoading] = useState(false)

    // Generate visual data untuk NFTs yang belum memiliki visual
    useEffect(() => {
        if (nfts.length === 0) {
            setVisualNFTs([])
            return
        }

        setLoading(true)

        const processNFTs = () => {
            const processed = nfts.map(nft => {
                const tokenId = nft.id || nft.tokenId
                const level = nft.level || 1

                // Check if image is placeholder or missing
                const isPlaceholder = !nft.image ||
                    nft.image.includes('placeholder') ||
                    nft.image.includes('via.placeholder.com');

                // If has valid SVG image and not placeholder, use existing
                if (nft.image && nft.image.startsWith('data:image/svg') && !isPlaceholder) {
                    return nft;
                }

                // Tentukan rarity berdasarkan level atau random
                let rarity = nft.rarity

                // Normalize rarity to valid values
                const validRarities = ['common', 'rare', 'epic', 'legendary']
                if (!rarity || !validRarities.includes(rarity)) {
                    // Map old rarity names
                    const rarityMap = {
                        'uncommon': 'rare',
                        'normal': 'common',
                        'mythic': 'legendary',
                        'mythical': 'legendary'
                    }
                    rarity = rarityMap[rarity] || null
                }

                // If still no valid rarity, determine by level
                if (!rarity) {
                    if (level >= 8) rarity = 'legendary'
                    else if (level >= 6) rarity = 'epic'
                    else if (level >= 3) rarity = 'rare'
                    else rarity = 'common'
                }

                // Generate creature type jika belum ada
                const creatureType = nft.creatureType || getRandomCreatureType(rarity)

                // Generate complete metadata with SVG image
                const visualData = generateNFTMetadata(tokenId, {
                    level,
                    rarity,
                    creatureType,
                    name: nft.name || `EvoNFT #${tokenId}`,
                    description: nft.description
                })

                console.log(`🎨 Generated visual for NFT #${tokenId}:`, {
                    creatureType,
                    rarity,
                    hasImage: !!visualData.image,
                    imageType: visualData.image?.substring(0, 30) + '...'
                });

                return {
                    ...nft,
                    ...visualData,
                    // Preserve original data
                    originalName: nft.name,
                    originalDescription: nft.description
                }
            })

            setVisualNFTs(processed)
            setLoading(false)
        }

        processNFTs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(nfts.map(n => ({ id: n.id || n.tokenId, level: n.level, rarity: n.rarity })))])

    return {
        visualNFTs,
        loading,
        refreshVisuals: () => {
            setLoading(true)
            // Force regenerate visuals
            setVisualNFTs([])
        }
    }
}

// Hook untuk single NFT visual
export function useNFTVisual(nft) {
    const visualData = useMemo(() => {
        if (!nft) return null

        const tokenId = nft.id || nft.tokenId
        const level = nft.level || 1

        // Determine rarity if not provided
        let rarity = nft.rarity

        // Normalize rarity to valid values
        const validRarities = ['common', 'rare', 'epic', 'legendary']
        if (!rarity || !validRarities.includes(rarity)) {
            // Map old rarity names
            const rarityMap = {
                'uncommon': 'rare',
                'normal': 'common',
                'mythic': 'legendary',
                'mythical': 'legendary'
            }
            rarity = rarityMap[rarity] || null
        }

        // If still no valid rarity, determine by level
        if (!rarity) {
            if (level >= 8) rarity = 'legendary'
            else if (level >= 6) rarity = 'epic'
            else if (level >= 3) rarity = 'rare'
            else rarity = 'common'
        }

        const creatureType = nft.creatureType || getRandomCreatureType(rarity)

        return generateNFTMetadata(tokenId, {
            level,
            rarity,
            creatureType,
            name: nft.name || `EvoNFT #${tokenId}`,
            description: nft.description
        })
    }, [nft])

    return visualData
}

// Hook untuk filter dan sort NFTs berdasarkan visual properties
export function useNFTFilters(nfts = []) {
    const [filters, setFilters] = useState({
        rarity: 'all',
        creatureType: 'all',
        levelRange: [1, 10],
        sortBy: 'tokenId',
        sortOrder: 'asc'
    })

    const filteredNFTs = useMemo(() => {
        let filtered = [...nfts]

        // Filter by rarity
        if (filters.rarity !== 'all') {
            filtered = filtered.filter(nft => nft.rarity === filters.rarity)
        }

        // Filter by creature type
        if (filters.creatureType !== 'all') {
            filtered = filtered.filter(nft => nft.creatureType === filters.creatureType)
        }

        // Filter by level range
        filtered = filtered.filter(nft => {
            const level = nft.level || 1
            return level >= filters.levelRange[0] && level <= filters.levelRange[1]
        })

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue

            switch (filters.sortBy) {
                case 'level':
                    aValue = a.level || 1
                    bValue = b.level || 1
                    break
                case 'rarity':
                    const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }
                    aValue = rarityOrder[a.rarity] || 1
                    bValue = rarityOrder[b.rarity] || 1
                    break
                case 'name':
                    aValue = a.name || ''
                    bValue = b.name || ''
                    break
                default:
                    aValue = a.id || a.tokenId || 0
                    bValue = b.id || b.tokenId || 0
            }

            if (filters.sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1
            }
            return aValue > bValue ? 1 : -1
        })

        return filtered
    }, [nfts, filters])

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const resetFilters = () => {
        setFilters({
            rarity: 'all',
            creatureType: 'all',
            levelRange: [1, 10],
            sortBy: 'tokenId',
            sortOrder: 'asc'
        })
    }

    return {
        filters,
        filteredNFTs,
        updateFilter,
        resetFilters,
        totalCount: nfts.length,
        filteredCount: filteredNFTs.length
    }
}

// Hook untuk NFT evolution preview
export function useEvolutionPreview(nft, targetLevel) {
    const evolutionPreview = useMemo(() => {
        if (!nft || !targetLevel) return null

        const currentLevel = nft.level || 1
        if (targetLevel <= currentLevel) return null

        // Calculate new rarity based on target level
        let newRarity = nft.rarity
        if (targetLevel >= 8 && newRarity !== 'legendary') {
            newRarity = 'legendary'
        } else if (targetLevel >= 6 && newRarity === 'common') {
            newRarity = 'epic'
        } else if (targetLevel >= 3 && newRarity === 'common') {
            newRarity = 'rare'
        }

        return generateNFTMetadata(nft.id || nft.tokenId, {
            level: targetLevel,
            rarity: newRarity,
            creatureType: nft.creatureType,
            name: nft.name,
            description: nft.description
        })
    }, [nft, targetLevel])

    return evolutionPreview
}

// Hook untuk generate mock NFTs untuk testing
export function useMockNFTs(count = 10) {
    const [mockNFTs, setMockNFTs] = useState([])

    useEffect(() => {
        const nfts = Array.from({ length: count }, (_, i) => {
            const tokenId = i + 1
            return generateNFTMetadata(tokenId)
        })
        setMockNFTs(nfts)
    }, [count])

    return mockNFTs
}