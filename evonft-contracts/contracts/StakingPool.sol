// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StakingPool
 * @dev Stake NFTs to earn XP and MATIC rewards
 */
contract StakingPool is Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    IERC721 public nftContract;
    
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        uint256 lastClaimAt;
    }
    
    mapping(uint256 => StakeInfo) public stakes;
    mapping(address => uint256[]) public userStakes;
    
    // Rewards
    uint256 public constant BASE_XP_PER_DAY = 50;
    uint256 public constant BASE_MATIC_PER_DAY = 0.01 ether;
    
    // Tier bonuses (in basis points, 100 = 1%)
    uint256 public constant BRONZE_BONUS = 0;      // 0%
    uint256 public constant SILVER_BONUS = 2000;   // 20%
    uint256 public constant GOLD_BONUS = 5000;     // 50%
    uint256 public constant DIAMOND_BONUS = 10000; // 100%
    
    // Tier thresholds (in days)
    uint256 public constant SILVER_DAYS = 8;
    uint256 public constant GOLD_DAYS = 31;
    uint256 public constant DIAMOND_DAYS = 90;
    
    uint256 public totalStaked;
    
    // ============ Events ============
    
    event Staked(address indexed user, uint256 indexed tokenId, uint256 timestamp);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 xp, uint256 matic);
    
    // ============ Constructor ============
    
    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
    }
    
    // ============ Staking Functions ============
    
    /**
     * @notice Stake NFT
     */
    function stake(uint256 tokenId) public nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(stakes[tokenId].owner == address(0), "Already staked");
        
        // Transfer NFT to contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        // Record stake
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            lastClaimAt: block.timestamp
        });
        
        userStakes[msg.sender].push(tokenId);
        totalStaked++;
        
        emit Staked(msg.sender, tokenId, block.timestamp);
    }
    
    /**
     * @notice Unstake NFT (auto-claims rewards)
     */
    function unstake(uint256 tokenId) external nonReentrant {
        StakeInfo memory stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        // Claim pending rewards
        _claimRewards(tokenId);
        
        // Transfer NFT back
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        
        // Remove stake
        delete stakes[tokenId];
        _removeUserStake(msg.sender, tokenId);
        totalStaked--;
        
        emit Unstaked(msg.sender, tokenId, block.timestamp);
    }
    
    /**
     * @notice Claim rewards without unstaking
     */
    function claimRewards(uint256 tokenId) external nonReentrant {
        StakeInfo memory stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not stake owner");
        
        _claimRewards(tokenId);
    }
    
    /**
     * @notice Batch stake multiple NFTs
     */
    function batchStake(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            stake(tokenIds[i]);
        }
    }
    
    /**
     * @notice Batch claim rewards
     */
    function batchClaimRewards(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (stakes[tokenIds[i]].owner == msg.sender) {
                _claimRewards(tokenIds[i]);
            }
        }
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Internal claim rewards
     */
    function _claimRewards(uint256 tokenId) internal {
        StakeInfo storage stakeInfo = stakes[tokenId];
        
        (uint256 xpReward, uint256 maticReward) = getPendingRewards(tokenId);
        
        if (xpReward > 0 || maticReward > 0) {
            stakeInfo.lastClaimAt = block.timestamp;
            
            // Transfer MATIC rewards
            if (maticReward > 0 && address(this).balance >= maticReward) {
                payable(stakeInfo.owner).transfer(maticReward);
            }
            
            emit RewardsClaimed(stakeInfo.owner, tokenId, xpReward, maticReward);
        }
    }
    
    /**
     * @notice Remove token from user stakes array
     */
    function _removeUserStake(address user, uint256 tokenId) internal {
        uint256[] storage userStakesList = userStakes[user];
        for (uint256 i = 0; i < userStakesList.length; i++) {
            if (userStakesList[i] == tokenId) {
                userStakesList[i] = userStakesList[userStakesList.length - 1];
                userStakesList.pop();
                break;
            }
        }
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get pending rewards
     */
    function getPendingRewards(uint256 tokenId) 
        public 
        view 
        returns (uint256 xpReward, uint256 maticReward) 
    {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (stakeInfo.owner == address(0)) return (0, 0);
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimAt;
        uint256 daysStaked = timeStaked / 1 days;
        
        if (daysStaked == 0) return (0, 0);
        
        // Calculate base rewards
        xpReward = BASE_XP_PER_DAY * daysStaked;
        maticReward = BASE_MATIC_PER_DAY * daysStaked;
        
        // Apply tier bonus
        uint256 totalDaysStaked = (block.timestamp - stakeInfo.stakedAt) / 1 days;
        uint256 bonus = _getTierBonus(totalDaysStaked);
        
        xpReward = xpReward + (xpReward * bonus / 10000);
        maticReward = maticReward + (maticReward * bonus / 10000);
    }
    
    /**
     * @notice Get tier bonus
     */
    function _getTierBonus(uint256 daysStaked) internal pure returns (uint256) {
        if (daysStaked >= DIAMOND_DAYS) return DIAMOND_BONUS;
        if (daysStaked >= GOLD_DAYS) return GOLD_BONUS;
        if (daysStaked >= SILVER_DAYS) return SILVER_BONUS;
        return BRONZE_BONUS;
    }
    
    /**
     * @notice Get stake tier
     */
    function getStakeTier(uint256 tokenId) 
        external 
        view 
        returns (string memory tier, uint256 bonus) 
    {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (stakeInfo.owner == address(0)) return ("None", 0);
        
        uint256 daysStaked = (block.timestamp - stakeInfo.stakedAt) / 1 days;
        bonus = _getTierBonus(daysStaked);
        
        if (daysStaked >= DIAMOND_DAYS) return ("Diamond", bonus);
        if (daysStaked >= GOLD_DAYS) return ("Gold", bonus);
        if (daysStaked >= SILVER_DAYS) return ("Silver", bonus);
        return ("Bronze", bonus);
    }
    
    /**
     * @notice Get user's staked tokens
     */
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    /**
     * @notice Get stake info
     */
    function getStakeInfo(uint256 tokenId)
        external
        view
        returns (
            address owner,
            uint256 stakedAt,
            uint256 lastClaimAt,
            uint256 daysStaked,
            uint256 pendingXP,
            uint256 pendingMatic
        )
    {
        StakeInfo memory stakeInfo = stakes[tokenId];
        owner = stakeInfo.owner;
        stakedAt = stakeInfo.stakedAt;
        lastClaimAt = stakeInfo.lastClaimAt;
        
        if (owner != address(0)) {
            daysStaked = (block.timestamp - stakedAt) / 1 days;
            (pendingXP, pendingMatic) = getPendingRewards(tokenId);
        }
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Fund contract with MATIC for rewards
     */
    function fundRewards() external payable onlyOwner {}
    
    /**
     * @notice Withdraw excess MATIC
     */
    function withdrawExcess(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner()).transfer(amount);
    }
    
    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 tokenId) external onlyOwner {
        StakeInfo memory stakeInfo = stakes[tokenId];
        require(stakeInfo.owner != address(0), "Not staked");
        
        nftContract.transferFrom(address(this), stakeInfo.owner, tokenId);
        delete stakes[tokenId];
        _removeUserStake(stakeInfo.owner, tokenId);
        totalStaked--;
    }
    
    // ============ Receive MATIC ============
    
    receive() external payable {}
}
