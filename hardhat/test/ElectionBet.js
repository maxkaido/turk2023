const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ElectionBet", function () {
  let ElectionBet, electionBet, owner, addr1, addr2;
  let linkTokenAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
  let oracleAddress = "0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e";
  let jobId = "0xabc";
  let fee = ethers.utils.parseEther("0.1");

  beforeEach(async function () {
    ElectionBet = await ethers.getContractFactory("ElectionBet");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    electionBet = await ElectionBet.deploy(oracleAddress, jobId, fee);
    await electionBet.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right oracle and jobId", async function () {
      expect(await electionBet.oracle()).to.equal(oracleAddress);
      expect(await electionBet.jobId()).to.equal(jobId);
    });
  });

  describe("Betting", function () {
    it("Should allow making a bet and emit an event", async function () {
      await electionBet
        .connect(addr1)
        .makeBet("Candidate A", { value: ethers.utils.parseEther("1") });
      expect(await electionBet.totalBets("Candidate A")).to.equal(
        ethers.utils.parseEther("1")
      );
      await expect(
        electionBet
          .connect(addr1)
          .makeBet("Candidate A", { value: ethers.utils.parseEther("1") })
      )
        .to.emit(electionBet, "BetMade")
        .withArgs(addr1.address, ethers.utils.parseEther("1"), "Candidate A");
    });

    it("Should not allow making a bet without sending ether", async function () {
      await expect(
        electionBet.connect(addr1).makeBet("Candidate A")
      ).to.be.revertedWith("No ether sent");
    });
  });

  describe("Getting Election Results", function () {
    it("Should get election result", async function () {
      let tx = await (await electionBet.getElectionResult()).wait();
      let requestId = tx.events[0].args[0];
      expect(requestId).to.exist;
    });

    it("Should allow only the oracle to fulfill the election result", async function () {
      let tx = await (await electionBet.getElectionResult()).wait();
      let requestId = tx.events[0].args[0];

      // As non-oracle
      await expect(
        electionBet.connect(addr1).fulfill(requestId, "Candidate A")
      ).to.be.revertedWith("Not authorized");

      // As oracle
      await expect(electionBet.fulfill(requestId, "Candidate A"))
        .to.emit(electionBet, "ElectionResultReceived")
        .withArgs("Candidate A");
    });
  });

  describe("Payouts", function () {
    it("Should distribute winnings correctly and allow payout", async function () {
      // Let addr1 and addr2 bet on Candidate A
      await electionBet
        .connect(addr1)
        .makeBet("Candidate A", { value: ethers.utils.parseEther("1") });
      await electionBet
        .connect(addr2)
        .makeBet("Candidate A", { value: ethers.utils.parseEther("2") });

      // Let owner simulate oracle and fulfill with Candidate A as the winner
      let tx = await (await electionBet.getElectionResult()).wait();
      let requestId = tx.events[0].args[0];
      await electionBet.fulfill(requestId, "Candidate A");

      // Check winnings
      expect(await electionBet.winnings(addr1.address)).to.equal(
        ethers.utils.parseEther("1")
      );
      expect(await electionBet.winnings(addr2.address)).to.equal(
        ethers.utils.parseEther("2")
      );

      // Payout addr1
      let addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
      await electionBet.connect(addr1).payout();
      let addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
      expect(addr1BalanceAfter.sub(addr1BalanceBefore)).to.equal(
        ethers.utils.parseEther("1")
      );

      // Payout addr2
      let addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
      await electionBet.connect(addr2).payout();
      let addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
      expect(addr2BalanceAfter.sub(addr2BalanceBefore)).to.equal(
        ethers.utils.parseEther("2")
      );
    });

    it("Should not allow payout if no winnings", async function () {
      await expect(electionBet.connect(addr1).payout()).to.be.revertedWith(
        "No winnings to payout"
      );
    });
  });

  // TODO: Add more tests as needed, such as for distributing winnings
});

// const { expect } = require("chai");
// const { ethers } = require("hardhat");

//...
