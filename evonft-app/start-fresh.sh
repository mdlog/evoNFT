#!/bin/bash

echo "🔄 Starting Fresh Frontend"
echo "=========================="
echo ""

# Kill existing process on port 3020
echo "🛑 Stopping existing server..."
lsof -ti:3020 | xargs kill -9 2>/dev/null
sleep 1

# Clear cache
echo "🗑️  Clearing cache..."
rm -rf node_modules/.vite .vite dist

echo ""
echo "✅ Ready to start!"
echo ""
echo "📋 Contract Addresses:"
echo "   NFT:         0x7c7e2a1a3E1A701d1E359347208c95f59E562887"
echo "   Staking:     0xc9015c8d8e094F6e5BFb8b23820A6dad97325700"
echo "   Breeding:    0x4B727035E06D1Ec9b169826f29d674853C69a35b"
echo "   Marketplace: 0x5C1a8D7c957bf8df218DE8C63D387D40901ae6d6"
echo ""
echo "🚀 Starting dev server..."
echo ""

npm run dev
