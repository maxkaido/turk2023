pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ElectionBet is ChainlinkClient, Ownable, ReentrancyGuard {
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
    mapping(string => uint256) public winnings;

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
    constructor(address _oracle, string memory _jobId, uint256 _fee, uint256 _serviceFeePercentage, address _serviceFeeWallet, uint256 _bettingEndTime) public {
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

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
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
        require(block.timestamp <= bettingEndTime, "Betting has ended");

        // Record the bet amount
        uint256 betAmount = msg.value;

        // Record the bet
        Bet memory newBet = Bet(msg.sender, betAmount, candidate, false);
        bets.push(newBet);

        // Update the total amount bet on this candidate
        totalBets[candidate] = totalBets[candidate].add(betAmount);

        emit BetMade(msg.sender, betAmount, candidate);
    }

    // Function to withdraw all bets
    function withdraw() public {
        uint256 totalWithdrawnAmount;

        for (uint256 i = 0; i < bets.length; i++) {
            Bet storage bet = bets[i];

            if (bet.bettor == msg.sender && !bet.withdrawn) {
                totalWithdrawnAmount = totalWithdrawnAmount.add(bet.amount);
                bet.withdrawn = true;

                // Update the total amount bet on this candidate
                totalBets[bet.candidate] = totalBets[bet.candidate].sub(bet.amount);
            }
        }

        require(totalWithdrawnAmount > 0, "No bets to withdraw");

        payable(msg.sender).transfer(totalWithdrawnAmount);

        emit BetWithdrawn(msg.sender, totalWithdrawnAmount, "");
    }

    // Function to calculate the total bet amount of a user on a candidate
    function calculateUserBet(address user, string memory candidate) public view returns (uint256) {
        require(
            keccak256(bytes(candidate)) == keccak256(bytes("Kemal")) || 
            keccak256(bytes(candidate)) == keccak256(bytes("Erdogan")),
            "Invalid candidate"
        );

        uint256 userTotalBet = 0;

        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].bettor == user && keccak256(bytes(bets[i].candidate)) == keccak256(bytes(candidate)) && !bets[i].withdrawn) {
                userTotalBet = userTotalBet.add(bets[i].amount);
            }
        }

        return userTotalBet;
    }

    // Function to get the election result
    function getElectionResult() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // TODO: Set the request parameters
        // request.add("get", "http://api.electionresults.com/turkey2023");

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // Function to handle the election result
    function fulfill(bytes32 _requestId, string memory _winner) public recordChainlinkFulfillment(_requestId) {
        emit ElectionResultReceived(_winner);

        // Check if it's a new confirmation result
        if (keccak256(bytes(_winner)) != keccak256(bytes(electionConfirmation.result))) {
            // Drop the counter to the previous confirmation result
            electionConfirmation.count = 1;
            electionConfirmation.result = _winner;
            electionConfirmation.lastConfirmationTimestamp = block.timestamp;
        } else {
            // Check if the confirmation interval has passed
            if (block.timestamp >= electionConfirmation.lastConfirmationTimestamp + 5 minutes) {
                electionConfirmation.count++;
                electionConfirmation.lastConfirmationTimestamp = block.timestamp;

                // Check if the confirmation count meets the threshold
                if (electionConfirmation.count == 3) {
                    // Declare the winner
                    emit ElectionResultReceived(electionConfirmation.result);
                    distributeWinnings(electionConfirmation.result);
                }
            }
        }
    }

    // Function to distribute winnings based on the election result
    function distributeWinnings(string memory winner) internal nonReentrant {
        uint256 totalWinningAmount = totalBets[winner];
        if (totalWinningAmount == 0) {
            return;
        }

        uint256 totalNetWinningAmount = totalWinningAmount;

        winnings[winner] = totalNetWinningAmount;

        // Calculate the payout ratio for each bettor
        for (uint256 i = 0; i < bets.length; i++) {
            if (keccak256(bytes(bets[i].candidate)) == keccak256(bytes(winner))) {
                uint256 payoutAmount = (bets[i].amount.mul(totalNetWinningAmount)).div(totalWinningAmount);
                // Apply the fee during winning distribution
                uint256 feeAmount = (payoutAmount.mul(serviceFeePercentage)).div(100);
                uint256 netPayoutAmount = payoutAmount.sub(feeAmount);
                payable(bets[i].bettor).transfer(netPayoutAmount);
            }
        }

        // Transfer service fee to the service fee wallet
        uint256 totalServiceFeeAmount = (totalNetWinningAmount.mul(serviceFeePercentage)).div(100);
        payable(serviceFeeWallet).transfer(totalServiceFeeAmount);
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
    function setServiceFeePercentage(uint256 _serviceFeePercentage) public onlyOwner {
        require(_serviceFeePercentage <= 5, "Service fee percentage should not exceed 5");
        serviceFeePercentage = _serviceFeePercentage;
    }

    // Function to set the service fee wallet
    function setServiceFeeWallet(address _serviceFeeWallet) public onlyOwner {
        serviceFeeWallet = _serviceFeeWallet;
    }

    // Function to set the betting end time
    function setBettingEndTime(uint256 _bettingEndTime) public onlyOwner {
        bettingEndTime = _bettingEndTime;
    }
}

