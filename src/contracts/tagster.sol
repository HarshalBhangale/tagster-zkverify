// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TagsterogNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public maxSupply;
    string private _baseTokenURI;

    constructor(string memory baseURI, uint256 _maxSupply) ERC721("TagsterogNFT", "TAG") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        maxSupply = _maxSupply;
    }

    function mintNFT(address recipient, string memory tokenURI) external onlyOwner {
        require(_nextTokenId < maxSupply, "Max supply reached");
        
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function burnNFT(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _burn(tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
}
