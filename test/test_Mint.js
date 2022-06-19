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
    const DURATION = 24*3600*10; //10 DAYS
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

            await expect(mint.setAddresses(beneficiary,devAddress,{from: unauthorized})).to.be.rejected;

        })



        it('Only owner can set beneficiary and developer addresses', async () => {
            // result = await mint.owner()

            result = await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            result = await mint.getAddresses({from:deployer})
            // console.log("Beneficiary Addr:",result[0].toString())
            // console.log("Developer Addr",result[1].toString())
            assert.equal(result[0].toString(),beneficiary.toString())
            assert.equal(result[1].toString(),devAddress.toString())
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


    describe('Mint Single Test ', () => {

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

        it("Mint single, confirm that beneficiary and developer can withdraw their payouts", async () => {

            await (mint.mintSingle("46",1,{from: sender1,value:  web3.utils.toWei("1")}));
            result = await mint.balanceOf(sender1,"46");

            assert.equal(result,"1")
            result = await mint.pendingWithdrawal(beneficiary);
            assert.equal(result,"950000000000000000")
            result = await mint.pendingWithdrawal(devAddress);
            assert.equal(result,"50000000000000000");
       
            await (mint.mintSingle("46",1,{from: sender1,value:  web3.utils.toWei("1")}));
            result = await mint.balanceOf(sender1,"46");
            // console.log(result.toString());
            assert.equal(result,"2")
            result = await mint.pendingWithdrawal(beneficiary);
            assert.equal(result.toString(),"1900000000000000000")
            result = await mint.pendingWithdrawal(devAddress);
            assert.equal(result.toString(),"100000000000000000");

            await (mint.mintSingle("93",4,{from: sender1,value:  web3.utils.toWei("2")}));
            result = await mint.balanceOf(sender1,"93");
            assert.equal(result,"4")
            result = await mint.pendingWithdrawal(beneficiary);
            assert.equal(result.toString(),"3800000000000000000")
            result = await mint.pendingWithdrawal(devAddress);
            assert.equal(result.toString(),"200000000000000000");

            await mint.withdraw({from:beneficiary});
            result = await mint.pendingWithdrawal(beneficiary);
            assert.equal(result.toString(),'0')

            await mint.withdraw({from:devAddress});
            result = await mint.pendingWithdrawal(devAddress);
            assert.equal(result.toString(),'0')

        })
    })


    describe('Mint Batch Test ', () => {

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
        it("Mint batch must fail, confirm that beneficiary and developer can withdraw their payouts.", async () => {

            result = await mint.mintBatch([46,99],[1,2],{from: sender1,value: web3.utils.toWei("2")});
            result = await mint.balanceOfBatch([sender1,sender1],[46,99]);
            expect(result.toString()).to.equal("1,2")

            result = await mint.pendingWithdrawal(beneficiary);
            // console.log("Beneficiary Withdraw balance:",result.toString())               
            assert.equal(result.toString(),"1900000000000000000")

            result = await mint.pendingWithdrawal(devAddress);
            // console.log("DevAddress Withdraw balance:",result.toString())
            assert.equal(result.toString(),"100000000000000000");

            result = await mint.mintBatch(["46","99"],["1","2"],{from: sender1,value: web3.utils.toWei("2")});
            result = await mint.balanceOfBatch([sender1,sender1],[46,99]);
            expect(result.toString()).to.equal("2,4")

     
            result = await mint.pendingWithdrawal(beneficiary);
            // console.log("Beneficiary Withdraw balance:",result.toString())                 
            assert.equal(result.toString(),"3800000000000000000")

            result = await mint.pendingWithdrawal(devAddress);
            // console.log("DevAddress Withdraw balance:",result.toString())
            assert.equal(result.toString(),"200000000000000000");

        })
    })

    describe('Dutch Auction Bidding tests', () => {

        let result, timeDeployed
        var BN = web3.utils.BN;
        dutchStartPriceBN = new BN(dutchStartPrice)
        dutchDiscountRateBN = new BN(dutchDiscountRate)

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
         
        })

        it("Check total Auction duration", async() =>{
            oneDaySecs = 24*3600;
            days = 10;
            daysBN = new BN(days);
            oneDayBN = new BN(oneDaySecs); //seconds
            startedAt = await mint.startedAt();
            startedAtBN = new BN(startedAt)
            // console.log(startedAtBN.toString())

            endAt = await mint.getAuctionEndTime({from:deployer})
            endATBN = new BN(endAt)
            // console.log(endATBN.toString())
            durationBN = BN(endATBN.sub(startedAtBN).div(oneDayBN))
            // console.log(daysBN.toString(), durationBN.toString())

            assert.equal(daysBN.toString(),durationBN.toString())
            // assert.isTrue(daysBN==durationBN)

            // console.log(`Auction Duration = ${endATBN.sub(startedAtBN).div(oneDay)} days`)
        })



        it("Advance the time by one days without delay after accepting user bet", async() =>{
            oneDaySecs = 24*3600;
            days = 1;
            oneDayBN = new BN(oneDaySecs); //seconds
            result = await mint.startedAt();
            startedAtBN = new BN(result);
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);
            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));
            await time.increase(days*oneDaySecs);//Advance 1 day 
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);
            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));
            elapsedTimeBN_Days = new BN(currentBTS_BN.sub(startedAtBN).div(oneDayBN));
            assert.equal('1',elapsedTimeBN_Days)
            currentPriceBN = dutchStartPriceBN - (dutchDiscountRateBN*elapsedTimeBN);
            // console.log('Price after one day=', web3.utils.fromWei(currentPriceBN.toString()))        
            await mint.bid('46',{from: sender1, value: currentPriceBN})
            // senderRefundVal = await mint.pendingWithdrawal(sender1);
            //  senderRefundValBN = new BN(senderRefundVal);
            beneficiaryVal = await mint.pendingWithdrawal(beneficiary);
             beneficiaryValBN = new BN(beneficiaryVal);
            // console.log("User refund",(sender1ValBN.toString()))    
            devVal = await mint.pendingWithdrawal(devAddress);
            devValBN = new BN(devVal);
            totalPayoutsBN = beneficiaryValBN.add(devValBN)
            // console.log(totalPayoutsBN.toString(),beneficiaryValBN.toString(),devValBN.toString())
            assert.equal(totalPayoutsBN.toString(),currentPriceBN.toString())
            // assert.isTrue(totalPayoutsBN==currentPriceBN)

        })


        it("Advance the time by five days without delay after accepting user bet", async() =>{
            oneDaySecs = 24*3600;
            days = 5;
            oneDayBN = new BN(oneDaySecs); //seconds
            result = await mint.startedAt();
            startedAtBN = new BN(result);
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);
            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));
            await time.increase(days*oneDaySecs);//Advance 1 day 
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);
            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));
            elapsedTimeBN_Days = new BN(currentBTS_BN.sub(startedAtBN).div(oneDayBN));
            assert.equal('5',elapsedTimeBN_Days)
            currentPriceBN = dutchStartPriceBN - (dutchDiscountRateBN*elapsedTimeBN);
            // console.log('Price after one day=', web3.utils.fromWei(currentPriceBN.toString()));    
            await mint.bid('46',{from: sender1, value: currentPriceBN})

           senderRefundVal = await mint.pendingWithdrawal(sender1);
             senderRefundValBN = new BN(senderRefundVal);
             assert.equal(senderRefundValBN.toString(),'0')
            beneficiaryVal = await mint.pendingWithdrawal(beneficiary);
             beneficiaryValBN = new BN(beneficiaryVal);
            // console.log("User refund",(sender1ValBN.toString()))    
            devVal = await mint.pendingWithdrawal(devAddress);
            devValBN = new BN(devVal);
            totalPayoutsBN = beneficiaryValBN.add(devValBN)
            // console.log(totalPayoutsBN.toString(),beneficiaryValBN.toString(),devValBN.toString())
            // assert.equal(totalPayoutsBN.toString(),currentPriceBN.toString())          
            assert.isTrue(totalPayoutsBN==currentPriceBN)


        })

        it("Advance the time by one days with delay after accepting user bet", async() =>{
            oneDaySecs = 24*3600;
            days = 1;
            oneDayBN = new BN(oneDaySecs); //seconds
            result = await mint.startedAt();
            startedAtBN = new BN(result);
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);
            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));

            await time.increase(days*oneDaySecs);//Advance 1 day 
            currentBTS = await mint.currentBlockStamp();
            currentBTS_BN = new BN(currentBTS);

            elapsedTimeBN = new BN(currentBTS_BN.sub(startedAtBN));
            elapsedTimeBN_Days = new BN(currentBTS_BN.sub(startedAtBN).div(oneDayBN));
            assert.equal('1',elapsedTimeBN_Days)

            currentPriceBN = dutchStartPriceBN - (dutchDiscountRateBN*elapsedTimeBN);
    
            await time.increase(500);//Advance 500 seconds so user gets a refund 
            await mint.bid('46',{from: sender1, value: currentPriceBN})

            // // //Check user refund 

            senderRefundVal = await mint.pendingWithdrawal(sender1);
            senderRefundValBN = new BN(senderRefundVal);
            beneficiaryVal = await mint.pendingWithdrawal(beneficiary);
             beneficiaryValBN = new BN(beneficiaryVal);
            // console.log("User refund",(sender1ValBN.toString()))    
            devVal = await mint.pendingWithdrawal(devAddress);
            devValBN = new BN(devVal);
            totalPayoutsBN = senderRefundValBN.add(beneficiaryValBN).add(devValBN)
            assert.isTrue(totalPayoutsBN==currentPriceBN)
          
        })

       




    })
       
})

    
