require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
//require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20"    // Update this to match the OpenZeppelin contracts
      },
      {
        version: "0.8.27"    // Optionally add other versions for compatibility with other contracts
      }
    ]
  },
  networks: {
    besu: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: ["8d736906ec7a1cae1ac025eb320f06effc63cee13fa4c07fc5341b9b21bdc032"],
      gas: 4000000,
      gasPrice: 0
    }
  }
};
