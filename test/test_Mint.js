
const Mint = artifacts.require("./Mint")
const { assert, expect, should, Assertion } = require('chai')
const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

    const ids =[46,93,99,27,5]; 
    const prices =[ web3.utils.toWei("1"),
                    web3.utils.toWei("0.5"),
                    web3.utils.toWei("0.5",),
                    web3.utils.toWei("0.5"),
                    web3.utils.toWei("0.5")];
    
    const  maxAmounts = [50,25,25,25,0];
    const  dutchStartPrice = web3.utils.toWei("5");
    // = 5 ether;
    // const dutchDiscountRate = web3.utils.toWei("0.0001");
    const dutchDiscountRate = web3.utils.toWei("0.000005");

    // = 10000000000000000;
    // const DURATION = 200;
    const DURATION = 864000; //10 DAYS
    const nftInfo = ["46,1000000000000000000,50",
            "93,500000000000000000,25",
            "99,500000000000000000,25",
            "27,500000000000000000,25",
            "5,500000000000000000,0"]
    
    let _tokenURI=  "https://ipfs.io/ipfs/QmcDRWwXCE1LjvdESNZsmc75syTJP2zA8WW9SHEaCwEmkc/{id}.json";
    var tokenURI;
    let newTokenURI = "NewTokenURI{id}.json";
    let base_ext = ".json";
    const royaltyFees =5;
    const maxMintAmount = 20;
    let duration = time.duration.seconds(300); //300 seconds
    const d = new Date();


    // uint dutchStartPrice_,
    //             uint dutchDiscountRate_,
    //             uint DURATION_

 

contract('Mint Single and Mint Batch NFTs', async (accounts) => {
    const deployer = accounts[0]
    const beneficiary = accounts[6]
    const devAddress = accounts[1]
    const unauthorized = accounts[2]
    const sender1 = accounts[3]
    // const sender2 = accounts[5]
    // const sender3 = accounts[6]
     console.log("Deployer Addr:",deployer)
     console.log("Beneficiary Addr:",beneficiary)
     console.log("Developer Addr:",devAddress)
     console.log("Unauthorized Addr:",unauthorized)
     console.log("Sender1 Addr:",sender1)

    //  expect(BigNumber.from(100)).to.be.within(BigNumber.from(99), BigNumber.from(101));
    //  expect(BigNumber.from(100)).to.be.closeTo(BigNumber.from(101), 10);
         // expect(await token.balanceOf(wallet.address)).to.equal(993);

        //  await expect(token.transfer(walletTo.address, 7))
        //  .to.emit(token, 'Transfer')
        //  .withArgs(wallet.address, walletTo.address, 7);

    describe('Deployment', () => {

        let result, timeDeployed

        beforeEach(async () => {

            mint = await Mint.new(
                ids,
                prices,
                maxAmounts,
                // royaltyFees,
                maxMintAmount,
                dutchStartPrice,
                dutchDiscountRate,
                DURATION
            )
            await mint.setAddresses(beneficiary,devAddress,{from: deployer});
            // auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//time in seconds


        })

        it('Returns the contract owner', async () => {
            result = await mint.owner()
            // result.should.equal(NAME)
            // console.log(result)
            assert.equal(result,deployer)
        })

        it('Unauthorized account cannot set beneficiary and developer addresses', async () => {

        //  await expect(token.transfer(walletTo.address, 7))
        //  .to.emit(token, 'Transfer')
        //  .withArgs(wallet.address, walletTo.address, 7);

            await expect(mint.setAddresses(beneficiary,devAddress,{from: unauthorized})).to.be.rejected;

            // await mint.setAddresses(beneficiary,devAddress,{from: deployer})

            // result = await mint.getAddresses()
            // console.log(result.toString())
            // expect(result).to.equal({beneficiary,devAddress})


        })



        it('Only owner can set beneficiary and developer addresses', async () => {
            // result = await mint.owner()

            result = await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            result = await mint.getAddresses({from:deployer})
            console.log("Beneficiary Addr:",result[0].toString())
            console.log("Developer Addr",result[1].toString())
            assert.equal(result[0].toString(),beneficiary.toString())
            assert.equal(result[1].toString(),devAddress.toString())
        })

    

        it('Beneficiary not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: beneficiary,value: "1"})).to.be.rejected;
        })

        it('Developer not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: devAddress,value: "1"})).to.be.rejected;
        })



        it("Mint single, confirm that beneficiary and developer can withdraw their payouts", async () => {
            // await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            // result = (await web3.eth.getBalance(sender1));
            // console.log("Sender Account Balance:",web3.utils.fromWei(result)," ETH");
            //  result = await mint.getNFTInfo(46)
            //  console.log("Price of one NFT:",web3.utils.fromWei(result.price))
            //  console.log(web3.utils.fromWei(result.price))
            await (mint.mintSingle("46",1,{from: sender1,value:  web3.utils.toWei("1")}));
            result = await mint.balanceOf(sender1,"46");
            // console.log(result.toString());
            assert.equal(result,"1")
            result = await mint.pendingWithdrawal(beneficiary);
            assert.equal(result,"950000000000000000")
            result = await mint.pendingWithdrawal(devAddress);
            assert.equal(result,"50000000000000000");
            // result = await mint.pendingWithdrawal(beneficiary);
            // console.log("Beneficiary Withdraw balance:",result.toString())
            // result = await mint.pendingWithdrawal(devAddress);
            // console.log("DevAddress Withdraw balance:",result.toString())


        })




        it("Mint batch must fail, confirm that beneficiary and developer can withdraw their payouts.", async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            result = await web3.eth.getBalance(beneficiary)
            const benBal_t0 = web3.utils.toBN(result);
            console.log("Bent0 balance:",benBal_t0.toString())

            result = await web3.eth.getBalance(devAddress)
            const devBal_t0 = web3.utils.toBN(result);
            console.log("Dev T0 balance:",devBal_t0.toString())

            result = (await web3.eth.getBalance(sender1));
            // console.log("Sender Account Balance:",web3.utils.fromWei(result));
             result = await mint.getNFTInfo(46)
            //  console.log("Price of one NFT:",web3.utils.fromWei(result.price))
            //  console.log(web3.utils.fromWei(result.price))
            result = await mint.mintBatch(["46","99"],["1","2"],{from: sender1,value: web3.utils.toWei("2")});
            // execution cost	111496 gas 
            // console.log("The total proceeds = ",result)
            result = await mint.balanceOfBatch([sender1,sender1],[46,99]);
            // console.log(result.toString())
            expect(result.toString()).to.equal("1,2")

            result = await mint.pendingWithdrawal(beneficiary);
            // console.log("Beneficiary Withdraw balance:",result.toString())
            const benWithdraw = web3.utils.BN(result)
            console.log(`benWithdraw: ${benWithdraw}`)                       
            assert.equal(result.toString(),"1900000000000000000")

            result = await mint.pendingWithdrawal(devAddress);
            const devWithdraw = web3.utils.BN(result)
            console.log(`devWithdraw: ${devWithdraw}`)
            // console.log("DevAddress Withdraw balance:",result.toString())
            assert.equal(result.toString(),"100000000000000000");


            //Withdraw the amount for beneficiary and check if pending balance is zero
            await mint.withdraw({from: beneficiary, value: "1900000000000000000"})
            result = await mint.pendingWithdrawal(beneficiary)
            assert.equal(result.toString(),'0')

            //Withdraw the amount for developer and check if pending balance is zero
            await mint.withdraw({from: devAddress, value: "100000000000000000"})
            result = await mint.pendingWithdrawal(devAddress)
            assert.equal(result.toString(),'0')



        })


        it("Only Owner can change change the maxMintAmount", async () => {
            await mint.SetmaxMintAmount(5,{from:deployer});
            result = await mint.maxMintAmount()
            assert.equal(result.toString(),'5');

        })





        it('Check NFT Info per tokenID', async () => {
            for(let i =0; i< ids.length; i++) {
            result = await mint.getNFTInfo(ids[i])
            // console.log(result)
            expect(result.toString()).to.equal(nftInfo[i]);

            }
        })



        it('Test if the URI function returns the correct per token URI', async () => {
            for(let i =0; i< ids.length; i++) {
            result = await mint.uri(ids[i]);
            tokenURI = _tokenURI.replace("{id}",ids[i].toString());
            // console.log(`${result}, ${tokenURI}`);
            expect(result).to.equal(tokenURI.replace("{id}",ids[i].toString()));
        }
        })



        it("Set TokenURI test", async() => {

            for (let i=0;i< ids.length; i++) {
                await mint.setTokenURI(newTokenURI.slice(0,11),ids[i].toString());
                result = await mint.uri(ids[i].toString())
                expect(result).to.equal(newTokenURI.slice(0,11).concat(ids[i].toString().concat(".json")))
            }
        })
        



    })

    describe('Dutch Auction Tests', () => {

        let result, timeDeployed

        beforeEach(async () => {

            mint = await Mint.new(
                ids,
                prices,
                maxAmounts,
                // royaltyFees,
                maxMintAmount,
                dutchStartPrice,
                dutchDiscountRate,
                DURATION
            )
            await mint.setAddresses(beneficiary,devAddress,{from: deployer});
            timeDeployed = Math.round(d.getTime()/1000);//time in seconds
            auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//time in seconds
            console.log('StartTime:',timeDeployed,' EndTime:', auctionEndTime);

        })

        it('Check the dutch auction end time, make sure no one can bet after the end.', async () => {
            // result = await mint.getAuctionEndTime()
            // // result.should.equal(NAME)
            // console.log(result)
            result = await mint.currentBlockStamp();
            // console.log("Elapsed time before time increase:",result.toString())
            
            //Confirm that deployer,beneficiary and dev cannot bid 
            await expect(mint.bid("46",{from: deployer,value: "1"})).to.be.rejected;
            await expect(mint.bid("46",{from: beneficiary,value: "1"})).to.be.rejected;
            await expect(mint.bid("46",{from: devAddress,value: "1"})).to.be.rejected;

            //Wait a bit for price to reduce, get current price and then bid for the NFT to win it
            await time.increase(duration/2);
            result = await  mint.getDutchPrice({from: deployer})
            dutchPriceVal = web3.utils.toBN(result);
            console.log("Sender Paid ",dutchPriceVal.toString())
            await time.increase(86400);//Advance 1 day 
            
            //Sender1 bids for an NFT
            await mint.bid('46',{from: sender1, value: result.toString()})

            //check the balance of sender1
            result = await mint.balanceOf(sender1,"46")
            assert.equal(result.toString(),1)

            result = await mint.pendingWithdrawal(sender1);
            const senderVal = web3.utils.toBN(result);
            console.log("Sender1 refund amount:",senderVal.toString())                               
            // console.log(typeOf(senderVal))
            // assert.equal(result.toString(),"9347050000000000000")

            result = await mint.pendingWithdrawal(beneficiary);
            const beneficiaryVal = web3.utils.toBN(result);
            console.log("Beneficiary withdraw balance:",beneficiaryVal.toString())    
            // assert.equal(result.toString(),"9347050000000000000")       
           
            result = await mint.pendingWithdrawal(devAddress);
            const devVal = web3.utils.toBN(result);
            console.log("Developer withdraw balance:",devVal.toString())    

            //The sum of seller refund, the beneficiary pay and developer pay should equal the sent value
            // assert.equal(result.toString(),"491950000000000000");
            // console.log("Total Payouts:",senderVal.add(beneficiaryVal).add(devVal).toString())
            assert.equal(senderVal.add(beneficiaryVal).add(devVal).toString(),dutchPriceVal.toString());

            //Expire the contract and test if sender1 can still bid, it should fail
            await time.increase(duration);
            // await sleep(3000);//ms
            // result1 = await mint.currentBlockStamp();
            // console.log("Elapsed time after time increase",result1.toString())
            // result = await (mint.bid("46",{from: sender1,value: "1"}));
            await expect(mint.bid("46",{from: sender1,value: "1"})).to.be.rejected;
            // assert.equal(result,deployer)

         })




    })
       
})

    
