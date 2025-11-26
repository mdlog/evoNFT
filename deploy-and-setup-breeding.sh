#!/bin/bash

echo "🧬 ============================================"
echo "   BREEDING CONTRACT - FULL SETUP"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to contracts directory
cd evonft-contracts

# Step 1: Compile
echo -e "${BLUE}📦 Step 1/4: Compiling contracts...${NC}"
npx hardhat compile

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Compilation failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Compiled successfully!${NC}"
echo ""

# Step 2: Deploy
echo -e "${BLUE}🚀 Step 2/4: Deploying to Polygon Amoy...${NC}"
npx hardhat run scripts/deploy-breeding.js --network amoy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployed successfully!${NC}"
echo ""

# Get deployed address
if [ -f "deployments/breeding-amoy.json" ]; then
    BREEDING_ADDRESS=$(grep -o '"breedingContract": "[^"]*' deployments/breeding-amoy.json | cut -d'"' -f4)
    echo -e "${YELLOW}📍 Breeding Contract: ${BREEDING_ADDRESS}${NC}"
    echo ""
fi

# Step 3: Grant Minter Role
echo -e "${BLUE}🔑 Step 3/4: Granting minter role...${NC}"
npx hardhat run scripts/grant-minter-role.js --network amoy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Grant role failed!${NC}"
    echo "You can grant manually with:"
    echo "npx hardhat console --network amoy"
    exit 1
fi
echo -e "${GREEN}✅ Minter role granted!${NC}"
echo ""

# Step 4: Update Frontend
echo -e "${BLUE}📝 Step 4/4: Updating frontend...${NC}"
cd ../evonft-app

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found in evonft-app!${NC}"
    exit 1
fi

# Check if VITE_BREEDING_CONTRACT already exists
if grep -q "VITE_BREEDING_CONTRACT" .env; then
    echo -e "${YELLOW}⚠️  VITE_BREEDING_CONTRACT already exists in .env${NC}"
    echo "Please update it manually to: ${BREEDING_ADDRESS}"
else
    echo "VITE_BREEDING_CONTRACT=${BREEDING_ADDRESS}" >> .env
    echo -e "${GREEN}✅ Added VITE_BREEDING_CONTRACT to .env${NC}"
fi

echo ""
echo "============================================"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "============================================"
echo ""
echo "📋 Summary:"
echo "  ✅ Contract compiled"
echo "  ✅ Contract deployed to: ${BREEDING_ADDRESS}"
echo "  ✅ Minter role granted"
echo "  ✅ Frontend .env updated"
echo ""
echo "🚀 Next Steps:"
echo "  1. Restart frontend:"
echo "     cd evonft-app"
echo "     rm -rf node_modules/.vite"
echo "     npm run dev"
echo ""
echo "  2. Test breeding:"
echo "     http://localhost:5173/breeding"
echo ""
echo "============================================"
