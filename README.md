# DutchAndMint
Dutch auction and minting of ERC1155 NFTs
truffle init
npm install 




==========DEPLOY ON POLYGON MAIN NET =========
truffle compile -all --config truffle-config.polygon.js --network polygon_infura_mainnet
truffle migrate --config truffle-config.polygon.js --network polygon_infura_mainnet
truffle run verify Mint --network polygon_infura_mainnet --config truffle-config.polygon.js


2_deployMint.js
===============

   Deploying 'Mint'
   ----------------
   > transaction hash:    0x5115f4d5909af73d9293b5c244bc08a37098ed14f2e574a37981a7a8cbb79d15
   > Blocks: 3            Seconds: 4
   > contract address:    0xcc8940F4594d1D9F98D6E4A256126fE3F213DC56
   > block number:        29734710
   > block timestamp:     1655600849
   > account:             0xC5AE1dd3c4bBC7bD1f7260A4AC1758eb7c38C021
   > balance:             817.396181608623212325
   > gas used:            4660552 (0x471d48)
   > gas price:           11000 gwei
   > value sent:          0 ETH
   > total cost:          51.266072 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 2 (block: 29734713)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           51.266072 ETH


Contract Address: 0xcc8940F4594d1D9F98D6E4A256126fE3F213DC56
https://polygonscan.com/address/0xcc8940F4594d1D9F98D6E4A256126fE3F213DC56#code=

Verified Contract Address:
Pass - Verified: https://polygonscan.com/address/0xcc8940F4594d1D9F98D6E4A256126fE3F213DC56#code




========================






==========DEPLOY ON LOCAL GANACHE =========
truffle compile --config truffle-config.polygon.js -all
truffle migrate --config truffle-config.polygon.js --network ganache
truffle test test/test_Mint.js --config truffle-config.polygon.js --network ganache



==========DEPLOY ON POLYGON TEST NET =========
truffle compile -all --config truffle-config.polygon.js --network polygon_infura_testnet
truffle migrate --config truffle-config.polygon.js --network polygon_infura_testnet
truffle run verify Mint --network polygon_infura_testnet --config truffle-config.polygon.js


Contract Address: 0x128690Ccc2fC4291250cB65BEff8e2281426781b
Verified Contract Address:
Pass - Verified: https://mumbai.polygonscan.com/address/0x128690Ccc2fC4291250cB65BEff8e2281426781b#code


OpenSea Collection address:
https://testnets.opensea.io/collection/unidentified-contract-ixanvwtvqm

DEPLOY#2: To test minting and dutch
truffle compile -all --config truffle-config.polygon.js --network polygon_infura_testnet
truffle migrate --config truffle-config.polygon.js --network polygon_infura_testnet --reset
truffle run verify Mint --network polygon_infura_testnet --config truffle-config.polygon.js
//Redeployed on the test net with smaller prices of NFTs for testing purposes

Contract Address: 0x58Aa8aB78a8d527F70b58AeC3b65173b6901636a
Verified Contract Address:
https://mumbai.polygonscan.com/address/0x58Aa8aB78a8d527F70b58AeC3b65173b6901636a#code


PolygonBrige and Swap link:
https://wallet.polygon.technology/



Minted NFTs on Opensea's test net.
https://testnets.opensea.io/collection/motopunks-e5pkxqcdng

Mint events history:
https://mumbai.polygonscan.com/address/0xa8F466fAFb12EcfE78e122EC8F7E4669d0Aa8C08#events


Polygon Matic Token Faucet:
https://faucet.polygon.technology/


OpenSea Testnet:
https://testnets.opensea.io/


IPFS Install:
https://docs.ipfs.io/install/command-line/#official-distributions


OpenZeppelin ERC271 Contracts:
https://github.com/OpenZeppelin/openzeppelin-contracts

Matic.js
https://maticnetwork.github.io/matic.js/docs/get-started

Infura Project ID:
https://infura.io/


Polyscan Mumbai:
https://mumbai.polygonscan.com/



//===========================
Adding Polygon Mainnet and test net to Metamask
https://docs.polygon.technology/docs/develop/network-details/network/


If the above doesn't work, then find your network in the following link:
https://chainlist.org/
Search for your network and add it






