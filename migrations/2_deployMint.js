const { default: Web3 } = require("web3");

const Mint = artifacts.require("Mint");

function tokens(n) {
    return Web3.utils.toWei(n,'ether');
}


const ids =[46,93,99,27,5]; 
// const prices =[ web3.utils.toWei("1"),
//                 web3.utils.toWei("0.5"),
//                 web3.utils.toWei("0.5",),
//                 web3.utils.toWei("0.5"),
//                 web3.utils.toWei("0.5")
//             ];

    const prices =[ web3.utils.toWei("0.001"),
        web3.utils.toWei("0.0005"),
        web3.utils.toWei("0.0005",),
        web3.utils.toWei("0.0005"),
        web3.utils.toWei("0.0005")
    ];

const  maxAmounts = [50,25,25,25,0];

// const royaltyFees = 5;
const maxMintamount = 10;

const  dutchStartPrice = web3.utils.toWei("5");
// = 5 ether;
// const dutchDiscountRate = web3.utils.toWei("0.01");
const dutchDiscountRate = web3.utils.toWei('0.000005');

// = 10000000000000000;
const DURATION = 864000; //10 days
module.exports = async function (deployer) {
    deployer.deploy(Mint,
        ids,
        prices,
        maxAmounts,
        // royaltyFees,
        maxMintamount,
        dutchStartPrice,
        dutchDiscountRate,
        DURATION
        // {gas: 5000000, gasPrice: 500000000}
        );
}

