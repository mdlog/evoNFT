#!/bin/bash

echo "🔧 Installing Hardhat Dependencies..."
echo "======================================"

# Install dependencies one by one to avoid network issues
npm install --save-dev @nomicfoundation/hardhat-chai-matchers@^2.0.0
npm install --save-dev @nomicfoundation/hardhat-ethers@^3.0.0
npm install --save-dev @nomicfoundation/hardhat-network-helpers@^1.0.0
npm install --save-dev @nomicfoundation/hardhat-verify@^2.0.0
npm install --save-dev @typechain/ethers-v6@^0.5.0
npm install --save-dev @typechain/hardhat@^9.0.0
npm install --save-dev @types/chai@^4.2.0
npm install --save-dev @types/mocha@^9.1.0
npm install --save-dev @types/node@^16.0.0
npm install --save-dev chai@^4.2.0
npm install --save-dev ethers@^6.4.0
npm install --save-dev hardhat-gas-reporter@^1.0.8
npm install --save-dev solidity-coverage@^0.8.1
npm install --save-dev ts-node@^8.0.0
npm install --save-dev typechain@^8.3.0
npm install --save-dev typescript@^4.5.0

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Run: npx hardhat compile"
echo "2. Run: npx hardhat run scripts/deployAll.js --network amoy"
