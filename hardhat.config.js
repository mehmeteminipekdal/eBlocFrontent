require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
      sepolia: {
        allowUnlimitedContractSize: true,
        gas: 2100000,
        gasPrice: 8000000000,
        gasLimit: 5000000,
      }
  }
};
