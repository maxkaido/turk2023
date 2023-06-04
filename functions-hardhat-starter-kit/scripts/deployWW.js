const { ethers, upgrades } = require("hardhat")

async function main() {
  const WikiWager = await ethers.getContractFactory("WikiWager")
  console.log("Deploying WikiWager...")

  // Set the constructor arguments
  const oracle = "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC"
  const serviceFeePercentage = 2 // Set your desired service fee percentage
  const serviceFeeWallet = "0xaE96840F804d6Ce7D8D70621E38BFfeaDEdADAd4"
  const bettingEndTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 1 day from deploy time
  const candidateNames = ["Erdogan", "Kemal"] // Set your desired candidate names

  console.table({ oracle, serviceFeePercentage, serviceFeeWallet, bettingEndTime, candidateNames })

  // Deploy the contract
  const wikiWager = await WikiWager.deploy(
    oracle,
    serviceFeePercentage,
    serviceFeeWallet,
    bettingEndTime,
    candidateNames
  )

  await wikiWager.deployed()
  console.log("WikiWager deployed to:", wikiWager.address)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
