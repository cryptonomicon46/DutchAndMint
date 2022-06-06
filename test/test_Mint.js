
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
    const beneficiary = accounts[1]
    const devAddress = accounts[2]
    const unauthorized = accounts[3]
    const sender1 = accounts[4]
    const sender2 = accounts[5]
    const sender3 = accounts[6]
     console.log(deployer)
     console.log(beneficiary)
     console.log(devAddress)
     console.log(unauthorized)
     console.log(sender1)

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

        it('Only owner can set beneficiary and developer addresses', async () => {

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
            // console.log(result);

            // {
            //     tx: '0x070271242425649485e227b623a0db61130f08304bbe04e1b34097468d8c9ec5',
            //     receipt: {
            //       transactionHash: '0x070271242425649485e227b623a0db61130f08304bbe04e1b34097468d8c9ec5',
            //       transactionIndex: 0,
            //       blockHash: '0x362c6d8a86cabd8494b51f63b27a6615c20ab1e95de311cd2f14501f07a887d5',
            //       blockNumber: 608,
            //       from: '0x7d1b767ff5bdfb3041eed143659115476368b5f8',
            //       to: '0x49a7f7ace8dc5f7b49f7ace42cb84b9c647fed3c',
            //       gasUsed: 27991,
            //       cumulativeGasUsed: 27991,
            //       contractAddress: null,
            //       logs: [ [Object] ],
            //       status: true,
            //       logsBloom: '0x00000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            //       rawLogs: [ [Object] ]
            //     },
            //     logs: [
            //       {
            //         logIndex: 0,
            //         transactionIndex: 0,
            //         transactionHash: '0x070271242425649485e227b623a0db61130f08304bbe04e1b34097468d8c9ec5',
            //         blockHash: '0x362c6d8a86cabd8494b51f63b27a6615c20ab1e95de311cd2f14501f07a887d5',
            //         blockNumber: 608,
            //         address: '0x49A7f7acE8dC5f7b49F7Ace42Cb84b9C647Fed3c',
            //         type: 'mined',
            //         id: 'log_9749dede',
            //         event: 'AddressesSet',
            //         args: [Result]
            //       }
            //     ]
            //   }

        //  await expect(mint.setAddresses(beneficiary,devAddress,{from: deployer}))
        //  .to.emit('AddressesSet')
        //  .withArgs(beneficiary,devAddress);


        //        await expect(token.transfer(walletTo.address, 7))
        //  .to.emit(token, 'Transfer')
        //  .withArgs(wallet.address, walletTo.address, 7);

            // AddressesSet(beneficiary, devAddress)
            result = await mint.getAddresses({from:deployer})
            console.log("Beneficiary Addr:",result[0].toString())
            console.log("Developer Addr",result[1].toString())
            assert.equal(result[0].toString(),beneficiary.toString())
            assert.equal(result[1].toString(),devAddress.toString())



         

            // expect([result[0],result[1]]).to.equal([beneficiary,devAddress])


        })


        it('Beneficiary not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: beneficiary,value: "1"})).to.be.rejected;
        })

        it('Developer not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: devAddress,value: "1"})).to.be.rejected;
        })



        it("Mint single, pay beneficiary and developer", async () => {
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




        it("Mint batch must fail, pay beneficiary and developer", async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
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
                                            
            assert.equal(result.toString(),"1900000000000000000")
            result = await mint.pendingWithdrawal(devAddress);
            // console.log("DevAddress Withdraw balance:",result.toString())
            assert.equal(result.toString(),"100000000000000000");


        })


        it('Beneficiary not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: beneficiary,value: "1"})).to.be.rejected;
        })

        it('Developer not allowed to mint', async () => {
            await mint.setAddresses(beneficiary,devAddress,{from: deployer})
            await expect(mint.mintSingle("46",1,{from: devAddress,value: "1"})).to.be.rejected;
        })



        it('Check NFT Info per tokenID', async () => {
            for(let i =0; i< ids.length; i++) {
            result = await mint.getNFTInfo(ids[i])
            // console.log(result)
            expect(result.toString()).to.equal(nftInfo[i])

        
        }



            it('Check tokenURIs per tokenID', async () => {
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



        // it('Allow sender to dutch until the end of the duration, check NFT balance and platform fees', async () => {
        //     // result = await mint.getAuctionEndTime()
        //     // // result.should.equal(NAME)
        //     // console.log(result)

        //     // // await time.increase(duration);

        //     // assert.equal(result,deployer)
        // })


        // it('Dutch auction  below discounted price and fails', async () => {
        //     // result = await mint.getAuctionEndTime()
        //     // // result.should.equal(NAME)
        //     // console.log(result)
        //     // expect(await mint.bid('46',{from: sender1})
        //     // await time.increase(duration);

        //     // assert.equal(result,deployer)
        // })


        // it('Dutch auction above  discounted price, win an NFT, get refund on excess payment, pay dev and beneficiary', async () => {
        //     // result = await mint.getAuctionEndTime()
        //     // // result.should.equal(NAME)
        //     // console.log(result)

        //     // // await time.increase(duration);

        //     // assert.equal(result,deployer)
        // })







})
       
    })

    
})