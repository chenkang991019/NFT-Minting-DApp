// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // 引入权限控制

// 继承 Ownable，这样只有你能改设置、能提款
contract DevNFTv2 is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 1000; // 限量 1000 个
    string public baseTokenURI; // 存储 IPFS 的基础路径

    // 构造函数需要传入初始的 Owner 地址
    constructor(
        string memory initialBaseURI
    ) ERC721("DevNFT v2", "DEV2") Ownable(msg.sender) {
        baseTokenURI = initialBaseURI;
    }

    function mint() public payable {
        require(_tokenIds.current() < MAX_SUPPLY, "Sold out!"); // 检查是否卖光
        require(msg.value >= PRICE, "Ether sent is not correct");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
    }

    // 重写 baseURI 函数，OpenSea 会自动调用这个
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // 只有老板(你)能修改图片路径 (比如开盲盒)
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseTokenURI = _newBaseURI;
    }

    // 核心功能：提款！把合约里的 ETH 转到你钱包
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
