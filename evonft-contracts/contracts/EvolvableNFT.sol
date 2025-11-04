// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title EvolvableNFT
 * @dev ERC721 NFT that can evolve based on AI-driven off-chain signals
 * @notice Implements EIP-712 for secure evolution requests
 */
contract EvolvableNFT is ERC721URIStorage, Ownable, EIP712 {
    using ECDSA for bytes32;

    // ============ State Variables ============
    
    /// @notice Address authorized to sign evolution requests
    address public aiSigner;
    
    /// @notice Evolution version for each token
    mapping(uint256 => uint256) public version;
    
    /// @notice Last evolution timestamp for each token
    mapping(uint256 => uint256) public lastEvolvedAt;
    
    /// @notice Nonce for each token to prevent replay attacks
    mapping(uint256 => uint256) public nonces;
    
    /// @notice Cooldown period between evolutions (in seconds)
    uint256 public cooldown = 1 days;
    
    /// @notice Token counter for minting
    uint256 private _tokenIdCounter;
    
    /// @notice Base mint price
    uint256 public mintPrice = 0.01 ether;
    
    /// @notice Max supply
    uint256 public maxSupply = 10000;

    // ============ EIP-712 Type Hashes ============
    
    bytes32 private constant EVOLVE_TYPEHASH = 
        keccak256("EvolveRequest(uint256 tokenId,string newURI,uint256 nonce,uint256 deadline)");

    // ============ Events ============
    
    event Evolved(
        uint256 indexed tokenId, 
        string oldURI, 
        string newURI, 
        uint256 version,
        uint256 timestamp
    );
    
    event AISignerUpdated(address indexed oldSigner, address indexed newSigner);
    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);
    event Minted(address indexed to, uint256 indexed tokenId, string uri);

    // ============ Constructor ============
    
    constructor(
        string memory name,
        string memory symbol,
        address _aiSigner
    ) ERC721(name, symbol) EIP712(name, "1") Ownable(msg.sender) {
        require(_aiSigner != address(0), "Invalid AI signer");
        aiSigner = _aiSigner;
    }

    // ============ Minting Functions ============
    
    /**
     * @notice Mint a new NFT
     * @param to Address to mint to
     * @param uri Initial metadata URI
     */
    function mint(address to, string memory uri) external payable virtual returns (uint256) {
        return _mintInternal(to, uri);
    }
    
    /**
     * @notice Internal mint function
     */
    function _mintInternal(address to, string memory uri) internal virtual returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        version[tokenId] = 1;
        lastEvolvedAt[tokenId] = block.timestamp;
        
        emit Minted(to, tokenId, uri);
        return tokenId;
    }
    
    /**
     * @notice Batch mint (owner only)
     */
    function batchMint(address[] calldata recipients, string[] calldata uris) 
        external 
        onlyOwner 
    {
        require(recipients.length == uris.length, "Length mismatch");
        require(_tokenIdCounter + recipients.length <= maxSupply, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _tokenIdCounter++;
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
            version[tokenId] = 1;
            lastEvolvedAt[tokenId] = block.timestamp;
            emit Minted(recipients[i], tokenId, uris[i]);
        }
    }

    // ============ Evolution Functions ============
    
    /**
     * @notice Request evolution with AI signature
     * @param tokenId Token to evolve
     * @param newURI New metadata URI
     * @param deadline Signature expiration timestamp
     * @param signature EIP-712 signature from AI signer
     */
    function requestEvolve(
        uint256 tokenId,
        string calldata newURI,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(block.timestamp <= deadline, "Signature expired");
        require(
            block.timestamp >= lastEvolvedAt[tokenId] + cooldown,
            "Cooldown not passed"
        );
        
        // Verify EIP-712 signature
        bytes32 structHash = keccak256(
            abi.encode(
                EVOLVE_TYPEHASH,
                tokenId,
                keccak256(bytes(newURI)),
                nonces[tokenId],
                deadline
            )
        );
        
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        
        require(signer == aiSigner, "Invalid signature");
        
        // Update state
        string memory oldURI = tokenURI(tokenId);
        _setTokenURI(tokenId, newURI);
        version[tokenId]++;
        lastEvolvedAt[tokenId] = block.timestamp;
        nonces[tokenId]++;
        
        emit Evolved(tokenId, oldURI, newURI, version[tokenId], block.timestamp);
    }
    
    /**
     * @notice Emergency evolve by owner (for testing/recovery)
     */
    function ownerEvolve(uint256 tokenId, string calldata newURI) 
        external 
        onlyOwner 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        string memory oldURI = tokenURI(tokenId);
        _setTokenURI(tokenId, newURI);
        version[tokenId]++;
        lastEvolvedAt[tokenId] = block.timestamp;
        
        emit Evolved(tokenId, oldURI, newURI, version[tokenId], block.timestamp);
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Update AI signer address
     */
    function setAISigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid address");
        address oldSigner = aiSigner;
        aiSigner = _newSigner;
        emit AISignerUpdated(oldSigner, _newSigner);
    }
    
    /**
     * @notice Update cooldown period
     */
    function setCooldown(uint256 _newCooldown) external onlyOwner {
        uint256 oldCooldown = cooldown;
        cooldown = _newCooldown;
        emit CooldownUpdated(oldCooldown, _newCooldown);
    }
    
    /**
     * @notice Update mint price
     */
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
    }
    
    /**
     * @notice Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get token evolution info
     */
    function getEvolutionInfo(uint256 tokenId) 
        external 
        view 
        returns (
            uint256 currentVersion,
            uint256 lastEvolved,
            uint256 nextEvolveTime,
            uint256 currentNonce
        ) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            version[tokenId],
            lastEvolvedAt[tokenId],
            lastEvolvedAt[tokenId] + cooldown,
            nonces[tokenId]
        );
    }
    
    /**
     * @notice Check if token can evolve
     */
    function canEvolve(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        return block.timestamp >= lastEvolvedAt[tokenId] + cooldown;
    }
    
    /**
     * @notice Get total minted
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ============ Domain Separator ============
    
    /**
     * @notice Get EIP-712 domain separator
     */
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
