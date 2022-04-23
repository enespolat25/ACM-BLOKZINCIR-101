require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // polygon testnet
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["8e468478fdf9b2d888c2d9cb9a34282cb80aa340393133020b8e3dfebc904e9c"] // your wallet private key
    },
    //polygon mainnet
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: ["8e468478fdf9b2d888c2d9cb9a34282cb80aa340393133020b8e3dfebc904e9c"]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
