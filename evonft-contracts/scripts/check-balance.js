const { ethers } = require("hardhat");

/**
 * Script to check NFT contract balance
 */
async function main() {
    console.log("💰 Checking NFT Contract Balance\n");

    // Contract address
    const NFT_ADDRESS = process.env.NFT_CONTRACT || "0xe31d18Fb9925f677451845997f64806a88264b3D";

    console.log("📍 Contract Address:", NFT_ADDRESS);
    console.log("🔗 Explorer:", `https://amoy.polygonscan.com/address/${NFT_ADDRESS}\n`);

    // Get contract
    const nft = await ethers.getContractAt("EvolvableNFTExtended", NFT_ADDRESS);

    // Get owner
    const owner = await nft.owner();
    console.log("👑 Contract Owner:", owner);

    // Get balance
    const balance = await ethers.provider.getBalance(NFT_ADDRESS);
    const balanceInMatic = ethers.formatEther(balance);

    console.log("\n💰 Contract Balance:", balanceInMatic, "MATIC");

    // Estimate USD value (approximate)
    const maticPrice = 0.50; // Update this with current price
    const usdValue = parseFloat(balanceInMatic) * maticPrice;
    console.log("💵 Estimated Value: ~$" + usdValue.toFixed(2), "(at $" + maticPrice + "/MATIC)");

    // Get prices
    const [basicPrice, premiumPrice, legendaryPrice] = await nft.getFoodPrices();
    const trainPrice = await nft.getTrainPrice();

    console.log("\n📊 Fee Structure:");
    console.log("   🍖 Basic Food:", ethers.formatEther(basicPrice), "MATIC");
    console.log("   🥩 Premium Food:", ethers.formatEther(premiumPrice), "MATIC");
    console.log("   🍗 Legendary Food:", ethers.formatEther(legendaryPrice), "MATIC");
    console.log("   💪 Train:", ethers.formatEther(trainPrice), "MATIC");

    // Calculate how many feeds this represents
    const basicFeeds = parseFloat(balanceInMatic) / parseFloat(ethers.formatEther(basicPrice));
    const premiumFeeds = parseFloat(balanceInMatic) / parseFloat(ethers.formatEther(premiumPrice));
    const legendaryFeeds = parseFloat(balanceInMatic) / parseFloat(ethers.formatEther(legendaryPrice));
    const trains = parseFloat(balanceInMatic) / parseFloat(ethers.formatEther(trainPrice));

    console.log("\n📈 Activity Estimate:");
    console.log("   This balance represents approximately:");
    console.log("   - " + Math.floor(basicFeeds) + " Basic Feeds");
    console.log("   - " + Math.floor(premiumFeeds) + " Premium Feeds");
    console.log("   - " + Math.floor(legendaryFeeds) + " Legendary Feeds");
    console.log("   - " + Math.floor(trains) + " Training Sessions");

    // Get total supply
    try {
        const totalSupply = await nft.totalMinted();
        console.log("\n🎨 NFT Stats:");
        console.log("   Total Minted:", totalSupply.toString());

        if (totalSupply > 0) {
            const avgPerNFT = parseFloat(balanceInMatic) / Number(totalSupply);
            console.log("   Avg Revenue per NFT:", avgPerNFT.toFixed(4), "MATIC");
        }
    } catch (error) {
        // Ignore if function doesn't exist
    }

    console.log("\n💡 To withdraw:");
    console.log("   npx hardhat run scripts/withdraw-fees.js --network amoy");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
