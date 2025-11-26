#!/bin/bash

echo "🧬 Breeding Contract Deployment Script"
echo "======================================"
echo ""

# Step 1: Compile
echo "📦 Step 1: Compiling contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"
echo ""

# Step 2: Deploy
echo "🚀 Step 2: Deploying to Polygon Amoy..."
npx hardhat run scripts/deploy-breeding.js --network amoy

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the VITE_BREEDING_CONTRACT address"
echo "2. Add it to evonft-app/.env"
echo "3. Grant minter role (see instructions above)"
echo "4. Restart frontend"
echo ""
