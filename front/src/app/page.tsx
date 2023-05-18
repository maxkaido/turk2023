"use client";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { useEffect, useState } from "react";
import ElectionBetArtifact from "../../../hardhat/artifacts/contracts/ElectionBet.sol/ElectionBet.json";
import { ethers } from "ethers";

export default function Home() {
  // load contract from state
  const [account, setAccount]: any = useState(null);
  const [provider, setProvider]: any = useState(null);
  const [contract, setContract]: any = useState(null);
  const [bets, setBets]: any = useState([]);

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  }, []);

  async function loadBlockchainData() {
    // Connect to Metamask
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

    const filter = contract.filters.BetMade(account);
    const logs = await contract.queryFilter(filter);

    let userBets = logs.map((log) => {
      const event = contract.interface.parseLog(log);
      return {
        amount: ethers.utils.formatEther(event.args.amount),
        candidate: event.args.candidate,
      };
    });

    setBets(userBets);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    loadBlockchainData();
  }

  const trimmedAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  async function makeBet(candidate: string) {
    // Call the bet function on your contract
    if (!contract) return;
    const tx = await contract.makeBet(candidate, {
      value: ethers.utils.parseEther("1"),
    });
    await tx.wait();
  }
  const targetDate = new Date("2023-05-28T00:00:00");
  return (
    <main className="bg-gray-800 text-white min-h-screen text-white">
      <div>
        <h1>Your Bets</h1>
        {bets.map((bet, index) => (
          <div key={index}>
            <p>Bet Amount: {bet.amount} Ether</p>
            <p>Candidate: {bet.candidate}</p>
          </div>
        ))}
      </div>
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
      <div className="container mx-auto py-10">
        <h1 className="text-4xl text-center mb-10">Turk Election Bet</h1>
        <CountdownTimer targetDate={targetDate} />
        <h2 className="text-3xl text-center mb-10">
          {" "}
          Bet on the next Turkish president{" "}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Image
              src="/c1.jpg"
              alt="Erdogan"
              className="mx-auto mb-2 p-2"
              width={200}
              height={24}
              priority
            />
            <h1 className="text-2xl text-center mb-1">Recep Tayyip Erdoğan </h1>
            <button
              onClick={() => makeBet("erdogan")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Bet on Erdogan
            </button>
            <p>
              Current Bet: <span id="currentBet1">0</span> ETH
            </p>
            <p>
              Possible Win: <span id="possibleProfit1">0</span> ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">0</span> ETH
            </p>
          </div>
          <div className="text-center">
            <Image
              src="/c2.jpg"
              alt="Erdogan"
              className="mx-auto mb-2 p-2"
              width={200}
              height={24}
              priority
            />
            <h1 className="text-2xl text-center mb-1">Kemal Kılıçdaroğlu</h1>
            <button
              onClick={() => makeBet("kemal")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Bet on Kemal
            </button>
            <p>
              Current Bet: <span id="currentBet1">0</span> ETH
            </p>
            <p>
              Possible Win: <span id="possibleProfit1">0</span> ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">0</span> ETH
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
