const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("WikiWager", function () {
  let WikiWager, wikiWager, owner, addr1, addr2

  beforeEach(async function () {
    WikiWager = await ethers.getContractFactory("WikiWager")
    ;[owner, addr1, addr2, _] = await ethers.getSigners()
    wikiWager = await WikiWager.deploy(
      owner.address, // oracle
      10, // serviceFeePercentage
      owner.address, // serviceFeeWallet
      Math.floor(Date.now() / 1000) + 60 * 60, // bettingEndTime
      ["Candidate1", "Candidate2"] // candidateNames
    )
  })

  describe("makeBet", function () {
    it("Should make a bet", async function () {
      await wikiWager.connect(addr1).makeBet(0, { value: ethers.utils.parseEther("1") })
      const bet = await wikiWager.userBet(addr1.address)
      expect(bet.amount).to.equal(ethers.utils.parseEther("1"))
      expect(bet.candidateIndex).to.equal(0)
    })
  })

  describe("withdraw", function () {
    it("Should withdraw a bet", async function () {
      await wikiWager.connect(addr1).makeBet(0, { value: ethers.utils.parseEther("1") })
      await wikiWager.connect(addr1).withdraw()
      const bet = await wikiWager.userBet(addr1.address)
      expect(bet.withdrawn).to.be.true
    })
  })

  describe("calculateUserBet", function () {
    it("Should calculate the correct bet amount", async function () {
      await wikiWager.connect(addr1).makeBet(0, { value: ethers.utils.parseEther("1") })
      const userBetAmount = await wikiWager.calculateUserBet(addr1.address, 0)
      expect(userBetAmount).to.equal(ethers.utils.parseEther("1"))
    })
  })

  describe("fulfill", function () {
    it("Should handle the event result", async function () {
      await wikiWager.connect(owner).setLatestResponse("Candidate1")
      await wikiWager.connect(owner).fulfill()
      let confirmation = await wikiWager.eventConfirmation()
      expect(confirmation.count).to.equal(1)
      await wikiWager.connect(owner).setLatestResponse("Candidate2")
      await wikiWager.connect(owner).fulfill()
      confirmation = await wikiWager.eventConfirmation()
      expect(confirmation.count).to.equal(1)
      // Wait for the confirmation interval (5 minutes)
      await ethers.provider.send("evm_increaseTime", [5 * 60])
      await ethers.provider.send("evm_mine")
      await wikiWager.connect(owner).setLatestResponse("Candidate2")
      await wikiWager.connect(owner).fulfill()
      confirmation = await wikiWager.eventConfirmation()
      expect(confirmation.count).to.equal(2)
    })
  })

  describe("setServiceFeeWallet", function () {
    it("Should set the service fee wallet", async function () {
      await wikiWager.connect(owner).setServiceFeeWallet(addr2.address)
      const serviceFeeWallet = await wikiWager.serviceFeeWallet()
      expect(serviceFeeWallet).to.equal(addr2.address)
    })
  })

  describe("claimWinnings", function () {
    it("Should claim winnings", async function () {
      await wikiWager.connect(addr1).makeBet(0, { value: ethers.utils.parseEther("1") })
      await wikiWager.connect(addr2).makeBet(1, { value: ethers.utils.parseEther("1") })
      await wikiWager.connect(owner).setLatestResponse("Candidate1")
      await wikiWager.connect(owner).fulfill()

      // Wait for the confirmation interval (5 minutes)
      await ethers.provider.send("evm_increaseTime", [5 * 60])
      await ethers.provider.send("evm_mine")

      await wikiWager.connect(owner).setLatestResponse("Candidate1")
      await wikiWager.connect(owner).fulfill()

      const userWinningsBefore = await wikiWager.userWinnings(addr1.address)
      console.log("User winnings before claiming:", userWinningsBefore.toString())

      await wikiWager.connect(addr1).claimWinnings()

      const userWinningsAfter = await wikiWager.userWinnings(addr1.address)
      console.log("User winnings after claiming:", userWinningsAfter.toString())
      const contractBalance = await ethers.provider.getBalance(wikiWager.address)
      console.log("Contract balance:", contractBalance.toString())
    })
  })
})
