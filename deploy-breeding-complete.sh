#!/bin/bash

echo "🧬 ============================================"
echo "   BREEDING CONTRACT DEPLOYMENT"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Compile
echo "📦 Step 1: Compiling contracts..."
cd evonft-contracts
npx hardhat compile

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Compilation failed!${NC}"
    echo "Please fix compilation errors and try again."
    exit 1
fi

echo -e "${GREEN}✅ Compilation successful!${NC}"
echo ""

# Step 2: Deploy
echo "🚀 Step 2: Deploying to Polygon Amoy..."
echo "This will take about 30 seconds..."
echo ""

npx hardhat run scripts/deploy-breeding.js --network amoy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Please check your .env file and network connection."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""

# Get deployed address from deployment file
if [ -f "deployments/breeding-amoy.json" ]; then
    BREEDING_ADDRESS=$(grep -o '"breedingContract": "[^"]*' deployments/breeding-amoy.json | cut -d'"' -f4)
    echo -e "${YELLOW}📍 Breeding Contract Address: ${BREEDING_ADDRESS}${NC}"
    echo ""
fi

# Step 3: Instructions
echo "============================================"
echo "📋 NEXT STEPS:"
echo "============================================"
echo ""
echo "1️⃣  Grant Minter Role:"
echo "   Run: npx hardhat console --network amoy"
echo ""
echo "   Then in console:"
echo "   const nft = await ethers.getContractAt('EvolvableNFTExtended', '0xe31d18Fb9925f677451845997f64806a88264b3D')"
echo "   const breedingAddress = '${BREEDING_ADDRESS}'"
echo "   const MINTER_ROLE = await nft.MINTER_ROLE()"
echo "   await nft.grantRole(MINTER_ROLE, breedingAddress)"
echo "   console.log('✅ Done!')"
echo ""
echo "2️⃣  Update Frontend .env:"
echo "   cd ../evonft-app"
echo "   echo 'VITE_BREEDING_CONTRACT=${BREEDING_ADDRESS}' >> .env"
echo ""
echo "3️⃣  Restart Frontend:"
echo "   rm -rf node_modules/.vite"
echo "   npm run dev"
echo ""
echo "4️⃣  Test Breeding:"
echo "   Go to: http://localhost:5173/breeding"
echo ""
echo "============================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "============================================"
