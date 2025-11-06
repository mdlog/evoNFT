// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev Marketplace for buying and selling EvoNFTs
 */
contract NFTMarketplace is Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    IERC721 public nftContract;
    
    struct Listing {
        address seller;
        uint256 price;
        uint256 listedAt;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    uint256 public marketplaceFee = 250; // 2.5% (in basis points)
    uint256 public totalListings;
    uint256 public totalSales;
    uint256 public totalVolume;
    
    // ============ Events ============
    
    event Listed(
        uint256 indexed tokenId, 
        address indexed seller, 
        uint256 price, 
        uint256 timestamp
    );
    
    event Sold(
        uint256 indexed tokenId, 
        address indexed buyer, 
        address indexed seller, 
        uint256 price,
        uint256 timestamp
    );
    
    event Cancelled(
        uint256 indexed tokenId, 
        address indexed seller,
        uint256 timestamp
    );
    
    event PriceUpdated(
        uint256 indexed tokenId, 
        uint256 oldPrice,
        uint256 newPrice,
        uint256 timestamp
    );
    
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ============ Constructor ============
    
    constructor(address _nftContract) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_nftContract);
    }
    
    // ============ Listing Functions ============
    
    /**
     * @notice List NFT for sale
     * @param tokenId Token to list
     * @param price Sale price in wei
     */
    function listForSale(uint256 tokenId, uint256 price) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(
            nftContract.getApproved(tokenId) == address(this) || 
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        require(!listings[tokenId].active, "Already listed");
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            listedAt: block.timestamp,
            active: true
        });
        
        totalListings++;
        
        emit Listed(tokenId, msg.sender, price, block.timestamp);
    }
    
    /**
     * @notice Buy listed NFT
     * @param tokenId Token to buy
     */
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        
        require(listing.active, "NFT not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Mark as sold before transfers (reentrancy protection)
        listings[tokenId].active = false;
        
        // Transfer NFT to buyer
        nftContract.transferFrom(listing.seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Update stats
        totalSales++;
        totalVolume += listing.price;
        
        emit Sold(tokenId, msg.sender, listing.seller, listing.price, block.timestamp);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
    }
    
    /**
     * @notice Cancel listing
     * @param tokenId Token to cancel
     */
    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not seller");
        
        listings[tokenId].active = false;
        
        emit Cancelled(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Update listing price
     * @param tokenId Token to update
     * @param newPrice New price
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        Listing storage listing = listings[tokenId];
        
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not seller");
        require(newPrice > 0, "Price must be greater than 0");
        
        uint256 oldPrice = listing.price;
        listing.price = newPrice;
        
        emit PriceUpdated(tokenId, oldPrice, newPrice, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get listing info
     */
    function getListing(uint256 tokenId) 
        external 
        view 
        returns (
            address seller,
            uint256 price,
            uint256 listedAt,
            bool active
        ) 
    {
        Listing memory listing = listings[tokenId];
        return (
            listing.seller,
            listing.price,
            listing.listedAt,
            listing.active
        );
    }
    
    /**
     * @notice Check if token is listed
     */
    function isListed(uint256 tokenId) external view returns (bool) {
        return listings[tokenId].active;
    }
    
    /**
     * @notice Get marketplace stats
     */
    function getMarketplaceStats() 
        external 
        view 
        returns (
            uint256 _totalListings,
            uint256 _totalSales,
            uint256 _totalVolume,
            uint256 _marketplaceFee
        ) 
    {
        return (totalListings, totalSales, totalVolume, marketplaceFee);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update marketplace fee
     * @param newFee New fee in basis points (e.g., 250 = 2.5%)
     */
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        
        emit MarketplaceFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @notice Withdraw accumulated fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @notice Emergency cancel listing (owner only)
     */
    function emergencyCancelListing(uint256 tokenId) external onlyOwner {
        require(listings[tokenId].active, "Not listed");
        
        listings[tokenId].active = false;
        
        emit Cancelled(tokenId, listings[tokenId].seller, block.timestamp);
    }
    
    // ============ Receive MATIC ============
    
    receive() external payable {}
}
