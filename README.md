# DutchAndMint
Dutch auction and minting of ERC1155 NFTs
truffle init
npm install 

==========DEPLOY ON LOCAL GANACHE =========
truffle compile --config truffle-config.polygon.js -all
truffle migrate --config truffle-config.polygon.js --network ganache
truffle test test/test_Mint.js --config truffle-config.polygon.js --network ganache



==========DEPLOY ON POLYGON TEST NET =========
truffle compile -all --config truffle-config.polygon.js --network polygon_infura_testnet
truffle migrate --config truffle-config.polygon.js --network polygon_infura_testnet
truffle run verify Mint --network polygon_infura_testnet --config truffle-config.polygon.js

   Deploying 'Mint'
   ----------------
   > transaction hash:    0xaaaacd86b55fa68d712f815cc0a0c1ce3a5573a9cda8167411cbf504e1d3f1c3
   > Blocks: 0            Seconds: 4
   > contract address:    0x128690Ccc2fC4291250cB65BEff8e2281426781b
   > block number:        26632004
   > block timestamp:     1654547027
   > account:             0xC5AE1dd3c4bBC7bD1f7260A4AC1758eb7c38C021
   > balance:             0.227087484663619403
   > gas used:            4597640 (0x462788)
   > gas price:           2.500000009 gwei
   > value sent:          0 ETH
   > total cost:          0.01149410004137876 ETH

Verified Contract Address:
Pass - Verified: https://mumbai.polygonscan.com/address/0x128690Ccc2fC4291250cB65BEff8e2281426781b#code

OpenSea link:

========================



==========DEPLOY ON POLYGON MAIN NET =========
truffle compile -all --config truffle-config.polygon.js --network polygon_infura_mainnet
truffle run verify Mint --network polygon_infura_mainnet --config truffle-config.polygon.js
truffle migrate --config truffle-config.polygon.js --network polygon_infura_mainnet

Verified Contract Address:
OpenSea link:

========================


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