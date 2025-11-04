// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEvolvableNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function mint(address to, string memory uri) external payable returns (uint256);
    function version(uint256 tokenId) external view returns (uint256);
}

/**
 * @title BreedingLab
 * @dev Breed two NFTs to create offspring
 */
contract BreedingLab is Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    IEvolvableNFT public nftContract;
    
    struct BreedInfo {
        uint256 parent1;
        uint256 parent2;
        address owner;
        uint256 startTime;
        bool completed;
        uint256 offspringId;
    }
    
    mapping(uint256 => uint256) public breedCount; // tokenId => breed count
    mapping(uint256 => BreedInfo) public breedings; // breedingId => BreedInfo
    
    uint256 public breedingIdCounter;
    uint256 public constant MAX_BREED_COUNT = 3;
    uint256 public constant BREEDING_DURATION = 24 hours;
    uint256 public breedingFee = 1.0 ether;
    
    // ============ Events ============
    
    event BreedingStarted(
        uint256 indexed breedingId,
        address indexed owner,
        uint256 parent1,
        uint256 parent2,
        uint256 startTime
    );
    
    event BreedingCompleted(
        uint256 indexed breedingId,
        uint256 indexed offspringId,
        uint256 parent1,
        uint256 parent2
    );
    
    // ============ Constructor ============
    
    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = IEvolvableNFT(_nftContract);
    }
    
    // ============ Breeding Functions ============
    
    /**
     * @notice Start breeding two NFTs
     */
    function breed(uint256 parent1, uint256 parent2, string calldata offspringURI) 
        external 
        payable 
        nonReentrant 
        returns (uint256 breedingId) 
    {
        require(msg.value >= breedingFee, "Insufficient breeding fee");
        require(parent1 != parent2, "Cannot breed with self");
        
        // Check ownership
        require(nftContract.ownerOf(parent1) == msg.sender, "Not owner of parent1");
        require(nftContract.ownerOf(parent2) == msg.sender, "Not owner of parent2");
        
        // Check breed count
        require(breedCount[parent1] < MAX_BREED_COUNT, "Parent1 max breeds reached");
        require(breedCount[parent2] < MAX_BREED_COUNT, "Parent2 max breeds reached");
        
        // Create breeding
        breedingId = breedingIdCounter++;
        
        breedings[breedingId] = BreedInfo({
            parent1: parent1,
            parent2: parent2,
            owner: msg.sender,
            startTime: block.timestamp,
            completed: false,
            offspringId: 0
        });
        
        // Increment breed counts
        breedCount[parent1]++;
        breedCount[parent2]++;
        
        emit BreedingStarted(breedingId, msg.sender, parent1, parent2, block.timestamp);
        
        // If instant breeding (for testing), complete immediately
        if (BREEDING_DURATION == 0) {
            _completeBreeding(breedingId, offspringURI);
        }
        
        // Refund excess
        if (msg.value > breedingFee) {
            payable(msg.sender).transfer(msg.value - breedingFee);
        }
    }
    
    /**
     * @notice Complete breeding and mint offspring
     */
    function completeBreeding(uint256 breedingId, string calldata offspringURI) 
        external 
        nonReentrant 
    {
        BreedInfo storage breeding = breedings[breedingId];
        
        require(breeding.owner == msg.sender, "Not breeding owner");
        require(!breeding.completed, "Already completed");
        require(
            block.timestamp >= breeding.startTime + BREEDING_DURATION,
            "Breeding not ready"
        );
        
        _completeBreeding(breedingId, offspringURI);
    }
    
    /**
     * @notice Internal complete breeding
     */
    function _completeBreeding(uint256 breedingId, string calldata offspringURI) internal {
        BreedInfo storage breeding = breedings[breedingId];
        
        // Mint offspring
        uint256 offspringId = nftContract.mint(breeding.owner, offspringURI);
        
        breeding.completed = true;
        breeding.offspringId = offspringId;
        
        emit BreedingCompleted(breedingId, offspringId, breeding.parent1, breeding.parent2);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Check if breeding is ready
     */
    function isBreedingReady(uint256 breedingId) external view returns (bool) {
        BreedInfo memory breeding = breedings[breedingId];
        if (breeding.completed) return false;
        return block.timestamp >= breeding.startTime + BREEDING_DURATION;
    }
    
    /**
     * @notice Get time remaining for breeding
     */
    function getTimeRemaining(uint256 breedingId) external view returns (uint256) {
        BreedInfo memory breeding = breedings[breedingId];
        if (breeding.completed) return 0;
        
        uint256 endTime = breeding.startTime + BREEDING_DURATION;
        if (block.timestamp >= endTime) return 0;
        
        return endTime - block.timestamp;
    }
    
    /**
     * @notice Get breeding info
     */
    function getBreedingInfo(uint256 breedingId)
        external
        view
        returns (
            uint256 parent1,
            uint256 parent2,
            address owner,
            uint256 startTime,
            bool completed,
            uint256 offspringId,
            uint256 timeRemaining
        )
    {
        BreedInfo memory breeding = breedings[breedingId];
        
        parent1 = breeding.parent1;
        parent2 = breeding.parent2;
        owner = breeding.owner;
        startTime = breeding.startTime;
        completed = breeding.completed;
        offspringId = breeding.offspringId;
        
        if (!completed) {
            uint256 endTime = startTime + BREEDING_DURATION;
            timeRemaining = block.timestamp >= endTime ? 0 : endTime - block.timestamp;
        }
    }
    
    /**
     * @notice Check if token can breed
     */
    function canBreed(uint256 tokenId) external view returns (bool) {
        return breedCount[tokenId] < MAX_BREED_COUNT;
    }
    
    /**
     * @notice Get breed count
     */
    function getBreedCount(uint256 tokenId) external view returns (uint256) {
        return breedCount[tokenId];
    }
    
    /**
     * @notice Calculate compatibility score (mock)
     */
    function getCompatibility(uint256 parent1, uint256 parent2) 
        external 
        view 
        returns (uint256 score) 
    {
        // Simple compatibility based on levels
        uint256 level1 = nftContract.version(parent1);
        uint256 level2 = nftContract.version(parent2);
        
        uint256 avgLevel = (level1 + level2) / 2;
        
        // Higher level = better compatibility
        if (avgLevel >= 20) return 95;
        if (avgLevel >= 15) return 85;
        if (avgLevel >= 10) return 75;
        if (avgLevel >= 5) return 65;
        return 50;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Set breeding fee
     */
    function setBreedingFee(uint256 _fee) external onlyOwner {
        breedingFee = _fee;
    }
    
    /**
     * @notice Withdraw fees
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }
}
