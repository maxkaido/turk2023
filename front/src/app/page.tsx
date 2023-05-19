"use client";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { useEffect, useState } from "react";
import ElectionBetArtifact from "../../artifacts/ElectionBet.json";
import { ethers } from "ethers";

export default function Home() {
  // load contract from state
  const [account, setAccount]: any = useState(null);
  const [provider, setProvider]: any = useState(null);
  const [contract, setContract]: any = useState(null);
  const [bets, setBets]: any = useState([]);

  const contractAddress = "0x8a791620dd6260079bf849dc5567adc3f2fdc318";

  useEffect(() => {
    if (account) {
      getUserBetErdogan();
      getTotalBetErdogan();
      getUserBetKemal();
      getTotalBetKemal();
    }
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  }, [account]);

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

    const pastEvents = await contract.queryFilter("BetMade");
    const pastBets = pastEvents.map((event: any) => ({
      bettor: event.args.bettor,
      amount: ethers.utils.formatEther(event.args.amount),
      candidate: event.args.candidate,
    }));
    setBets(pastBets);
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
  const [userTotalBetErdogan, setUserTotalBetErdogan] = useState(0);
  const [possibleWinErdogan, setPossibleWinErdogan] = useState(0);
  const [totalBetErdogan, setTotalBetErdogan] = useState(0);
  const [userTotalBetKemal, setUserTotalBetKemal] = useState(0);
  const [possibleWinKemal, setPossibleWinKemal] = useState(0);
  const [totalBetKemal, setTotalBetKemal] = useState(0);

  const getUserBetErdogan = async () => {
    try {
      const userBet = await contract.calculateUserBet(account, "Erdogan", {
        from: account,
      });
      setUserTotalBetErdogan(Number(ethers.utils.formatEther(userBet)));
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePossibleWinErdogan = async () => {
    try {
      const possibleWinAmount = await contract.calculatePossibleWin(
        account,
        "Erdogan",
        { from: account }
      );
      setPossibleWinErdogan(
        Number(ethers.utils.formatEther(possibleWinAmount))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalBetErdogan = async () => {
    try {
      const totalBetAmount = await contract.totalBets("Erdogan", {
        from: account,
      });
      setTotalBetErdogan(Number(ethers.utils.formatEther(totalBetAmount)));
    } catch (error) {
      console.error(error);
    }
  };

  const getUserBetKemal = async () => {
    try {
      const userBet = await contract.calculateUserBet(account, "Kemal", {
        from: account,
      });
      setUserTotalBetKemal(Number(ethers.utils.formatEther(userBet)));
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePossibleWinKemal = async () => {
    try {
      const possibleWinAmount = await contract.calculatePossibleWin(
        account,
        "Kemal",
        { from: account }
      );
      setPossibleWinKemal(Number(ethers.utils.formatEther(possibleWinAmount)));
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalBetKemal = async () => {
    try {
      const totalBetAmount = await contract.totalBets("Kemal", {
        from: account,
      });
      setTotalBetKemal(Number(ethers.utils.formatEther(totalBetAmount)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account) {
      getUserBetErdogan();
      getTotalBetErdogan();
      getUserBetKemal();
      getTotalBetKemal();
    }
  }, [account]);
  const targetDate = new Date("2023-05-28T00:00:00");
  return (
    <main className="bg-gray-800 text-white min-h-screen text-white">
      <div>
        {account ? (
          <div>
            <h2>Account: {account}</h2>
            <div>
              <h3>Erdogan</h3>
              <button onClick={getUserBetErdogan}>Get User Bet</button>
              <button onClick={calculatePossibleWinErdogan}>
                Calculate Possible Win
              </button>
              <button onClick={getTotalBetErdogan}>Get Total Bet</button>
              <br />
              <p>User Total Bet: {userTotalBetErdogan} ETH</p>
              <p>Possible Win: {possibleWinErdogan} ETH</p>
              <p>Total Bet on Erdogan: {totalBetErdogan} ETH</p>
            </div>
            <div>
              <h3>Kemal</h3>
              <button onClick={getUserBetKemal}>Get User Bet</button>
              <button onClick={calculatePossibleWinKemal}>
                Calculate Possible Win
              </button>
              <button onClick={getTotalBetKemal}>Get Total Bet</button>
              <br />
              <p>User Total Bet: {userTotalBetKemal} ETH</p>
              <p>Possible Win: {possibleWinKemal} ETH</p>
              <p>Total Bet on Kemal: {totalBetKemal} ETH</p>
            </div>
          </div>
        ) : (
          <button onClick={requestAccount}>Connect Wallet</button>
        )}
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
              onClick={() => makeBet("Erdogan")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Bet on Erdogan
            </button>
            <p>
              Current Bet: <span id="currentBet1">{userTotalBetErdogan}</span>{" "}
              ETH
            </p>
            <p>
              Possible Win:{" "}
              <span id="possibleProfit1">{possibleWinErdogan}</span> ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">{totalBetErdogan}</span> ETH
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
              onClick={() => makeBet("Kemal")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Bet on Kemal
            </button>
            <p>
              Current Bet: <span id="currentBet1">{userTotalBetKemal}</span> ETH
            </p>
            <p>
              Possible Win: <span id="possibleProfit1">{possibleWinKemal}</span>{" "}
              ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">{totalBetKemal}</span> ETH
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Bets</h1>
        {bets.map((bet: any, index: any) => (
          <div key={index} className="bg-gray-900 rounded shadow p-4 mb-4">
            <p className="text-sm text-gray-200">
              <span className="font-semibold">Bet Amount: </span>
              {bet.amount} Ether
            </p>
            <p className="text-sm text-gray-200">
              <span className="font-semibold">Bettor : </span>
              {bet.bettor}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Candidate: </span>
              {bet.candidate}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-gray-300 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              About ElectionBetting
            </h2>
          </div>
          <div className="mt-12">
            <div className="text-center">
              <p className="text-xl text-gray-500">
                Welcome to the ElectionBetting Platform, where political
                enthusiasts meet cutting-edge technology!
              </p>
              <p className="mt-4 text-xl text-gray-500">
                Our platform leverages the power of blockchain and artificial
                intelligence to provide a unique and thrilling experience.
                Developed on the Ethereum network, ElectionBetting allows users
                to place bets on the outcomes of political events - starting
                with the 2023 Turkish General Elections.
              </p>
              <p className="mt-4 text-xl text-gray-500">
                Our transparent and secure smart contracts are the backbone of
                our platform. These contracts not only enable the betting
                functionality but also manage payouts, all in a fully automated,
                decentralized manner.
              </p>
              <p className="mt-4 text-xl text-gray-500">
                To provide real-time and reliable data, we integrate with
                Chainlink, a leading decentralized oracle network. Chainlink
                nodes fetch election results from authoritative sources like
                Wikipedia. We then utilize OpenAI`s language processing model,
                GPT-4, to interpret the data and determine the winner.
              </p>
              <p className="mt-4 text-xl text-gray-500">
                At ElectionBetting, we are passionate about blockchain
                technology, fair elections, and innovative applications of AI.
                We`re thrilled to offer a platform that marries these interests,
                contributing to a transparent, decentralized, and exciting
                future.
              </p>
              <p className="mt-4 text-xl text-gray-500">
                Remember: it`s not just about guessing who will win, it`s about
                participating in the process and the thrill of following these
                significant events.
              </p>
              <p className="mt-4 text-xl text-gray-500 font-bold">
                Join us in this new era of political engagement!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
