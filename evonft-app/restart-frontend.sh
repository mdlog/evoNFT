#!/bin/bash

echo "🔄 Restarting Frontend with New Contracts"
echo "=========================================="
echo ""

# Clear Vite cache
echo "🗑️  Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite

# Clear dist
echo "🗑️  Clearing dist..."
rm -rf dist

echo ""
echo "✅ Cache cleared!"
echo ""
echo "📋 New Contract Addresses:"
echo "   NFT:         0x7c7e2a1a3E1A701d1E359347208c95f59E562887"
echo "   Staking:     0xc9015c8d8e094F6e5BFb8b23820A6dad97325700"
echo "   Breeding:    0x4B727035E06D1Ec9b169826f29d674853C69a35b"
echo "   Marketplace: 0x5C1a8D7c957bf8df218DE8C63D387D40901ae6d6"
echo ""
echo "🚀 Starting dev server..."
echo ""

npm run dev
