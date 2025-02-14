// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TagsterOG is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Minted(address indexed recipient, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("TagsterOG", "TAGOG") {}

    /**
     * @dev Mint a new NFT with metadata.
     * @param recipient The address that will receive the NFT.
     * @param tokenURI The metadata URI (IPFS/Arweave/HTTP).
     * @return newTokenId The ID of the newly minted NFT.
     */
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit Minted(recipient, newTokenId, tokenURI);

        return newTokenId;
    }

    /**
     * @dev Get the metadata URI of an NFT.
     * @param tokenId The ID of the NFT.
     * @return The token URI.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Get the total number of NFTs minted.
     * @return The total supply of NFTs.
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Override for ERC721URIStorage.
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
