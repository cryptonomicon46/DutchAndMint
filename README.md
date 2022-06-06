# DutchAndMint
Dutch auction and minting of ERC1155 NFTs
truffle init
npm install 
truffle compile --config truffle-config.polygon.js -all
truffle migrate --config truffle-config.polygon.js --network ganache

truffle test test/test_Mint.js --config truffle-config.polygon.js --network ganache
