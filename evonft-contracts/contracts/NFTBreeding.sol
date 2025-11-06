// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./EvolvableNFTExtended.sol";

/**
 * @title NFTBreeding
 * @notice Contract for breeding EvoNFTs to create offspring
 */
contract NFTBreeding is Ownable, ReentrancyGuard {
    EvolvableNFTExtended public nftContract;
    
    // Breeding configuration
    uint256 public breedingFee = 0.01 ether; // 0.01 MATIC
    uint256 public breedingCooldown = 24 hours;
    uint256 public maxBreedCount = 3;
    
    // Breeding info per token
    struct BreedingInfo {
        uint256 breedCount;
        uint256 lastBreedTime;
        uint256 generation;
    }
    
    mapping(uint256 => BreedingInfo) public breedingInfo;
    
    // Events
    event Bred(
        uint256 indexed parent1Id,
        uint256 indexed parent2Id,
        uint256 indexed offspringId,
        address breeder,
        uint256 timestamp
    );
    
    event BreedingFeeUpdated(uint256 newFee);
    event CooldownUpdated(uint256 newCooldown);
    
    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = EvolvableNFTExtended(_nftContract);
    }
    
    /**
     * @notice Breed two NFTs to create offspring
     * @param parent1Id Token ID of first parent
     * @param parent2Id Token ID of second parent
     */
    function breed(uint256 parent1Id, uint256 parent2Id) 
        external 
        payable 
        nonReentrant 
        returns (uint256 offspringId) 
    {
        require(parent1Id != parent2Id, "Cannot breed with self");
        
        // Check ownership
        require(nftContract.ownerOf(parent1Id) == msg.sender, "Not owner of parent 1");
        require(nftContract.ownerOf(parent2Id) == msg.sender, "Not owner of parent 2");
        
        // Check breed count
        require(breedingInfo[parent1Id].breedCount < maxBreedCount, "Parent 1 max breeds reached");
        require(breedingInfo[parent2Id].breedCount < maxBreedCount, "Parent 2 max breeds reached");
        
        // Check cooldown
        require(
            block.timestamp >= breedingInfo[parent1Id].lastBreedTime + breedingCooldown,
            "Parent 1 in cooldown"
        );
        require(
            block.timestamp >= breedingInfo[parent2Id].lastBreedTime + breedingCooldown,
            "Parent 2 in cooldown"
        );
        
        // Calculate generation
        uint256 parent1Gen = breedingInfo[parent1Id].generation;
        uint256 parent2Gen = breedingInfo[parent2Id].generation;
        uint256 offspringGen = (parent1Gen > parent2Gen ? parent1Gen : parent2Gen) + 1;
        
        // Generate metadata URI with parent info
        string memory uri = _generateOffspringURI(
            parent1Id,
            parent2Id,
            offspringGen
        );
        
        // Get mint price from NFT contract
        uint256 mintPrice = nftContract.mintPrice();
        require(msg.value >= breedingFee + mintPrice, "Insufficient payment for breeding + minting");
        
        // Mint offspring (stats will be initialized by NFT contract)
        offspringId = nftContract.mint{value: mintPrice}(msg.sender, uri);
        
        // Update breeding info
        breedingInfo[parent1Id].breedCount++;
        breedingInfo[parent1Id].lastBreedTime = block.timestamp;
        
        breedingInfo[parent2Id].breedCount++;
        breedingInfo[parent2Id].lastBreedTime = block.timestamp;
        
        breedingInfo[offspringId].generation = offspringGen;
        breedingInfo[offspringId].breedCount = 0;
        breedingInfo[offspringId].lastBreedTime = 0;
        
        emit Bred(parent1Id, parent2Id, offspringId, msg.sender, block.timestamp);
        
        // Refund excess payment
        uint256 totalCost = breedingFee + mintPrice;
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        return offspringId;
    }
    
    /**
     * @notice Check if NFT can breed
     */
    function canBreed(uint256 tokenId) external view returns (bool) {
        BreedingInfo memory info = breedingInfo[tokenId];
        
        if (info.breedCount >= maxBreedCount) {
            return false;
        }
        
        if (block.timestamp < info.lastBreedTime + breedingCooldown) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @notice Get time until NFT can breed again
     */
    function getTimeUntilBreedable(uint256 tokenId) external view returns (uint256) {
        BreedingInfo memory info = breedingInfo[tokenId];
        
        if (info.breedCount >= maxBreedCount) {
            return type(uint256).max; // Never breedable again
        }
        
        uint256 nextBreedTime = info.lastBreedTime + breedingCooldown;
        
        if (block.timestamp >= nextBreedTime) {
            return 0; // Can breed now
        }
        
        return nextBreedTime - block.timestamp;
    }
    
    /**
     * @notice Get breeding info for token
     */
    function getBreedingInfo(uint256 tokenId) 
        external 
        view 
        returns (
            uint256 breedCount,
            uint256 lastBreedTime,
            uint256 generation,
            bool canBreedNow,
            uint256 timeUntilBreedable
        ) 
    {
        BreedingInfo memory info = breedingInfo[tokenId];
        
        breedCount = info.breedCount;
        lastBreedTime = info.lastBreedTime;
        generation = info.generation;
        
        canBreedNow = info.breedCount < maxBreedCount && 
                      block.timestamp >= info.lastBreedTime + breedingCooldown;
        
        if (info.breedCount >= maxBreedCount) {
            timeUntilBreedable = type(uint256).max;
        } else if (block.timestamp >= info.lastBreedTime + breedingCooldown) {
            timeUntilBreedable = 0;
        } else {
            timeUntilBreedable = (info.lastBreedTime + breedingCooldown) - block.timestamp;
        }
    }
    
    /**
     * @notice Calculate predicted offspring stats
     */
    function predictOffspringStats(uint256 parent1Id, uint256 parent2Id)
        external
        view
        returns (
            uint256 strength,
            uint256 speed,
            uint256 intelligence,
            uint256 defense,
            uint256 luck,
            uint256 generation
        )
    {
        // Get parent stats
        uint8[5] memory p1Stats = nftContract.getTokenStats(parent1Id);
        uint8[5] memory p2Stats = nftContract.getTokenStats(parent2Id);
        
        // Calculate offspring stats (70% of average)
        strength = ((uint256(p1Stats[0]) + uint256(p2Stats[0])) * 70) / 200;
        speed = ((uint256(p1Stats[1]) + uint256(p2Stats[1])) * 70) / 200;
        intelligence = ((uint256(p1Stats[2]) + uint256(p2Stats[2])) * 70) / 200;
        defense = ((uint256(p1Stats[3]) + uint256(p2Stats[3])) * 70) / 200;
        luck = ((uint256(p1Stats[4]) + uint256(p2Stats[4])) * 70) / 200;
        
        // Calculate generation
        uint256 parent1Gen = breedingInfo[parent1Id].generation;
        uint256 parent2Gen = breedingInfo[parent2Id].generation;
        generation = (parent1Gen > parent2Gen ? parent1Gen : parent2Gen) + 1;
    }
    
    /**
     * @notice Generate offspring metadata URI
     */
    function _generateOffspringURI(
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 generation
    ) internal pure returns (string memory) {
        // Simple URI generation - in production, this would call IPFS
        return string(abi.encodePacked(
            "ipfs://offspring-",
            _toString(parent1Id),
            "-",
            _toString(parent2Id),
            "-gen",
            _toString(generation)
        ));
    }
    
    /**
     * @notice Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    // Admin functions
    
    function setBreedingFee(uint256 _fee) external onlyOwner {
        breedingFee = _fee;
        emit BreedingFeeUpdated(_fee);
    }
    
    function setCooldown(uint256 _cooldown) external onlyOwner {
        breedingCooldown = _cooldown;
        emit CooldownUpdated(_cooldown);
    }
    
    function setMaxBreedCount(uint256 _maxCount) external onlyOwner {
        maxBreedCount = _maxCount;
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
