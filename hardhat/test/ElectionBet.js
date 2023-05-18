const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ElectionBet", function () {
  let ElectionBet, electionBet, owner, addr1, addr2;
  let linkTokenAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
  let oracleAddress = "0x123...";
  let jobId = "0xabc...";
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

  // TODO: Add more tests as needed, such as for distributing winnings
});
