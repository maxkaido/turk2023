import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const ElectionBetting = await hre.ethers.getContractFactory(
    "ElectionBetting"
  );

  const [deployer] = await hre.ethers.getSigners();
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
