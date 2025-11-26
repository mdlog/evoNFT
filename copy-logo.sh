#!/bin/bash

echo "📋 Copying logo to public folder..."

# Copy logo
cp /media/mdlog/mdlog/Project-MDlabs/polygon-nft/evoNFT-logo1.png evonft-app/public/logo.png

if [ $? -eq 0 ]; then
    echo "✅ Logo copied successfully!"
    echo "📍 Location: evonft-app/public/logo.png"
    
    # Also update favicon
    cp /media/mdlog/mdlog/Project-MDlabs/polygon-nft/evoNFT-logo1.png evonft-app/public/favicon.png
    
    echo "✅ Favicon updated!"
    echo ""
    echo "🔄 Restart frontend to see changes:"
    echo "   cd evonft-app"
    echo "   npm run dev"
else
    echo "❌ Failed to copy logo"
    exit 1
fi
