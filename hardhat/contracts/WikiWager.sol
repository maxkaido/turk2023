// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract WikiWager is ChainlinkClient, Ownable, ReentrancyGuard {
    using Chainlink for Chainlink.Request;
    using SafeMath for uint256;

    address private oracle;
    bytes32 private jobId;
    uint256 public fee;
    uint256 public serviceFeePercentage; // Service fee percentage
    address public serviceFeeWallet; // Service fee wallet address
    uint256 public bettingEndTime; // End time for betting and withdrawal

    // Define the structure of a candidate
    struct Candidate {
        string name;
        bool exists;
    }

    // Array to keep track of all candidates
    Candidate[] public candidates;

    // Define the structure of a bet
    struct Bet {
        address bettor;
        uint256 amount;
        uint256 candidateIndex;
        bool withdrawn;
    }

    // Array to keep track of all bets
    Bet[] public bets;

    // Mapping to keep track of total amount bet on each candidate
    mapping(uint256 => uint256) public totalBets;

    // Mapping to keep track of winnings for each candidate
    mapping(uint256 => uint256) public candidateWinnings;

    // Mapping to keep track of each user's bet
    mapping(address => Bet) public userBet;

    // Mapping to keep track of each user's winnings
    mapping(address => uint256) public userWinnings;

    // Event to emit when a bet is made
    event BetMade(address indexed bettor, uint256 amount, uint256 candidateIndex);

    // Event to emit when a bet is withdrawn
    event BetWithdrawn(address indexed bettor, uint256 amount, uint256 candidateIndex);

    // Event to emit when the event result is received
    event EventResultReceived(uint256 winnerIndex);

    // Struct to track confirmation result
    struct Confirmation {
        uint256 count;
        uint256 resultIndex;
        uint256 lastConfirmationTimestamp;
    }

    Confirmation public eventConfirmation;

    // Constructor
    constructor(
        address _oracle,
        string memory _jobId,
        uint256 _fee,
        uint256 _serviceFeePercentage,
        address _serviceFeeWallet,
        uint256 _bettingEndTime,
        string[] memory _candidateNames
    ) {
        setChainlinkToken(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846); // LINK token on Avalanche Fuji Testnet
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
        serviceFeePercentage = _serviceFeePercentage;
        serviceFeeWallet = _serviceFeeWallet;
        bettingEndTime = _bettingEndTime;

        // Initialize event confirmation
        eventConfirmation = Confirmation(0, type(uint256).max, 0);

        // Initialize candidates
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], true));
        }
    }

    // Function to set the Chainlink token address
    function setChainlinkTokenAddress(address _tokenAddress) public onlyOwner {
        setChainlinkToken(_tokenAddress); // LINK token on Avalanche Fuji Testnet
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
    function makeBet(uint256 candidateIndex) public payable {
        require(candidateIndex < candidates.length, "Invalid candidate index");
        require(
            block.timestamp <= bettingEndTime,
            "Betting has ended"
        );

        // Record the bet amount
        uint256 betAmount = msg.value;

        // Record the bet
        Bet memory newBet = Bet(msg.sender, betAmount, candidateIndex, false);
        bets.push(newBet);

        // Update the total amount bet on this candidate
        totalBets[candidateIndex] = totalBets[candidateIndex].add(betAmount);
        userBet[msg.sender] = newBet;

        emit BetMade(msg.sender, betAmount, candidateIndex);
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
        totalBets[bet.candidateIndex] = totalBets[bet.candidateIndex].sub(
            withdrawAmount
        );

        payable(msg.sender).transfer(withdrawAmount);

        emit BetWithdrawn(msg.sender, withdrawAmount, bet.candidateIndex);
    }

    // Function to calculate the total bet amount of a user on a candidate
    function calculateUserBet(address user, uint256 candidateIndex)
        public
        view
        returns (uint256)
    {
        require(candidateIndex < candidates.length, "Invalid candidate index");

        Bet memory bet = userBet[user];

        if (bet.candidateIndex == candidateIndex && !bet.withdrawn) {
            return bet.amount;
        } else {
            return 0;
        }
    }

    // Function to get the event result
    function getEventResult() public onlyOwner returns (bytes32 requestId) {
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
        request.add("get", "https://api.thebay.me/event"); // Replace with the actual event API endpoint
        request.add("path", "result");

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // Function to handle the event result
    function fulfill(bytes32 _requestId, string memory _winner)
        public
        recordChainlinkFulfillment(_requestId)
    {
        require(
            block.timestamp > bettingEndTime,
            "Betting is still in progress"
        );

        uint256 winnerIndex = findCandidateIndex(_winner);
        require(winnerIndex < candidates.length, "Invalid winner");

        emit EventResultReceived(winnerIndex);

        // Check if it's a new confirmation result
        if (winnerIndex != eventConfirmation.resultIndex) {
            // Drop the counter to the previous confirmation result
            eventConfirmation.count = 1;
            eventConfirmation.resultIndex = winnerIndex;
            eventConfirmation.lastConfirmationTimestamp = block.timestamp;
        } else {
            // Check if the confirmation interval has passed
            if (
                block.timestamp >=
                eventConfirmation.lastConfirmationTimestamp + 5 minutes
            ) {
                eventConfirmation.count++;
                eventConfirmation.lastConfirmationTimestamp = block
                    .timestamp;

                // Check if the confirmation count meets the threshold
                if (eventConfirmation.count == 3) {
                    // Declare the winner
                    emit EventResultReceived(eventConfirmation.resultIndex);
                    distributeWinnings(eventConfirmation.resultIndex);
                }
            }
        }
    }

    // Function to distribute winnings in batches
    function distributeWinnings(uint256 winnerIndex) internal {
        uint256 totalWinningAmount = totalBets[winnerIndex];
        if (totalWinningAmount == 0) {
            return;
        }

        uint256 totalNetWinningAmount = totalWinningAmount;
        candidateWinnings[winnerIndex] = totalNetWinningAmount;

        // Set the batch size
        uint256 batchSize = 100;
        uint256 numBatches = (bets.length + batchSize - 1) / batchSize;

        // Call the first batch distribution
        distributeWinningsBatch(winnerIndex, 0, batchSize, numBatches);
    }

    function distributeWinningsBatch(
        uint256 winnerIndex,
        uint256 batchIndex,
        uint256 batchSize,
        uint256 numBatches
    ) internal {
        uint256 totalWinningAmount = totalBets[winnerIndex];
        uint256 totalBetsPool = getTotalBetsPool();

        // Calculate the starting and ending indices for the batch
        uint256 startIndex = batchIndex * batchSize;
        uint256 endIndex = startIndex + batchSize;
        if (endIndex > bets.length) {
            endIndex = bets.length;
        }

        // Distribute winnings for the bets in the batch
        uint256 totalBatchPayout = 0;
        for (uint256 i = startIndex; i < endIndex; i++) {
            if (bets[i].candidateIndex == winnerIndex) {
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

                // Update the total batch payout
                totalBatchPayout = totalBatchPayout.add(netPayoutAmount);
            }
        }

        // Calculate the service fee for the batch
        uint256 totalServiceFeeAmount = (totalBatchPayout.mul(serviceFeePercentage)).div(100);

        // Transfer service fee to the service fee wallet
        payable(serviceFeeWallet).transfer(totalServiceFeeAmount);

        // Check if there are remaining bets to distribute
        if (batchIndex + 1 < numBatches) {
            // Call the next batch in a new transaction
            uint256 nextBatchIndex = batchIndex + 1;
            uint256 gasLimit = gasleft() - 5000; // Reduce the gas limit to leave room for other operations
            bytes memory data =
                abi.encodeWithSignature(
                    "distributeWinningsBatch(uint256,uint256,uint256,uint256)",
                    winnerIndex,
                    nextBatchIndex,
                    batchSize,
                    numBatches
                );
            (bool success, ) = address(this).call{ gas: gasLimit }(data);
            require(success, "Batch distribution failed");
        }
    }

    // Function for users to claim their winnings
    function claimWinnings() public nonReentrant {
        uint256 winnings = userWinnings[msg.sender];
        require(winnings > 0, "No winnings to claim");

        userWinnings[msg.sender] = 0;
        payable(msg.sender).transfer(winnings);
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

    // Function to get the total bets pool
    function getTotalBetsPool() public view returns (uint256) {
        uint256 pool = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            pool = pool.add(bets[i].amount);
        }
        return pool;
    }

    // Function to find the index of a candidate by name
    function findCandidateIndex(string memory candidateName)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (
                keccak256(bytes(candidates[i].name)) ==
                keccak256(bytes(candidateName))
            ) {
                return i;
            }
        }
        return type(uint256).max;
    }
}

