"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import ElectionBetArtifact from "../../artifacts/ElectionBet.json";
import About from "./About";

const contractAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [bets, setBets] = useState([]);
  const [betAmountErdogan, setBetAmountErdogan] = useState(0);
  const [betAmountKemal, setBetAmountKemal] = useState(0);
  const [userTotalBetErdogan, setUserTotalBetErdogan] = useState(0);
  const [possibleWinErdogan, setPossibleWinErdogan] = useState(0);
  const [totalBetErdogan, setTotalBetErdogan] = useState(0);
  const [userTotalBetKemal, setUserTotalBetKemal] = useState(0);
  const [possibleWinKemal, setPossibleWinKemal] = useState(0);
  const [totalBetKemal, setTotalBetKemal] = useState(0);
  const [serviceFeePercentage, setServiceFeePercentage] = useState(0);
  const [bettingEndTime, setBettingEndTime] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  }, []);

  useEffect(() => {
    if (account) {
      loadBlockchainData();
    }
  }, [account]);

  async function loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const signer = provider.getSigner();
    const account = await signer.getAddress();
    setAccount(account);

    const contract = new ethers.Contract(
      contractAddress,
      ElectionBetArtifact.abi,
      signer
    );
    console.log("Contract object", contract);
    setContract(contract);

    const pastEvents = await contract.queryFilter("BetMade");
    const pastBets = pastEvents.map((event) => ({
      bettor: event.args.bettor,
      amount: ethers.utils.formatEther(event.args.amount),
      candidate: event.args.candidate,
    }));
    setBets(pastBets);

    await getUserBetErdogan();
    await getTotalBetErdogan();
    await getUserBetKemal();
    await getTotalBetKemal();
    await getServiceFeePercentage();

    calculatePossibleWin();
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    loadBlockchainData();
  }

  const trimmedAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  async function makeBet(candidate, betAmount) {
    if (!contract) return;
    const value = ethers.utils.parseEther(betAmount.toString());
    const tx = await contract.makeBet(candidate, {
      value,
    });
    await tx.wait();
  }

  async function withdrawAllBets() {
    if (!contract) return;
    const tx = await contract.withdraw();
    await tx.wait();
  }

  async function getServiceFeePercentage() {
    try {
      const feePercentage = await contract.serviceFeePercentage();
      setServiceFeePercentage(feePercentage.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  async function getBettingEndTime() {
    try {
      const endTime = await contract.bettingEndTime();
      setBettingEndTime(endTime.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  const getUserBet = async (candidate) => {
    try {
      const userBet = await contract.calculateUserBet(account, candidate, {
        from: account,
      });
      const formattedUserBet = Number(ethers.utils.formatEther(userBet));

      if (candidate === "Erdogan") {
        setUserTotalBetErdogan(formattedUserBet);
      } else if (candidate === "Kemal") {
        setUserTotalBetKemal(formattedUserBet);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePossibleWin = async () => {
    try {
      // calculate win amount for Erdogan
      let userBetPercentage = userTotalBetErdogan / totalBetErdogan;
      let serviceFeeAmount = (userTotalBetErdogan * serviceFeePercentage) / 100;
      let remainingBetAmount = totalBetErdogan - serviceFeeAmount;

      let possibleWinAmount = userBetPercentage * remainingBetAmount;
      setPossibleWinKemal(possibleWinAmount);
      // calculate win amount for Kemal
      userBetPercentage = userTotalBetKemal / totalBetKemal;
      serviceFeeAmount = (userTotalBetKemal * serviceFeePercentage) / 100;
      remainingBetAmount = totalBetKemal - serviceFeeAmount;
      possibleWinAmount = userBetPercentage * remainingBetAmount;
      setPossibleWinErdogan(possibleWinAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalBet = async (candidate) => {
    try {
      const totalBetAmount = await contract.totalBets(candidate, {
        from: account,
      });
      const formattedTotalBet = Number(
        ethers.utils.formatEther(totalBetAmount)
      );

      if (candidate === "Erdogan") {
        setTotalBetErdogan(formattedTotalBet);
      } else if (candidate === "Kemal") {
        setTotalBetKemal(formattedTotalBet);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserBetErdogan = () => getUserBet("Erdogan");
  const getUserBetKemal = () => getUserBet("Kemal");
  const getTotalBetErdogan = () => getTotalBet("Erdogan");
  const getTotalBetKemal = () => getTotalBet("Kemal");

  const targetDate = new Date("2023-05-28T00:00:00");

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <div></div>
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <p className="text-white">TurkElectro Oracle</p>
              </div>
            </div>
            <div className="flex">
              {account ? (
                <p className="text-white mr-4">{trimmedAddress}</p>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={requestAccount}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-center mb-10">Turk Election Bet</h1>
        <CountdownTimer targetDate={targetDate} />
        <h2 className="text-3xl text-center my-10">
          Bet on the next Turkish president
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 rounded border-2 border-red-500 text-center">
            <Image
              src="/c1.jpg"
              alt="Recep Tayyip Erdoğan's portrait"
              className="mx-auto mb-4 p-2 object-cover h-64 w-48 rounded-md"
              width={200}
              height={200}
              priority
            />
            <h1 className="text-2xl mb-2">Recep Tayyip Erdoğan</h1>
            <input
              type="number"
              placeholder="Enter Bet Amount"
              className="bg-gray-100 text-black rounded py-2 px-4 mb-4 w-36"
              value={betAmountErdogan}
              onChange={(e) => setBetAmountErdogan(e.target.value)}
              min="0"
            />
            <button
              onClick={() => makeBet("Erdogan", betAmountErdogan)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
            >
              Bet on Erdogan
            </button>
            <div className="mt-6">
              <p>
                Current Bet:{" "}
                <span id="currentBetErdogan">{userTotalBetErdogan}</span> ETH
              </p>
              <p>
                Possible Win:{" "}
                <span id="possibleProfitErdogan">{possibleWinErdogan}</span> ETH
              </p>
              <p>
                Total Bet: <span id="totalBetErdogan">{totalBetErdogan}</span>{" "}
                ETH
              </p>
            </div>
          </div>
          <div className="p-6 rounded border-2 border-blue-500 text-center">
            <Image
              src="/c2.jpg"
              alt="Kemal Kılıçdaroğlu's portrait"
              className="mx-auto mb-4 p-2 object-cover h-64 w-48 rounded-md"
              width={200}
              height={200}
              priority
            />
            <h1 className="text-2xl mb-2">Kemal Kılıçdaroğlu</h1>
            <input
              type="number"
              placeholder="Enter Bet Amount"
              className="bg-gray-100 text-black rounded py-2 px-4 mb-4 w-36"
              value={betAmountKemal}
              onChange={(e) => setBetAmountKemal(e.target.value)}
              min="0"
            />
            <button
              onClick={() => makeBet("Kemal", betAmountKemal)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
            >
              Bet on Kemal
            </button>
            <div className="mt-6">
              <p>
                Current Bet:{" "}
                <span id="currentBetKemal">{userTotalBetKemal}</span> ETH
              </p>
              <p>
                Possible Win:{" "}
                <span id="possibleProfitKemal">{possibleWinKemal}</span> ETH
              </p>
              <p>
                Total Bet: <span id="totalBetKemal">{totalBetKemal}</span> ETH
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Bets</h1>
        {bets.map((bet, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded shadow p-4 mb-4 text-gray-200"
          >
            <p className="text-sm">
              <span className="font-semibold">Bet Amount: </span>
              {bet.amount} Ether
            </p>
            <p className="text-sm">
              <span className="font-semibold">Bettor: </span>
              {bet.bettor}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Candidate: </span>
              {bet.candidate}
            </p>
          </div>
        ))}
      </div>
      <About />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Service Fee Percentage</h1>
        <p>Current service fee percentage: {serviceFeePercentage}%</p>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Betting End Time</h1>
        {bettingEndTime ? (
          <p>
            Betting end time: {new Date(bettingEndTime * 1000).toLocaleString()}
          </p>
        ) : (
          <p>Betting end time not available</p>
        )}
      </div>
      <div className="p-4">
        <button
          onClick={withdrawAllBets}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md my-2"
        >
          Withdraw All Bets
        </button>
      </div>
    </main>
  );
}
