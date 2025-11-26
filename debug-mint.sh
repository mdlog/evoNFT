#!/bin/bash

echo "🔍 DEBUG MINT ISSUE"
echo "===================="
echo ""

# Check if contract address is set
echo "1. Checking .env file..."
if [ -f "evonft-app/.env" ]; then
    echo "✅ .env file exists"
    echo "Contract addresses:"
    grep "VITE_NFT_CONTRACT\|VITE_CONTRACT_ADDRESS" evonft-app/.env
else
    echo "❌ .env file not found!"
fi

echo ""
echo "2. Checking contracts.js..."
grep "CONTRACT_ADDRESS" evonft-app/src/config/contracts.js | head -5

echo ""
echo "3. Checking useContract.js stats..."
grep -A 10 "useContractStats" evonft-app/src/hooks/useContract.js | head -15

echo ""
echo "4. Quick Fix Options:"
echo "   A. Restart frontend with cache clear:"
echo "      cd evonft-app && rm -rf node_modules/.vite && npm run dev"
echo ""
echo "   B. Test contract directly:"
echo "      Open: evonft-app/test-contract.html in browser"
echo ""
echo "   C. Check on PolygonScan:"
echo "      https://amoy.polygonscan.com/address/0xe31d18Fb9925f677451845997f64806a88264b3D#readContract"
echo ""

# Check if frontend is running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Frontend is running on port 5173"
    echo "   URL: http://localhost:5173"
else
    echo "❌ Frontend is NOT running"
    echo "   Start with: cd evonft-app && npm run dev"
fi

echo ""
echo "===================="
echo "🔍 Debug complete!"
