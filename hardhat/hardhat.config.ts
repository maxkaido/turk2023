import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
// solidity: "0.8.17",
// };

// export default config;
import * as dotenv from "dotenv";

// import { HardhatUserConfig, task } from "hardhat/config";
// import "@nomiclabs/hardhat-etherscan";
// import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
// import "@nomiclabs/hardhat-ethers";
// import "hardhat-deploy";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fin: {
      url: "http://localhost:14561",
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: "0x31422E72FB5371cd48c99df43A09Fb30Cc915338", // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      ropsten: "0x517Cb67a73d3BC4C39b45E904915131fC3087953", // but for rinkeby it will be a specific address
    },
    depositWallet: {
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
      1: "0x0AdE4eDBC12DC079D4fFDA37B8Df4a344bc2A5a3", // on the mainnet the gnosis multisig
      ropsten: "0x906233EaaFBbF5D8d4b92f13D380a03699D283Dc",
    },
  },
};

export default config;
