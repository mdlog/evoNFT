#!/bin/bash

echo "🚀 EvoNFT - Deploy All New Contracts"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

# Load environment variables
source .env

# Check private key
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

# Check balance
echo "📊 Checking wallet balance..."
npx hardhat run scripts/check-balance.js --network amoy
echo ""

# Confirm deployment
read -p "⚠️  This will deploy ALL NEW contracts. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Deploy all contracts
echo ""
echo "🚀 Starting deployment..."
npx hardhat run scripts/deploy-all-new.js --network amoy

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update evonft-app/.env with new contract addresses"
    echo "2. Verify contracts on PolygonScan"
    echo "3. Test minting on frontend"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
