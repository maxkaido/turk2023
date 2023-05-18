import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const ElectionBet = await hre.ethers.getContractFactory("ElectionBet");

  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const CHAINLINK_ORACLE_ADDRESS = deployerAddress;
  const JOB_ID = "my-job-id";
  const FEE = hre.ethers.utils.parseEther("0.001");

  const electionBet = await ElectionBet.deploy(
    CHAINLINK_ORACLE_ADDRESS,
    JOB_ID,
    FEE
  );

  await electionBet.deployed();

  console.log("ElectionBet deployed to:", electionBet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
