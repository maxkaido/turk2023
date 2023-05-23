// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ElectionBetting is ChainlinkClient, Ownable, ReentrancyGuard {
    using Chainlink for Chainlink.Request;
    using SafeMath for uint256;

    address private oracle;
    bytes32 private jobId;
    uint256 public fee;
    uint256 public serviceFeePercentage; // Service fee percentage
    address public serviceFeeWallet; // Service fee wallet address
    uint256 public bettingEndTime; // End time for betting and withdrawal

    // Define the structure of a bet
    struct Bet {
        address bettor;
        uint256 amount;
        string candidate;
        bool withdrawn;
    }

    // Array to keep track of all bets
    Bet[] public bets;

    // Mapping to keep track of total amount bet on each candidate
    mapping(string => uint256) public totalBets;

    // Mapping to keep track of winnings for each candidate
    mapping(string => uint256) public candidateWinnings;

    // Mapping to keep track of each user's bet
    mapping(address => Bet) public userBet;

    // Mapping to keep track of each user's winnings
    mapping(address => uint256) public userWinnings;

    // Event to emit when a bet is made
    event BetMade(address indexed bettor, uint256 amount, string candidate);

    // Event to emit when a bet is withdrawn
    event BetWithdrawn(address indexed bettor, uint256 amount, string candidate);

    // Event to emit when the election result is received
    event ElectionResultReceived(string winner);

    // Struct to track confirmation result
    struct Confirmation {
        uint256 count;
        string result;
        uint256 lastConfirmationTimestamp;
    }

    Confirmation public electionConfirmation;

    // Constructor
    constructor(
        address _oracle,
        string memory _jobId,
        uint256 _fee,
        uint256 _serviceFeePercentage,
        address _serviceFeeWallet,
        uint256 _bettingEndTime
    ) {
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
        serviceFeePercentage = _serviceFeePercentage;
        serviceFeeWallet = _serviceFeeWallet;
        bettingEndTime = _bettingEndTime;

        // Initialize election confirmation
        electionConfirmation = Confirmation(0, "", 0);
    }

    function stringToBytes32(string memory source)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }

    // Function to make a bet
    function makeBet(string memory candidate) public payable {
        require(
            keccak256(bytes(candidate)) == keccak256(bytes("Kemal")) ||
                keccak256(bytes(candidate)) == keccak256(bytes("Erdogan")),
            "Invalid candidate"
        );
        require(
            block.timestamp <= bettingEndTime,
            "Betting has ended"
        );

        // Record the bet amount
        uint256 betAmount = msg.value;

        // Record the bet
        Bet memory newBet = Bet(msg.sender, betAmount, candidate, false);
        bets.push(newBet);

        // Update the total amount bet on this candidate
        totalBets[candidate] = totalBets[candidate].add(betAmount);
        userBet[msg.sender] = newBet;

        emit BetMade(msg.sender, betAmount, candidate);
    }

    // Function to withdraw the bet
    function withdraw() public nonReentrant {
        Bet storage bet = userBet[msg.sender];
        require(bet.amount > 0, "No bet to withdraw");
        require(!bet.withdrawn, "Bet already withdrawn");
        require(
            block.timestamp <= bettingEndTime,
            "Betting has ended"
        );

        uint256 withdrawAmount = bet.amount;
        bet.withdrawn = true;

        // Update the total amount bet on this candidate
        totalBets[bet.candidate] = totalBets[bet.candidate].sub(
            withdrawAmount
        );

        payable(msg.sender).transfer(withdrawAmount);

        emit BetWithdrawn(msg.sender, withdrawAmount, bet.candidate);
    }

    // Function to calculate the total bet amount of a user on a candidate
    function calculateUserBet(address user, string memory candidate)
        public
        view
        returns (uint256)
    {
        require(
            keccak256(bytes(candidate)) == keccak256(bytes("Kemal")) ||
                keccak256(bytes(candidate)) == keccak256(bytes("Erdogan")),
            "Invalid candidate"
        );

        Bet memory bet = userBet[user];

        if (
            keccak256(bytes(bet.candidate)) == keccak256(bytes(candidate)) &&
            !bet.withdrawn
        ) {
            return bet.amount;
        } else {
            return 0;
        }
    }

    // Function to get the election result
    function getElectionResult() public onlyOwner returns (bytes32 requestId) {
        require(
            block.timestamp > bettingEndTime,
            "Betting is still in progress"
        );

        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the request parameters
        request.add("get", "https://api.thebay.me/turk2023");
        request.add("path", "result");

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // Function to handle the election result
    function fulfill(bytes32 _requestId, string memory _winner)
        public
        recordChainlinkFulfillment(_requestId)
    {
        require(
            block.timestamp > bettingEndTime,
            "Betting is still in progress"
        );

        emit ElectionResultReceived(_winner);

        // Check if it's a new confirmation result
        if (
            keccak256(bytes(_winner)) != keccak256(bytes(electionConfirmation.result))
        ) {
            // Drop the counter to the previous confirmation result
            electionConfirmation.count = 1;
            electionConfirmation.result = _winner;
            electionConfirmation.lastConfirmationTimestamp = block.timestamp;
        } else {
            // Check if the confirmation interval has passed
            if (
                block.timestamp >=
                electionConfirmation.lastConfirmationTimestamp + 5 minutes
            ) {
                electionConfirmation.count++;
                electionConfirmation.lastConfirmationTimestamp = block
                    .timestamp;

                // Check if the confirmation count meets the threshold
                if (electionConfirmation.count == 3) {
                    // Declare the winner
                    emit ElectionResultReceived(electionConfirmation.result);
                    distributeWinnings(electionConfirmation.result);
                }
            }
        }
    }

    // Function to distribute winnings in batches
    function distributeWinnings(string memory winner) internal {
        uint256 totalWinningAmount = totalBets[winner];
        if (totalWinningAmount == 0) {
            return;
        }

        uint256 totalNetWinningAmount = totalWinningAmount;
        candidateWinnings[winner] = totalNetWinningAmount;

        // Set the batch size
        uint256 batchSize = 100;
        uint256 numBatches = (bets.length + batchSize - 1) / batchSize;

        // Call the first batch distribution
        distributeWinningsBatch(winner, 0, batchSize, numBatches);
    }

        // Function to distribute winnings for a specific batch of bets
    function distributeWinningsBatch(
        string memory winner,
        uint256 batchIndex,
        uint256 batchSize,
        uint256 numBatches
    ) internal {
        uint256 totalWinningAmount = totalBets[winner];
        uint256 totalNetWinningAmount = candidateWinnings[winner];
        uint256 totalBetsPool = totalBets["Kemal"].add(totalBets["Erdogan"]);

        // Calculate the starting and ending indices for the batch
        uint256 startIndex = batchIndex * batchSize;
        uint256 endIndex = startIndex + batchSize;
        if (endIndex > bets.length) {
            endIndex = bets.length;
        }

        // Distribute winnings for the bets in the batch
        for (uint256 i = startIndex; i < endIndex; i++) {
            if (
                keccak256(bytes(bets[i].candidate)) ==
                keccak256(bytes(winner))
            ) {
                uint256 payoutAmount = (bets[i].amount.mul(totalBetsPool)).div(
                    totalWinningAmount
                );
                // Apply the fee during winning distribution
                uint256 feeAmount = (payoutAmount.mul(serviceFeePercentage)).div(
                    100
                );
                uint256 netPayoutAmount = payoutAmount.sub(feeAmount);
                userWinnings[bets[i].bettor] = userWinnings[bets[i].bettor].add(
                    netPayoutAmount
                );
            }
        }

        // Check if there are remaining bets to distribute
        if (batchIndex + 1 < numBatches) {
            // Call the next batch in a new transaction
            uint256 nextBatchIndex = batchIndex + 1;
            uint256 gasLimit = gasleft() - 5000; // Reduce the gas limit to leave room for other operations
            bytes memory data =
                abi.encodeWithSignature(
                    "distributeWinningsBatch(string,uint256,uint256,uint256)",
                    winner,
                    nextBatchIndex,
                    batchSize,
                    numBatches
                );
            (bool success, ) = address(this).call{ gas: gasLimit }(data);
            require(success, "Batch distribution failed");
        } else {
            // Transfer service fee to the service fee wallet
            uint256 totalServiceFeeAmount = (totalNetWinningAmount.mul(
                serviceFeePercentage
            )).div(100);
            payable(serviceFeeWallet).transfer(totalServiceFeeAmount);
        }
    }


    // Function for users to claim their winnings
    function claimWinnings() public nonReentrant {
        uint256 winnings = userWinnings[msg.sender];
        require(winnings > 0, "No winnings to claim");

        userWinnings[msg.sender] = 0;
        payable(msg.sender).transfer(winnings);
    }

    // Function to declare the winner manually
    function declareWinner(string memory winner) public onlyOwner {
        require(
            keccak256(bytes(winner)) == keccak256(bytes("Kemal")) ||
            keccak256(bytes(winner)) == keccak256(bytes("Erdogan")),
            "Invalid candidate"
        );
        require(
            block.timestamp > bettingEndTime + 1 weeks,
            "Cannot declare winner before one week after betting end"
        );


        emit ElectionResultReceived(winner);
        distributeWinnings(winner);
    }

    // Function to set the oracle address
    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    // Function to set the job ID
    function setJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    // Function to set the fee
    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    // Function to set the service fee percentage
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

    // Function to set the service fee wallet
    function setServiceFeeWallet(address _serviceFeeWallet)
        public
        onlyOwner
    {
        serviceFeeWallet = _serviceFeeWallet;
    }

}

