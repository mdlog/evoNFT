// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EvolvableNFT.sol";

/**
 * @title EvolvableNFTExtended
 * @dev Extended version with Feed and Train functions
 */
contract EvolvableNFTExtended is EvolvableNFT {
    
    // ============ Additional State Variables ============
    
    /// @notice XP for each token
    mapping(uint256 => uint256) public tokenXP;
    
    /// @notice Stats for each token (strength, intelligence, speed, endurance, luck)
    mapping(uint256 => mapping(uint8 => uint8)) public tokenStats;
    
    /// @notice Food prices
    uint256 public constant BASIC_FOOD_PRICE = 0.1 ether;
    uint256 public constant PREMIUM_FOOD_PRICE = 0.5 ether;
    uint256 public constant LEGENDARY_FOOD_PRICE = 1.0 ether;
    
    /// @notice Training price
    uint256 public constant TRAIN_PRICE = 0.3 ether;
    
    /// @notice XP rewards
    uint256 public constant BASIC_FOOD_XP = 50;
    uint256 public constant PREMIUM_FOOD_XP = 200;
    uint256 public constant LEGENDARY_FOOD_XP = 500;
    uint256 public constant TRAIN_XP = 100;
    
    /// @notice Stat types
    uint8 public constant STAT_STRENGTH = 0;
    uint8 public constant STAT_INTELLIGENCE = 1;
    uint8 public constant STAT_SPEED = 2;
    uint8 public constant STAT_ENDURANCE = 3;
    uint8 public constant STAT_LUCK = 4;
    
    // ============ Events ============
    
    event Fed(uint256 indexed tokenId, uint8 foodType, uint256 xpGained, uint256 totalXP);
    event Trained(uint256 indexed tokenId, uint8 statType, uint8 newValue, uint256 xpGained);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel, uint256 totalXP);
    
    // ============ Constructor ============
    
    constructor(
        string memory name,
        string memory symbol,
        address _aiSigner
    ) EvolvableNFT(name, symbol, _aiSigner) {}
    
    // ============ Feed Functions ============
    
    /**
     * @notice Feed NFT to gain XP
     * @param tokenId Token to feed
     * @param foodType 0=Basic, 1=Premium, 2=Legendary
     */
    function feed(uint256 tokenId, uint8 foodType) external payable {
        require(_ownerOf(tokenId) == msg.sender, "Not token owner");
        require(foodType <= 2, "Invalid food type");
        
        uint256 price;
        uint256 xpGain;
        
        if (foodType == 0) {
            price = BASIC_FOOD_PRICE;
            xpGain = BASIC_FOOD_XP;
        } else if (foodType == 1) {
            price = PREMIUM_FOOD_PRICE;
            xpGain = PREMIUM_FOOD_XP;
        } else {
            price = LEGENDARY_FOOD_PRICE;
            xpGain = LEGENDARY_FOOD_XP;
        }
        
        require(msg.value >= price, "Insufficient payment");
        
        // Add XP
        tokenXP[tokenId] += xpGain;
        
        emit Fed(tokenId, foodType, xpGain, tokenXP[tokenId]);
        
        // Check for level up
        _checkLevelUp(tokenId);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    // ============ Train Functions ============
    
    /**
     * @notice Train NFT to increase stats
     * @param tokenId Token to train
     * @param statType Stat to train (0-4)
     */
    function train(uint256 tokenId, uint8 statType) external payable {
        require(_ownerOf(tokenId) == msg.sender, "Not token owner");
        require(statType <= 4, "Invalid stat type");
        require(msg.value >= TRAIN_PRICE, "Insufficient payment");
        require(tokenStats[tokenId][statType] < 100, "Stat already maxed");
        
        // Increase stat
        tokenStats[tokenId][statType] += 1;
        
        // Add XP
        tokenXP[tokenId] += TRAIN_XP;
        
        emit Trained(tokenId, statType, tokenStats[tokenId][statType], TRAIN_XP);
        
        // Check for level up
        _checkLevelUp(tokenId);
        
        // Refund excess payment
        if (msg.value > TRAIN_PRICE) {
            payable(msg.sender).transfer(msg.value - TRAIN_PRICE);
        }
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Check and process level up
     */
    function _checkLevelUp(uint256 tokenId) internal {
        uint256 currentLevel = version[tokenId];
        uint256 xpForNextLevel = _getXPForLevel(currentLevel + 1);
        
        if (tokenXP[tokenId] >= xpForNextLevel) {
            version[tokenId]++;
            emit LevelUp(tokenId, version[tokenId], tokenXP[tokenId]);
        }
    }
    
    /**
     * @notice Calculate XP required for level
     */
    function _getXPForLevel(uint256 level) internal pure returns (uint256) {
        // XP = level * 1000
        return level * 1000;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get token stats
     */
    function getTokenStats(uint256 tokenId) 
        external 
        view 
        returns (uint8[5] memory stats) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        for (uint8 i = 0; i < 5; i++) {
            stats[i] = tokenStats[tokenId][i];
        }
    }
    
    /**
     * @notice Get token XP and level info
     */
    function getTokenProgress(uint256 tokenId)
        external
        view
        returns (
            uint256 currentXP,
            uint256 currentLevel,
            uint256 xpForNextLevel,
            uint256 xpProgress
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        currentXP = tokenXP[tokenId];
        currentLevel = version[tokenId];
        xpForNextLevel = _getXPForLevel(currentLevel + 1);
        
        if (currentXP >= xpForNextLevel) {
            xpProgress = 100;
        } else {
            uint256 xpForCurrentLevel = _getXPForLevel(currentLevel);
            uint256 xpInLevel = currentXP - xpForCurrentLevel;
            uint256 xpNeeded = xpForNextLevel - xpForCurrentLevel;
            xpProgress = (xpInLevel * 100) / xpNeeded;
        }
    }
    
    /**
     * @notice Get food prices
     */
    function getFoodPrices() 
        external 
        pure 
        returns (uint256 basic, uint256 premium, uint256 legendary) 
    {
        return (BASIC_FOOD_PRICE, PREMIUM_FOOD_PRICE, LEGENDARY_FOOD_PRICE);
    }
    
    /**
     * @notice Get training price
     */
    function getTrainPrice() external pure returns (uint256) {
        return TRAIN_PRICE;
    }
    
    // ============ Override Mint to Initialize Stats ============
    
    /**
     * @notice Override internal mint to initialize stats
     */
    function _mintInternal(address to, string memory uri) 
        internal 
        override 
        returns (uint256) 
    {
        uint256 tokenId = super._mintInternal(to, uri);
        
        // Initialize stats (all start at 5)
        for (uint8 i = 0; i < 5; i++) {
            tokenStats[tokenId][i] = 5;
        }
        
        // Initialize XP
        tokenXP[tokenId] = 0;
        
        return tokenId;
    }
}
