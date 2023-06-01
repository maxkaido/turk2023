// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WinningsManager is Ownable {
    using SafeMath for uint256;

    mapping(string => uint256) public candidateWinnings;
    mapping(address => uint256) public userWinnings;

    uint256 public serviceFeePercentage;
    address public serviceFeeWallet;

    event ElectionResultReceived(string winner);

    constructor(
        uint256 _serviceFeePercentage,
        address _serviceFeeWallet
    ) {
        serviceFeePercentage = _serviceFeePercentage;
        serviceFeeWallet = _serviceFeeWallet;
    }

    function distributeWinnings(
        string memory winner,
        uint256 bettingEndTime,
        uint256 totalBetsPool,
        uint256[] memory betAmounts,
        string[] memory betCandidates,
        bool[] memory betWithdrawn,
        address[] memory betBettors
    ) internal {
        uint256 totalWinningAmount = calculateTotalWinningAmount(winner, betAmounts, betCandidates, betWithdrawn, betBettors);
        if (totalWinningAmount == 0) {
            return;
        }

        uint256 totalNetWinningAmount = totalWinningAmount;
        candidateWinnings[winner] = totalNetWinningAmount;

        uint256 batchSize = 100;
        uint256 numBatches = (betAmounts.length + batchSize - 1) / batchSize;

        distributeWinningsBatch(
            winner,
            0,
            batchSize,
            numBatches,
            totalWinningAmount,
            totalBetsPool,
            betAmounts,
            betCandidates,
            betWithdrawn,
            betBettors
        );
    }

    function distributeWinningsBatch(
        string memory winner,
        uint256 batchIndex,
        uint256 batchSize,
        uint256 numBatches,
        uint256 totalWinningAmount,
        uint256 totalBetsPool,
        uint256[] memory betAmounts,
        string[] memory betCandidates,
        bool[] memory betWithdrawn,
        address[] memory betBettors
    ) internal {
        uint256 startIndex = batchIndex * batchSize;
        uint256 endIndex = startIndex + batchSize;
        if (endIndex > betAmounts.length) {
            endIndex = betAmounts.length;
        }

        uint256 totalBatchPayout = 0;
        for (uint256 i = startIndex; i < endIndex; i++) {
            if (
                keccak256(bytes(betCandidates[i])) ==
                keccak256(bytes(winner))
            ) {
                uint256 payoutAmount = (betAmounts[i].mul(totalBetsPool)).div(
                    totalWinningAmount
                );
                uint256 feeAmount = (payoutAmount.mul(serviceFeePercentage)).div(
                    100
                );
                uint256 netPayoutAmount = payoutAmount.sub(feeAmount);
                userWinnings[betBettors[i]] = userWinnings[betBettors[i]].add(
                    netPayoutAmount
                );

                totalBatchPayout = totalBatchPayout.add(netPayoutAmount);
            }
        }

        uint256 totalServiceFeeAmount = (totalBatchPayout.mul(serviceFeePercentage)).div(
            100
        );
        payable(serviceFeeWallet).transfer(totalServiceFeeAmount);

        if (batchIndex + 1 < numBatches) {
            distributeWinningsBatch(
                winner,
                batchIndex + 1,
                batchSize,
                numBatches,
                totalWinningAmount,
                totalBetsPool,
                betAmounts,
                betCandidates,
                betWithdrawn,
                betBettors
            );
        }
    }

    function calculateTotalWinningAmount(
        string memory winner,
        uint256[] memory betAmounts,
        string[] memory betCandidates,
        bool[] memory betWithdrawn,
        address[] memory betBettors
    ) internal pure returns (uint256) {
        uint256 totalWinningAmount = 0;
        for (uint256 i = 0; i < betAmounts.length; i++) {
            if (
                keccak256(bytes(betCandidates[i])) ==
                keccak256(bytes(winner)) &&
                !betWithdrawn[i]
            ) {
                totalWinningAmount = totalWinningAmount.add(betAmounts[i]);
            }
        }
        return totalWinningAmount;
    }

    function setServiceFeePercentage(uint256 _serviceFeePercentage)
        public
        onlyOwner
    {
        require(
            _serviceFeePercentage <= 5,
            "Service fee percentage should not exceed 5"
        );
        serviceFeePercentage = _serviceFeePercentage;
    }

    function setServiceFeeWallet(address _serviceFeeWallet)
        public
        onlyOwner
    {
        serviceFeeWallet = _serviceFeeWallet;
    }
}

