// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./BetManager.sol";
import "./WinningsManager.sol";
import "./ResultConfirmation.sol";

contract ElectionBetting is Ownable {
    BetManager public betManager;
    WinningsManager public winningsManager;
    ResultConfirmation public resultConfirmation;

    constructor(
        address _oracle,
        string memory _jobId,
        uint256 _fee,
        uint256 _serviceFeePercentage,
        address _serviceFeeWallet,
        uint256 _bettingEndTime
    ) {
        betManager = new BetManager(_bettingEndTime);
        winningsManager = new WinningsManager(
            _serviceFeePercentage,
            _serviceFeeWallet
        );
        resultConfirmation = new ResultConfirmation(_oracle, _jobId, _fee);
    }

    function makeBet(string memory candidate) public payable {
        betManager.makeBet(candidate);
    }

    function withdraw() public nonReentrant {
        betManager.withdraw();
    }

    function calculateUserBet(address user, string memory candidate)
        public
        view
        returns (uint256)
    {
        return betManager.calculateUserBet(user, candidate);
    }

    function distributeWinnings(string memory winner) internal {
        Bet[] storage bets = betManager.bets();
        uint256 totalBetsPool =
            betManager.totalBets("Kemal").add(betManager.totalBets("Erdogan"));

        winningsManager.distributeWinnings(
            bets,
            winner,
            betManager.bettingEndTime(),
            totalBetsPool
        );
    }

    function claimWinnings() public nonReentrant {
        uint256 winnings = winningsManager.userWinnings(msg.sender);
        require(winnings > 0, "No winnings to claim");

        winningsManager.userWinnings(msg.sender) = 0;
        payable(msg.sender).transfer(winnings);
    }

    function declareWinner(string memory winner) public onlyOwner {
        resultConfirmation.declareWinner(winner);
    }

    function setOracle(address _oracle) public onlyOwner {
        resultConfirmation.setOracle(_oracle);
    }

    function setJobId(bytes32 _jobId) public onlyOwner {
        resultConfirmation.setJobId(_jobId);
    }

    function setFee(uint256 _fee) public onlyOwner {
        resultConfirmation.setFee(_fee);
    }

    function setServiceFeePercentage(uint256 _serviceFeePercentage)
        public
        onlyOwner
    {
        winningsManager.setServiceFeePercentage(_serviceFeePercentage);
    }

    function setServiceFeeWallet(address _serviceFeeWallet)
        public
        onlyOwner
    {
        winningsManager.setServiceFeeWallet(_serviceFeeWallet);
    }
}

