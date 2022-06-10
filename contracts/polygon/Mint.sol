//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; //Safemath no longer needed Sol v0.8.0 onwards
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Mint is ERC1155{

    using SafeMath for uint256;
    using Strings for string;

    uint256[] private batchMintids_;
    uint256 private royaltyFee = 5 ; // 5% royalty fee
    address public  devAddress; //payable?
    address public   beneficiary; //payable?
    uint mintEndTime;
    uint EXPIRY= 365 days;
    uint public immutable startedAt;
    uint internal timeElapsed;
    // uint DURATION = 10 days;
    address payable public owner;

    event NFTReservesUpdated(uint256 idx, uint256 amount);
    event WithdrawEvent(address account,uint256 amount);
    event TokenURIChanged(string URI_,uint256 _tokenId);
    event AddressesSet(address beneficiary,address devAddress);
    event MaxMintAmountChanged(uint maxMintAmount_new);

    error Unauthorized();
    error AuctionAlreadyEnded();
    error FunctionInvalidAtThisStage();
    error ErrorNFTReserves();
    error InvalidAddress();
    error InvalidExpiryDate();
    error NothingToWithdraw();
    error OwnerCannotParticipate();
    error BeneficiaryCannotParticipate();
    error DevCannotParticipate();
    error InvalidTransaction();

    string public baseExtension = ".json";
    string private _baseURI=  "https://ipfs.io/ipfs/QmcDRWwXCE1LjvdESNZsmc75syTJP2zA8WW9SHEaCwEmkc/";

    uint256[]  ids;
        //= [46,93,99,27];
    uint256[]  prices;
    // = [1 ether, 0.5 ether, 0.5 ether, 0.5 ether];
    // ["1000000000000000000","500000000000000000","500000000000000000","500000000000000000"]
    uint256[]  maxAmounts;
    //= [1000,500,400,300];
    uint256 public maxMintAmount;
    // = 100;

//Dutch Auction variables 
    uint DURATION;// = 200 seconds;
    uint dutchEndPrice;// = 0.1 ether;
    uint dutchStartPrice;//= 5 ether;
    uint dutchDiscountRate;// = 10000000000000000;
    uint auctionEndTime;

// for 10 days 5000000000000 * 864000 = 3.45e18
//for 200 secs 10000000000000000 * 200 = 4e18

    struct NFTInfo {
        uint256 id;
        uint256 price;
        uint256 reserves;
        }

    NFTInfo[] internal nftInfo;

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

    MintVariables  m_vars;
    mapping (uint256 => uint256) internal _idToidx; //TokenId to Index position mapping
    mapping (uint256=>  string) _tokenURI; //TokenId to tokenURI mapping
    mapping (address => uint256) public pendingWithdrawal;// withdraw later

constructor  (
            uint256[] memory ids_,
            uint256[] memory prices_, 
            uint256[] memory maxAmounts_,
            // uint256 royaltyFee_,
            uint256 maxMintAmount_,
            uint dutchStartPrice_,
            uint dutchDiscountRate_,
            uint DURATION_
             )ERC1155(_baseURI) payable {
        owner = payable(msg.sender);
        startedAt = block.timestamp;                                                                   
        // auctionEndTime = startedAt + DURATION;
        mintEndTime = block.timestamp + EXPIRY; 


        require(ids_.length == maxAmounts_.length && ids_.length == prices_.length,"ERC1155: Input array lenghts aren't the same!");
        ids = ids_;
        prices = prices_;
        maxAmounts = maxAmounts_;

            for(uint i =0; i< ids.length; i++) {
            _idToidx[ids[i]] = i;
            nftInfo.push(NFTInfo({
            id: ids[i],
            price: prices[i],
            reserves: maxAmounts[i]
                  }));
            _tokenURI[ids[i]] = string.concat(_baseURI,Strings.toString(ids[i]),baseExtension);
        }
        maxMintAmount = maxMintAmount_;    
        DURATION = DURATION_;
        auctionEndTime = startedAt + DURATION;
        dutchStartPrice = dutchStartPrice_;
        dutchDiscountRate = dutchDiscountRate_;
        require(dutchStartPrice > getDiscount(dutchDiscountRate,DURATION),"Starting price is too low!");

    }


    //No Reentrance Guard
    bool locked;
    modifier noReentrancy(){
        require(!locked,"Reentrant Call");
        locked = true;
        _;
        locked = false;
        _;

    }

    enum MintStage {
        MintLive,
        MintEnded
    }

    MintStage mintStage;
    //OnlyOwner Modifier
    modifier onlyBy(address account){
        if (msg.sender != account) revert Unauthorized();
        _;
    }


    modifier mintTimedTransitions() {
        if (block.timestamp > mintEndTime)
            nextMintStage();
            _;
    }


    modifier atMintStage(MintStage mintStage_) {
        if (mintStage != mintStage_) revert FunctionInvalidAtThisStage();
        _;

    }
   

    function nextMintStage() internal {
        mintStage = MintStage(uint(mintStage)+1);
    }

 //-------------------------
//MINT SINGLE : START 

       function mintSingle(uint256 _id, uint256 _amount)  
         public   
         payable 
         mintTimedTransitions() 
         atMintStage(MintStage.MintLive){
       if (msg.sender == address(0)) revert InvalidAddress();
        require(_amount<= maxMintAmount && balanceOf(msg.sender,_id) <= maxMintAmount,"There's a limit to minting per address");
        // require(msg.sender != owner || msg.sender != beneficiary || msg.sender != devAddress,"Owner, beneficiary and devs cannot bid on this auction");
         if (msg.sender == owner) revert OwnerCannotParticipate();
         if (msg.sender == beneficiary) revert BeneficiaryCannotParticipate();
         if (msg.sender == devAddress) revert DevCannotParticipate();

        uint256 _idx;
        _idx =  _idToidx[_id];
        uint256 price;
       uint256 royaltyFees;
       uint256 beneficiaryAmount;
       uint256 nftReserves;

       price = nftInfo[_idx].price;
      nftReserves = nftInfo[_idx].reserves;
  
        require( nftReserves >= _amount,"ERC1155: Sorry, this NFT's sold out!");
        // require(  price*_amount<= msg.value,"ERC1155: You don't have enough funds for this single mint");
        if( msg.value< price*_amount) revert InvalidTransaction();
        // "ERC1155: You don't have enough funds for this batch mint");


        //Update NFT Reserves
        _updateReserves(_idx,_amount);

       //Mint to the calling account address
        _mint(msg.sender,_id,_amount,""); //Will update the user balances and enumerations

        //Calculate and Pay Royalty Fee to owner/platform
         royaltyFees = (msg.value*royaltyFee)/100;

        //Owner withdraws the balance funds
        beneficiaryAmount = msg.value-royaltyFees;

        //Using the pendingWithdrawal method
        pendingWithdrawal[devAddress] = royaltyFees;
        pendingWithdrawal[beneficiary] = beneficiaryAmount;

    }
//***/
//----------------

// /MINT BATCH : START 
    function mintBatch(uint256[] memory _ids, uint256[] memory _amounts) 
    public    
    payable 
    mintTimedTransitions() 
    atMintStage(MintStage.MintLive)
    returns (uint,uint){

        if (msg.sender == address(0)) revert InvalidAddress();
         if (msg.sender == owner) revert OwnerCannotParticipate();
         if (msg.sender == beneficiary) revert BeneficiaryCannotParticipate();
         if (msg.sender == devAddress) revert DevCannotParticipate();       
        //   require(_ids.length == _amounts.length,"ERC1155: Invalid array lengths");
        
       m_vars.totalPrice = 0;
       
        // NFTInfo memory nftInfo_;

        for(uint i =0; i< _ids.length; i++) {
        m_vars.idx =  _idToidx[_ids[i]];
        m_vars.id = _ids[i];
        m_vars.price = nftInfo[m_vars.idx].price;
        m_vars.reserves = nftInfo[m_vars.idx].reserves;
        m_vars.amount = _amounts[i];
        require(m_vars.reserves >= m_vars.amount,
        "ERC1155: Not enough NFTs of this tokenId in stock!");
        require(m_vars.amount<= maxMintAmount 
         && balanceOf(msg.sender,m_vars.id) <= maxMintAmount,
         "There's a limit to minting per address");
        //     // require( msg.value>= price*amount,"ERC1155: You don't have enough funds for this batch mint");
        //     //  if( msg.value < m_vars.price*m_vars.amount) revert InvalidTransaction();

        //     //Update NFT reserves for the selcted token
        
        _updateReserves(m_vars.idx,m_vars.amount);
        //   //Calculate the cumulative platform fees per token/amount
        // //Calculate total owner payments for the batch mint

            mintSingle(m_vars.id,m_vars.amount);
        m_vars.totalPrice= m_vars.totalPrice+ (m_vars.price*m_vars.amount);

        }

         if( msg.value < m_vars.totalPrice) revert InvalidTransaction();

     
        //Using the pendingWithdrawal method
        m_vars.devAmount = (m_vars.totalPrice*royaltyFee)/100;
        m_vars.beneficiaryAmount = m_vars.totalPrice - m_vars.devAmount;

        pendingWithdrawal[devAddress] = m_vars.devAmount;
        pendingWithdrawal[beneficiary] =  m_vars.beneficiaryAmount;  
        return ( msg.value, m_vars.totalPrice);
    }




    function getElapsedTime() public 
        view
        onlyBy(owner) 
        returns (uint) 
    {
        return block.timestamp-startedAt;
    }


    function currentBlockStamp() public view returns (uint) {
        return block.timestamp;
    }

   

    //ERC1155: Returns the tokenURI of TokenId
    function uri(uint256 id) override public view returns (string memory) {
        require (bytes(_tokenURI[id]).length !=0, "This token doesn't exist!");
        return _tokenURI[id];
    }


    //ERC1155: Change the tokenURI if needed on a per token basis
    function setTokenURI(string memory baseURI_,uint256 id) public onlyBy(owner) {
        _tokenURI[id] = string.concat(baseURI_,Strings.toString(id),baseExtension);
        emit TokenURIChanged(_tokenURI[id],id);
    }

    function getNFTInfo(uint tokenId) public view returns (NFTInfo memory) {
        require (bytes(_tokenURI[tokenId]).length !=0, "This token doesn't exist!");
        uint idx_ = _idToidx[tokenId];
        return nftInfo[idx_];
}   

    function _updateReserves(uint256 _idx,uint256 amount) internal {
        if (nftInfo[_idx].reserves < amount) revert ErrorNFTReserves();
        nftInfo[_idx].reserves -= amount;
        emit NFTReservesUpdated(_idx, amount);
    }


function withdraw() external payable noReentrancy {
        uint256 amount = pendingWithdrawal[msg.sender];
        // if (amount <=0) revert NothingToWithdraw();

        pendingWithdrawal[msg.sender] = 0;
        // payable(msg.sender).transfer(amount);
        //Since the transfer method is no longer safe to use due to gas cost fluctiation, only sends 2300 gas
        //Call forwards all the gas, risk of reentrance attack, so use reentrance guard modifier
        (bool success2,) = payable(msg.sender).call{value: amount}("");
        require(success2,"Owner payment transaction failed!");

    emit WithdrawEvent(msg.sender,amount);

    }


    function getPendingBalance(address addr_) public view returns (uint) 
    {return pendingWithdrawal[addr_];}

function setAddresses(address payable beneficiaryAddr_, address payable devAddress_)
    public 
    onlyBy(owner)  
    {
        beneficiary = beneficiaryAddr_;
        devAddress = devAddress_;
        emit AddressesSet(beneficiary, devAddress);
    }



function getAddresses() public view onlyBy(owner) returns (address,address){
    return (beneficiary,devAddress);
}


//----
//DUTCH auction start

//ERC1155 Mint variables 
    enum DutchStage {
        DutchAuctionLive,
        DutchAuctionEnded
    }

    DutchStage dutchStage;

    struct Payments {
        uint price;
        uint balance;
        uint refund;
        uint devPayment;
        uint ownerPayment;}

    mapping (uint => Payments) dutchAuctionInfo;

 Payments payment;


    modifier dutchTimedTransitions() {
        if (block.timestamp > auctionEndTime)
            nextDutchStage();
            _;
    }


    modifier atDutchStage(DutchStage dutchStage_) {
        if (dutchStage != dutchStage_) revert FunctionInvalidAtThisStage();
        _;

    }

    function nextDutchStage() internal {
        dutchStage = DutchStage(uint(dutchStage)+1);
    }

 //-------------------------
//DUTCH AUCTION: START 

 function bid(uint256 tokenId) 
        external 
        payable 
        dutchTimedTransitions()
        atDutchStage(DutchStage.DutchAuctionLive) 
           returns (uint, uint,uint,uint,uint)
        {
    //    if (msg.sender == address(0)) revert InvalidAddress();
       if (block.timestamp > auctionEndTime) revert AuctionAlreadyEnded();
        require(msg.sender != owner && msg.sender != beneficiary && msg.sender != devAddress,"Owner, beneficiary and devs cannot bid on this auction");
        uint256 _idx;
        _idx =  _idToidx[tokenId];
        dutchAuctionInfo[tokenId].price = dutchStartPrice - dutchDiscountRate*(block.timestamp-startedAt);

       require  (msg.value >=  dutchAuctionInfo[tokenId].price,"Bid not high enough!");
        _updateReserves(_idx,1); //Subtract 1, as we only have 1 of this NFT
      _mint(msg.sender,tokenId,1,""); // //1:1 NFT minted
    // emit Sold(tokenId, msg.sender);

    // //Refund the balance and emit an event
     if (msg.value> dutchAuctionInfo[tokenId].price) 
        {dutchAuctionInfo[tokenId].refund = msg.value - dutchAuctionInfo[tokenId].price;
        pendingWithdrawal[msg.sender] +=dutchAuctionInfo[tokenId].refund;}
        
    //     //Calculate balanceAmount and Pay Royalty and Owner Fees
        dutchAuctionInfo[tokenId].balance = msg.value - dutchAuctionInfo[tokenId].refund;
        dutchAuctionInfo[tokenId].devPayment = (dutchAuctionInfo[tokenId].balance 
                                                *(royaltyFee)/100);
        dutchAuctionInfo[tokenId].ownerPayment = dutchAuctionInfo[tokenId].balance
                                                    - dutchAuctionInfo[tokenId].devPayment;
    //    //Using the pendingWithdrawal method

        pendingWithdrawal[devAddress] = dutchAuctionInfo[tokenId].devPayment;
        pendingWithdrawal[beneficiary] = dutchAuctionInfo[tokenId].ownerPayment;

        // return (tokenId,msg.value,dutchAuctionInfo[tokenId].price);
        return (tokenId,
                msg.value,
                pendingWithdrawal[msg.sender],
                pendingWithdrawal[devAddress],
                pendingWithdrawal[beneficiary]);
 }


    // function getDiscount() internal view returns (uint) {
    //     return dutchDiscountRate * DURATION_;
    // }

    function getDiscount(uint dutchDiscountRate_,uint DURATION_) 
        internal 
        pure  
        returns (uint) {
        return dutchDiscountRate_ * DURATION_;
    }


    function getDutchPrice() 
        public 
        onlyBy(owner)
        view 
        returns(uint) {

        return dutchStartPrice - (dutchDiscountRate*getElapsedTime());
    }


function getAuctionEndTime()
    public 
    view
    onlyBy(owner)
    returns (uint) {
        return auctionEndTime;
    }


    function SetmaxMintAmount(uint maxMintAmount_new)
        public 
        onlyBy(owner)
        {
            maxMintAmount = maxMintAmount_new;
            emit MaxMintAmountChanged(maxMintAmount);
        }

    //----


}




//Compiled byte code

