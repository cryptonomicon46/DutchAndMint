const Mint = artifacts.require("./Mint")
const { assert, expect, should, Assertion } = require('chai')
const { expectRevert, time } = require('@openzeppelin/test-helpers');


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
    let duration2 = time.duration.seconds(432000); //5 days

    // let duration = time.duration
    const d = new Date();


contract('Mint Single and Mint Batch NFTs', async (accounts) => {
    [deployer,beneficiary,devAddress,unauthorized,sender1] = accounts;


    // describe('Deployment', () => {

    //     let result, timeDeployed

    //     beforeEach(async () => {

    //         mint = await Mint.new(
    //             ids,
    //             prices,
    //             maxAmounts,
    //             // royaltyFees,
    //             maxMintAmount,
    //             dutchStartPrice,
    //             dutchDiscountRate,
    //             DURATION
    //         )
    //         await mint.setAddresses(beneficiary,devAddress,{from: deployer});
    //         // auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//time in seconds


    //     })

    //     it('Returns the contract owner', async () => {
    //         result = await mint.owner()
    //         // result.should.equal(NAME)
    //         // console.log(result)
    //         assert.equal(result,deployer)
    //     })

    //     it('Unauthorized account cannot set beneficiary and developer addresses', async () => {

    //         await expect(mint.setAddresses(beneficiary,devAddress,{from: unauthorized})).to.be.rejected;

    //     })



    //     it('Only owner can set beneficiary and developer addresses', async () => {
    //         // result = await mint.owner()

    //         result = await mint.setAddresses(beneficiary,devAddress,{from: deployer})
    //         result = await mint.getAddresses({from:deployer})
    //         // console.log("Beneficiary Addr:",result[0].toString())
    //         // console.log("Developer Addr",result[1].toString())
    //         assert.equal(result[0].toString(),beneficiary.toString())
    //         assert.equal(result[1].toString(),devAddress.toString())
    //     })

    
        


    //     it("Only Owner can change change the maxMintAmount", async () => {
    //         await mint.SetmaxMintAmount(5,{from:deployer});
    //         result = await mint.maxMintAmount()
    //         assert.equal(result.toString(),'5');

    //     })





    //     it('Check NFT Info per tokenID', async () => {
    //         for(let i =0; i< ids.length; i++) {
    //         result = await mint.getNFTInfo(ids[i])
    //         // console.log(result)
    //         expect(result.toString()).to.equal(nftInfo[i]);

    //         }
    //     })



    //     it('Test if the URI function returns the correct per token URI', async () => {
    //         for(let i =0; i< ids.length; i++) {
    //         result = await mint.uri(ids[i]);
    //         tokenURI = _tokenURI.replace("{id}",ids[i].toString());
    //         // console.log(`${result}, ${tokenURI}`);
    //         expect(result).to.equal(tokenURI.replace("{id}",ids[i].toString()));
    //     }
    //     })



    //     it("Set TokenURI test", async() => {

    //         for (let i=0;i< ids.length; i++) {
    //             await mint.setTokenURI(newTokenURI.slice(0,11),ids[i].toString());
    //             result = await mint.uri(ids[i].toString())
    //             expect(result).to.equal(newTokenURI.slice(0,11).concat(ids[i].toString().concat(".json")))
    //         }
    //     })
        



    // })


    // describe('Mint Single Test ', () => {

    //     let result, timeDeployed

    //     beforeEach(async () => {

    //         mint = await Mint.new(
    //             ids,
    //             prices,
    //             maxAmounts,
    //             // royaltyFees,
    //             maxMintAmount,
    //             dutchStartPrice,
    //             dutchDiscountRate,
    //             DURATION
    //         )
    //         await mint.setAddresses(beneficiary,devAddress,{from: deployer});
    //         // auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//time in seconds


    //     })

    //     it("Mint single, confirm that beneficiary and developer can withdraw their payouts", async () => {

    //         await (mint.mintSingle("46",1,{from: sender1,value:  web3.utils.toWei("1")}));
    //         result = await mint.balanceOf(sender1,"46");

    //         assert.equal(result,"1")
    //         result = await mint.pendingWithdrawal(beneficiary);
    //         assert.equal(result,"950000000000000000")
    //         result = await mint.pendingWithdrawal(devAddress);
    //         assert.equal(result,"50000000000000000");
       
    //         await (mint.mintSingle("46",1,{from: sender1,value:  web3.utils.toWei("1")}));
    //         result = await mint.balanceOf(sender1,"46");
    //         // console.log(result.toString());
    //         assert.equal(result,"2")
    //         result = await mint.pendingWithdrawal(beneficiary);
    //         assert.equal(result.toString(),"1900000000000000000")
    //         result = await mint.pendingWithdrawal(devAddress);
    //         assert.equal(result.toString(),"100000000000000000");

    //         await (mint.mintSingle("93",4,{from: sender1,value:  web3.utils.toWei("2")}));
    //         result = await mint.balanceOf(sender1,"93");
    //         assert.equal(result,"4")
    //         result = await mint.pendingWithdrawal(beneficiary);
    //         assert.equal(result.toString(),"3800000000000000000")
    //         result = await mint.pendingWithdrawal(devAddress);
    //         assert.equal(result.toString(),"200000000000000000");

    //         await mint.withdraw({from:beneficiary});
    //         result = await mint.pendingWithdrawal(beneficiary);
    //         assert.equal(result.toString(),'0')

    //         await mint.withdraw({from:devAddress});
    //         result = await mint.pendingWithdrawal(devAddress);
    //         assert.equal(result.toString(),'0')

    //     })
    // })


    // describe('Mint Batch Test ', () => {

    //     let result, timeDeployed

    //     beforeEach(async () => {

    //         mint = await Mint.new(
    //             ids,
    //             prices,
    //             maxAmounts,
    //             // royaltyFees,
    //             maxMintAmount,
    //             dutchStartPrice,
    //             dutchDiscountRate,
    //             DURATION
    //         )
    //         await mint.setAddresses(beneficiary,devAddress,{from: deployer});
    //         // auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//time in seconds


    //     })
    //     it("Mint batch must fail, confirm that beneficiary and developer can withdraw their payouts.", async () => {

    //         result = await mint.mintBatch([46,99],[1,2],{from: sender1,value: web3.utils.toWei("2")});
    //         result = await mint.balanceOfBatch([sender1,sender1],[46,99]);
    //         expect(result.toString()).to.equal("1,2")

    //         result = await mint.pendingWithdrawal(beneficiary);
    //         // console.log("Beneficiary Withdraw balance:",result.toString())               
    //         assert.equal(result.toString(),"1900000000000000000")

    //         result = await mint.pendingWithdrawal(devAddress);
    //         // console.log("DevAddress Withdraw balance:",result.toString())
    //         assert.equal(result.toString(),"100000000000000000");

    //         result = await mint.mintBatch(["46","99"],["1","2"],{from: sender1,value: web3.utils.toWei("2")});
    //         result = await mint.balanceOfBatch([sender1,sender1],[46,99]);
    //         expect(result.toString()).to.equal("2,4")

     
    //         result = await mint.pendingWithdrawal(beneficiary);
    //         // console.log("Beneficiary Withdraw balance:",result.toString())                 
    //         assert.equal(result.toString(),"3800000000000000000")

    //         result = await mint.pendingWithdrawal(devAddress);
    //         // console.log("DevAddress Withdraw balance:",result.toString())
    //         assert.equal(result.toString(),"200000000000000000");

    //     })
    // })


    describe('Dutch Auction', () => {

        let result, timeDeployed
        var BN = web3.utils.BN;

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
         
            // result.should.equal(NAME)
            // console.log(result.toString())s



            // result = await mint.getAuctionEndTime()
            // let endAtBN = new BN(result)
            // console.log(endAtBN);

            // timeDeployed = Math.round(d.getTime()/1000);//time in seconds


            // td = new BN(timeDeployed);
            // auctionEndTime = Math.round(d.getTime()/1000) + DURATION ;//seconds
            // auctionEndTimeBN= new BN(auctionEndTime);//seconds
 
            // console.log('StartTime:',timeDeployed,' EndTime:', auctionEndTime);
            // console.log(`Auction Duraction = ${resultBN.sub(td).div(oneDay)} days`)

        })

        it("Check Auction duration", async() =>{
            oneDay = new BN(24*3600); //seconds
            result = await mint.startedAt();
            // console.log(result.toString())
            startedAtBN = new BN(result);
   

            result = await mint.getAuctionEndTime()
            endATBN = new BN(result)
            duration = new BN(endATBN.sub(startedAtBN).div(oneDay))
            
            assert.equal('10',duration)
            // console.log(`Auction Duration = ${endATBN.sub(startedAtBN).div(oneDay)} days`)
        })

        it('Dutch auction tests.', async () => {
            // result = await mint.getAuctionEndTime()
            // // result.should.equal(NAME)
            // console.log(result.toString())


            //Advance time by 300 seconds
            // await time.increase(duration);
            // result = await mint.currentBlockStamp();
            // // currentBTS = web3.utils.toBN(result);
            // currentBTS = BN(result);
            // console.log(`Current Time ${getElapsedTime}`);

            // // console.log("Elapsed time before time increase:",result.toString())
            // let getElapsedTime = currentBTS.sub(td);
            // console.log(`Elapsed Time ${currentBTS}`);

            // let currentPrice = dutchStartPrice - (dutchDiscountRate*getElapsedTime());

            // currentPriceVal = web3.utils.toBN(currentPrice);
            // result = await  mint.getDutchPrice({from: deployer})
            // dutchPriceVal = web3.utils.toBN(result);

            // assert.equal(currentPrice.toString(),result.toString());

            // // console.log("Sender Paid ",dutchPriceVal.toString())
            // await time.increase(86400);//Advance 1 day 
            
            // //Sender1 bids for an NFT
            // await mint.bid('46',{from: sender1, value: result.toString()})

            // //check the balance of sender1
            // result = await mint.balanceOf(sender1,"46")
            // assert.equal(result.toString(),1)

            // result = await mint.pendingWithdrawal(sender1);
            // const senderVal = web3.utils.toBN(result);
            // // console.log("Sender1 refund amount:",senderVal.toString())                               
            // // console.log(typeOf(senderVal))
            // // assert.equal(result.toString(),"9347050000000000000")

            // result = await mint.pendingWithdrawal(beneficiary);
            // const beneficiaryVal = web3.utils.toBN(result);
            // // console.log("Beneficiary withdraw balance:",beneficiaryVal.toString())    
            // // assert.equal(result.toString(),"9347050000000000000")       
           
            // result = await mint.pendingWithdrawal(devAddress);
            // const devVal = web3.utils.toBN(result);
            // // console.log("Developer withdraw balance:",devVal.toString())    

            // //The sum of seller refund, the beneficiary pay and developer pay should equal the sent value
            // // assert.equal(result.toString(),"491950000000000000");
            // // console.log("Total Payouts:",senderVal.add(beneficiaryVal).add(devVal).toString())
            // assert.equal(senderVal.add(beneficiaryVal).add(devVal).toString(),dutchPriceVal.toString());

            // //Expire the contract and test if sender1 can still bid, it should fail
            // await time.increase(duration);
            // // await sleep(3000);//ms
            // // result1 = await mint.currentBlockStamp();
            // // console.log("Elapsed time after time increase",result1.toString())
            // // result = await (mint.bid("46",{from: sender1,value: "1"}));
            // await expect(mint.bid("46",{from: sender1,value: "1"})).to.be.rejected;
            // // assert.equal(result,deployer)

         })




    })
       
})

    
