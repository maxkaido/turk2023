// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ResultConfirmation is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 public fee;

    event ElectionResultReceived(string winner);

    struct Confirmation {
        uint256 count;
        string result;
        uint256 lastConfirmationTimestamp;
    }

    Confirmation public electionConfirmation;

    constructor(
        address _oracle,
        string memory _jobId,
        uint256 _fee
    ) {
        setChainlinkTokenAddress(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846); // LINK token on Avalanche Fuji Testnet
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;

        electionConfirmation = Confirmation(0, "", 0);
    }

    function setChainlinkTokenAddress(address _tokenAddress) public onlyOwner {
        setChainlinkToken(_tokenAddress);
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
            result := mload(add(source, 32))
        }
    }

    function getElectionResult() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        request.add("get", "https://api.thebay.me/turk2023");
        request.add("path", "result");

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, string memory _winner)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit ElectionResultReceived(_winner);

        if (
            keccak256(bytes(_winner)) !=
            keccak256(bytes(electionConfirmation.result))
        ) {
            electionConfirmation.count = 1;
            electionConfirmation.result = _winner;
            electionConfirmation.lastConfirmationTimestamp = block.timestamp;
        } else {
            if (
                block.timestamp >=
                electionConfirmation.lastConfirmationTimestamp + 5 minutes
            ) {
                electionConfirmation.count++;
                electionConfirmation.lastConfirmationTimestamp = block.timestamp;

                if (electionConfirmation.count == 3) {
                    emit ElectionResultReceived(electionConfirmation.result);
                }
            }
        }
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    function setJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }
}

