#!/bin/bash

echo "🌈 Migrating to RainbowKit..."
echo ""

# Backup App.jsx
echo "📦 Creating backup..."
cp evonft-app/src/App.jsx evonft-app/src/App.jsx.backup

# Update App.jsx
echo "🔄 Updating App.jsx..."
sed -i "s/import { Web3Provider } from '.\/context\/Web3Context'/import { RainbowWeb3Provider } from '.\/context\/RainbowWeb3Context'/g" evonft-app/src/App.jsx
sed -i "s/import Navbar from '.\/components\/Navbar'/import NavbarRainbow from '.\/components\/NavbarRainbow'/g" evonft-app/src/App.jsx
sed -i "s/<Web3Provider>/<RainbowWeb3Provider>/g" evonft-app/src/App.jsx
sed -i "s/<\/Web3Provider>/<\/RainbowWeb3Provider>/g" evonft-app/src/App.jsx
sed -i "s/<Navbar \/>/<NavbarRainbow \/>/g" evonft-app/src/App.jsx

echo "✅ Migration complete!"
echo ""
echo "⚠️  IMPORTANT: Update WalletConnect Project ID in:"
echo "   evonft-app/src/config/rainbowkit.js"
echo ""
echo "📝 See RAINBOWKIT_MIGRATION.md for full instructions"
echo ""
echo "🔙 Backup saved to: evonft-app/src/App.jsx.backup"
