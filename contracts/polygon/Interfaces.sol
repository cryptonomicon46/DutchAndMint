//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;


interface IMint {
   
    struct NFTInfo {
        uint256 id;
        uint256 price;
        uint256 reserves;
        }

    // NFTInfo[] internal nftInfo;

    struct MintVariables {
        uint idx;
        uint id;
        uint price;
        uint reserves;
        uint amount;
        uint totalPrice;
        uint beneficiaryAmount;
        uint devAmount;
    }


    enum DutchStage {
        DutchAuctionLive,
        DutchAuctionEnded
    }



    struct Payments {
        uint price;
        uint balance;
        uint refund;
        uint devPayment;
        uint ownerPayment;
        }

    function mintSingle(uint,uint) payable external;
    function mintBatch(uint[] memory ,uint[] memory) payable external returns (uint,uint);
    function bid(uint) external payable returns (uint, uint,uint,uint,uint);
    function currentBlockStamp() external returns (uint);
    function setTokenURI(string memory,uint) external;
    
    function getNFTInfo(uint) external returns (NFTInfo memory);
    function withdraw() external payable;
    function setAddresses(address payable,address payable) external;
    function getAddresses() external returns (address,address);
    function getPendingBalance(address) external returns (uint);
    // function getDiscount(uint,uint) external returns (uint);
    // function getDutchPrice() external returns(uint);
    function getAuctionEndTime() external returns (uint);
    function SetmaxMintAmount(uint) external;

}
