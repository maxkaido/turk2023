"use client";
import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import CountdownTimer from "../components/CountdownTimer";
import ElectionBettingArtifact from "../../artifacts/ElectionBetting.json";
import About from "../components/About";
import EthereumContext from "../context/EthereumContext";
import Navbar from "@/components/Navbar";
import Candidate from "@/components/Candidate";
import Bets from "@/components/Bets";
import ServiceFee from "@/components/ServiceFee";
import BettingEndTime from "@/components/BettingEndTime";
import OwnerActions from "@/components/OwnerActions";

// const sepoliaContractAddress = "0x460DeFA3ed9986f21C588ab611cE78d0496EadFA";
const avalancheContractAddress = "0x179cc4C03f6Bea57c70fAcaEa4EdC4E6DC2B2803";

const contractAddress = avalancheContractAddress;

const ETHEREUM_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd";

export default function Home() {
  const { state, setState } = useContext(EthereumContext);
  const [bets, setBets] = useState([]);
  const [betAmountErdogan, setBetAmountErdogan] = useState("");
  const [betAmountKemal, setBetAmountKemal] = useState("");
  const [userTotalBetErdogan, setUserTotalBetErdogan] = useState(0);
  const [totalBetErdogan, setTotalBetErdogan] = useState(0);
  const [userTotalBetKemal, setUserTotalBetKemal] = useState(0);
  const [totalBetKemal, setTotalBetKemal] = useState(0);
  const [serviceFeePercentage, setServiceFeePercentage] = useState(0);
  const [bettingEndTime, setBettingEndTime] = useState(null);
  const [ethPriceUSD, setEthPriceUSD] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  }, []);

  useEffect(() => {
    if (state.account) {
      loadBlockchainData();
    }
  }, [state.account]);

  useEffect(() => {
    if (state.contract && state.account) {
      fetchData();
    }
  }, [state.contract, state.account]);

  useEffect(() => {
    fetchEthPriceUSD();
  }, []);

  async function fetchEthPriceUSD() {
    try {
      const response = await fetch(ETHEREUM_API_URL);
      const data = await response.json();
      const ethPrice = data["avalanche-2"].usd;
      setEthPriceUSD(ethPrice);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setState((prevState) => ({ ...prevState, provider }));

    const signer = provider.getSigner();
    const account = await signer.getAddress();
    setState((prevState) => ({ ...prevState, account }));

    const contract = new ethers.Contract(
      contractAddress,
      ElectionBettingArtifact.abi,
      signer
    );
    console.log("Contract object", contract);
    setState((prevState) => ({ ...prevState, contract }));

    const owner = await contract.owner();
    setIsOwner(owner === account);
  }

  async function fetchData() {
    try {
      const pastEvents = await state.contract.queryFilter("BetMade");
      const pastBets = pastEvents.map((event) => ({
        bettor: event.args.bettor,
        amount: ethers.utils.formatEther(event.args.amount),
        candidate: event.args.candidate,
      }));
      setBets(pastBets);

      await Promise.all([
        getUserBet("Erdogan"),
        getTotalBet("Erdogan"),
        getUserBet("Kemal"),
        getTotalBet("Kemal"),
        getServiceFeePercentage(),
        getBettingEndTime(),
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  async function makeBet(candidate, betAmount) {
    try {
      if (!state.contract) return;
      const value = ethers.utils.parseEther(betAmount.toString());
      const tx = await state.contract.makeBet(candidate, { value });
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  async function withdraw() {
    try {
      if (!state.contract) return;
      const tx = await state.contract.withdraw();
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  async function claimWinnings() {
    try {
      if (!state.contract) return;
      const tx = await state.contract.claimWinnings();
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  async function getServiceFeePercentage() {
    try {
      const feePercentage = await state.contract.serviceFeePercentage();
      setServiceFeePercentage(feePercentage.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  async function getBettingEndTime() {
    try {
      const endTime = await state.contract.bettingEndTime();
      setBettingEndTime(endTime.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  async function getUserBet(candidate) {
    try {
      const userBet = await state.contract.calculateUserBet(
        state.account,
        candidate,
        {
          from: state.account,
        }
      );
      const formattedUserBet = Number(ethers.utils.formatEther(userBet));

      if (candidate === "Erdogan") {
        setUserTotalBetErdogan(formattedUserBet);
      } else if (candidate === "Kemal") {
        setUserTotalBetKemal(formattedUserBet);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getTotalBet(candidate) {
    try {
      const totalBetAmount = await state.contract.totalBets(candidate, {
        from: state.account,
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
  }

  const targetDate = new Date("2023-06-10T00:00:00");

  const userBetPercentageErdogan = userTotalBetErdogan / totalBetErdogan;
  const serviceFeeAmountErdogan =
    (userTotalBetKemal * serviceFeePercentage) / 100;
  const remainingBetAmountErdogan = totalBetKemal - serviceFeeAmountErdogan;
  const possibleWinAmountErdogan =
    userBetPercentageErdogan * remainingBetAmountErdogan;

  const userBetPercentageKemal = userTotalBetKemal / totalBetKemal;
  const serviceFeeAmountKemal =
    (userTotalBetErdogan * serviceFeePercentage) / 100;
  const remainingBetAmountKemal = totalBetErdogan - serviceFeeAmountKemal;
  const possibleWinAmountKemal =
    userBetPercentageKemal * remainingBetAmountKemal;

  const formatEthValueInUSD = (ethValue) => {
    return (ethValue * ethPriceUSD).toFixed(2);
  };

  const declareWinner = async (candidate) => {
    try {
      if (!state.contract) return;
      const tx = await state.contract.declareWinner(candidate);
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-center mb-10">Turk Election Bet</h1>
        <CountdownTimer
          targetDate={targetDate}
          suppressHydrationWarning={true}
        />
        <h2 className="text-3xl text-center my-10">
          Bet on the next Turkish president
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <Candidate
            imageSrc="/c1.jpg"
            name="Recep Tayyip Erdoğan"
            betAmount={betAmountErdogan}
            setBetAmount={setBetAmountErdogan}
            makeBet={makeBet}
            userTotalBet={userTotalBetErdogan}
            withdraw={withdraw}
            claimWinnings={claimWinnings}
            totalBet={totalBetErdogan}
            possibleWinAmount={possibleWinAmountErdogan}
            formatEthValueInUSD={formatEthValueInUSD}
          />
          <Candidate
            imageSrc="/c2.jpg"
            name="Kemal Kılıçdaroğlu"
            betAmount={betAmountKemal}
            setBetAmount={setBetAmountKemal}
            makeBet={makeBet}
            userTotalBet={userTotalBetKemal}
            withdraw={withdraw}
            claimWinnings={claimWinnings}
            totalBet={totalBetKemal}
            possibleWinAmount={possibleWinAmountKemal}
            formatEthValueInUSD={formatEthValueInUSD}
          />
        </div>
      </div>
      <Bets bets={bets} formatEthValueInUSD={formatEthValueInUSD} />
      <About />
      <ServiceFee serviceFeePercentage={serviceFeePercentage} />
      <BettingEndTime bettingEndTime={bettingEndTime} />
      {isOwner && <OwnerActions declareWinner={declareWinner} />}
    </main>
  );
}
