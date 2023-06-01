// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BetManager is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Bet {
        address bettor;
        uint256 amount;
        string candidate;
        bool withdrawn;
    }

    Bet[] public bets;
    mapping(string => uint256) public totalBets;
    mapping(address => Bet) public userBet;

    event BetMade(address indexed bettor, uint256 amount, string candidate);
    event BetWithdrawn(address indexed bettor, uint256 amount, string candidate);

    uint256 public bettingEndTime;

    constructor(uint256 _bettingEndTime) {
        bettingEndTime = _bettingEndTime;
    }

    function makeBet(string memory candidate) public payable {
        require(
            keccak256(bytes(candidate)) == keccak256(bytes("Kemal")) ||
                keccak256(bytes(candidate)) == keccak256(bytes("Erdogan")),
            "Invalid candidate"
        );
        require(block.timestamp <= bettingEndTime, "Betting has ended");

        uint256 betAmount = msg.value;
        Bet memory newBet = Bet(msg.sender, betAmount, candidate, false);
        bets.push(newBet);

        totalBets[candidate] = totalBets[candidate].add(betAmount);
        userBet[msg.sender] = newBet;

        emit BetMade(msg.sender, betAmount, candidate);
    }

    function withdraw() public nonReentrant {
        Bet storage bet = userBet[msg.sender];
        require(bet.amount > 0, "No bet to withdraw");
        require(!bet.withdrawn, "Bet already withdrawn");
        require(block.timestamp <= bettingEndTime, "Betting has ended");

        uint256 withdrawAmount = bet.amount;
        bet.withdrawn = true;

        totalBets[bet.candidate] = totalBets[bet.candidate].sub(withdrawAmount);

        payable(msg.sender).transfer(withdrawAmount);

        emit BetWithdrawn(msg.sender, withdrawAmount, bet.candidate);
    }

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
}

