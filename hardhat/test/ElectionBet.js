
import "hardhat/console.sol";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("ElectionBet", function () {
  let ElectionBet;
  let electionBet;
  let owner;
  let addr1;
  let addr2;

  const oracleAddress = owner.address;
  const jobId = "<job-id>";
  const fee = 0.1 ether;
  const serviceFeePercentage = 2;
  const serviceFeeWallet = "<service-fee-wallet-address>";
  const bettingEndTime = Math.floor(Date.now() / 1000) + 86400; // Set betting end time 24 hours from now

  beforeEach(async function () {
    ElectionBet = await ethers.getContractFactory("ElectionBet");
    [owner, addr1, addr2] = await ethers.getSigners();

    electionBet = await ElectionBet.deploy(
      oracleAddress,
      jobId,
      fee,
      serviceFeePercentage,
      serviceFeeWallet,
      bettingEndTime
    );

    await electionBet.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct values during deployment", async function () {
      expect(await electionBet.oracle()).to.equal(oracleAddress);
      expect(await electionBet.jobId()).to.equal(jobId);
      expect(await electionBet.fee()).to.equal(fee);
      expect(await electionBet.serviceFeePercentage()).to.equal(serviceFeePercentage);
      expect(await electionBet.serviceFeeWallet()).to.equal(serviceFeeWallet);
      expect(await electionBet.bettingEndTime()).to.equal(bettingEndTime);
    });
  });

  describe("Betting", function () {
    it("Should allow users to make bets on valid candidates", async function () {
      await expect(electionBet.connect(addr1).makeBet("Kemal")).to.emit(electionBet, "BetMade");
      await expect(electionBet.connect(addr2).makeBet("Erdogan")).to.emit(electionBet, "BetMade");

      const totalBetsKemal = await electionBet.totalBets("Kemal");
      const totalBetsErdogan = await electionBet.totalBets("Erdogan");

      expect(totalBetsKemal).to.equal(1);
      expect(totalBetsErdogan).to.equal(1);
    });

    it("Should revert when betting on invalid candidates", async function () {
      await expect(electionBet.connect(addr1).makeBet("InvalidCandidate")).to.be.revertedWith("Invalid candidate");
    });

    it("Should revert when betting after the betting end time", async function () {
      await ethers.provider.send("evm_increaseTime", [86401]); // Increase time by 24 hours

      await expect(electionBet.connect(addr1).makeBet("Kemal")).to.be.revertedWith("Betting has ended");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await electionBet.connect(addr1).makeBet("Kemal");
      await electionBet.connect(addr1).makeBet("Erdogan");
    });

    it("Should allow users to withdraw their bets", async function () {
      const balanceBefore = await ethers.provider.getBalance(addr1.address);
      const userTotalBet = await electionBet.calculateUserBet(addr1.address, "Kemal");

      await expect(electionBet.connect(addr1).withdraw())
        .to.emit(electionBet, "BetWithdrawn")
        .withArgs(addr1.address, userTotalBet, "");

      const balanceAfter = await ethers.provider.getBalance(addr1.address);
      expect(balanceAfter).to.equal(balanceBefore.add(userTotalBet));
    });

    it("Should revert when trying to withdraw zero bets", async function () {
      await expect(electionBet.connect(addr2).withdraw()).to.be.revertedWith("No bets to withdraw");
    });
  });

  describe("Election Result", function () {
    beforeEach(async function () {
      await electionBet.connect(addr1).makeBet("Kemal");
      await electionBet.connect(addr2).makeBet("Erdogan");
    });

    it("Should distribute winnings to the correct bettors", async function () {
      await electionBet.fulfill("<request-id>", "Kemal");

      const balanceBeforeAddr1 = await ethers.provider.getBalance(addr1.address);
      const balanceBeforeAddr2 = await ethers.provider.getBalance(addr2.address);

      await expect(electionBet.distributeWinnings("Kemal"))
        .to.changeBalance(addr1, 0.5 ether) // Assuming total bets on Kemal is 1 ETH
        .and.changeBalance(addr2, 0);

      const balanceAfterAddr1 = await ethers.provider.getBalance(addr1.address);
      const balanceAfterAddr2 = await ethers.provider.getBalance(addr2.address);

      expect(balanceAfterAddr1.sub(balanceBeforeAddr1)).to.equal(0.5 ether);
      expect(balanceAfterAddr2.sub(balanceBeforeAddr2)).to.equal(0);
    });

    it("Should transfer the service fee to the service fee wallet", async function () {
      await electionBet.fulfill("<request-id>", "Kemal");

      const balanceBefore = await ethers.provider.getBalance(serviceFeeWallet);

      await expect(electionBet.distributeWinnings("Kemal"))
        .to.changeBalance(serviceFeeWallet, 0.02 ether); // Assuming total bets on Kemal is 1 ETH, service fee is 2%

      const balanceAfter = await ethers.provider.getBalance(serviceFeeWallet);

      expect(balanceAfter.sub(balanceBefore)).to.equal(0.02 ether);
    });
  });
});

