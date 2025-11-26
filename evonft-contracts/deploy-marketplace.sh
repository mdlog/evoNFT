#!/bin/bash

echo "🏪 Deploying NFT Marketplace..."
echo ""

npx hardhat run scripts/deploy-marketplace.js --network amoy

echo ""
echo "✅ Deployment script executed!"
