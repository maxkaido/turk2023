import { ethers } from "hardhat";
const hre = require("hardhat");
import axios from "axios";

async function main() {
  // We get the contract to deploy
  const ElectionBetting = await hre.ethers.getContractFactory(
    "ElectionBetting"
  );

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const deployerAddress = await deployer.getAddress();
  const CHAINLINK_ORACLE_ADDRESS = deployerAddress;
  const JOB_ID = "my-job-id";
  const FEE = hre.ethers.utils.parseEther("0.001");
  const SERVICE_FEE_PERCENTAGE = 1;
  const SERVICE_FEE_WALLET = deployerAddress;
  const BETTING_END_TIME = 1685221200;

  const electionBetting = await ElectionBetting.deploy(
    CHAINLINK_ORACLE_ADDRESS,
    JOB_ID,
    FEE,
    SERVICE_FEE_PERCENTAGE,
    SERVICE_FEE_WALLET,
    BETTING_END_TIME
  );

  await electionBetting.deployed();

  // Get the gas price from an API
  const gasPriceResponse = await axios.get(
    "https://api.etherscan.io/api?module=gastracker&action=gasoracle"
  );
  const gasPrice = gasPriceResponse.data.result.ProposeGasPrice;

  // Get the Ether to USD conversion rate from an API
  const etherPriceResponse = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const etherPrice = etherPriceResponse.data.ethereum.usd;

  // Estimate the deployment gas cost
  const estimate = await ethers.provider.estimateGas({
    data: electionBetting.bytecode,
  });

  // Convert the gas cost to wei
  const gasCostInWei = estimate.mul(gasPrice);

  // Convert the gas cost from wei to Ether
  const gasCostInEther = ethers.utils.formatEther(gasCostInWei);

  // Calculate the deployment cost in USD
  const deploymentCostInUSD = parseFloat(gasCostInEther) * etherPrice;

  console.log(`Estimated deployment cost: ${deploymentCostInUSD} USD`);
  console.log("ElectionBetting deployed to:", electionBetting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
