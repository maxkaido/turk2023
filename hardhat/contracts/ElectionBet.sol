pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ElectionBet is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    // Define the structure of a bet
    struct Bet {
        address bettor;
        uint256 amount;
        string candidate;
    }

    // Array to keep track of all bets
    Bet[] public bets;

    // Mapping to keep track of total amount bet on each candidate
    mapping(string => uint256) public totalBets;

    // Event to emit when a bet is made
    event BetMade(address indexed bettor, uint256 amount, string candidate);

    // Event to emit when the election result is received
    event ElectionResultReceived(string winner);

    // Constructor
    constructor(address _oracle, string memory _jobId, uint256 _fee) public {
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
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
        // Record the bet
        Bet memory newBet = Bet(msg.sender, msg.value, candidate);
        bets.push(newBet);

        // Update the total amount bet on this candidate
        totalBets[candidate] += msg.value;

        emit BetMade(msg.sender, msg.value, candidate);
    }

    // Function to get the election result
    function getElectionResult() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // TODO: Set the request parameters
        // request.add("get", "http://api.electionresults.com/turkey2023");

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // Function to handle the election result
    function fulfill(bytes32 _requestId, string memory _winner) public recordChainlinkFulfillment(_requestId) {
        emit ElectionResultReceived(_winner);

        // TODO: Distribute winnings based on the
    }

}


