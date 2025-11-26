#!/bin/bash

echo "⚡ Quick Evolution Setup"
echo "======================="
echo ""
echo "This will configure evolution for FAST testing:"
echo "- Cooldown: 5 minutes (instead of 24 hours)"
echo "- AI Generation: ~10 seconds (optimized)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "1️⃣  Setting cooldown to 5 minutes..."
cd evonft-contracts
npx hardhat run ../scripts/set-cooldown.js --network amoy 2

echo ""
echo "2️⃣  Restarting backend with optimized settings..."
cd ..
pkill -f "node src/index.js"
sleep 2
cd evonft-ai-engine
node src/index.js > /tmp/ai-backend.log 2>&1 &
sleep 3

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📊 Current Configuration:"
echo "   Cooldown: 5 minutes"
echo "   AI Generation: ~10 seconds"
echo "   Total Evolution Time: ~10-15 seconds"
echo ""
echo "🚀 Ready to test evolution!"
echo ""
echo "Next steps:"
echo "1. Go to https://evonft.xyz"
echo "2. View NFT details"
echo "3. Wait 5 minutes after last evolution"
echo "4. Click 'Evolve Now'"
echo "5. Watch it evolve in ~10 seconds! 🎉"
