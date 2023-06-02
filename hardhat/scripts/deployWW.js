const hre = require("hardhat");

async function main() {
  // Retrieve contract factories
  const WikiWager = await hre.ethers.getContractFactory("WikiWager");

  const [deployer] = await hre.ethers.getSigners();

  // Set the parameters for your contract
  const oracle = deployer.address;
  const jobId = "YourJobId";
  const fee = hre.ethers.utils.parseEther("1");
  const serviceFeePercentage = 1;
  const serviceFeeWallet = deployer.address;
  const bettingEndTime = Math.floor(new Date().getTime() / 1000) + 3600; // 1 hour from now
  const candidateNames = ["Candidate1", "Candidate2", "Candidate3"];

  // Deploy WikiWager contract
  const wikiWager = await WikiWager.deploy(
    oracle,
    jobId,
    fee,
    serviceFeePercentage,
    serviceFeeWallet,
    bettingEndTime,
    candidateNames
  );

  // Wait for the contract to be deployed
  await wikiWager.deployed();

  console.log("WikiWager contract deployed to:", wikiWager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
