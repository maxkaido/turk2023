import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import CountdownTimer from "../components/CountdownTimer";
import WikiWager from "../../artifacts/WikiWager.json";
import EthereumContext from "../context/EthereumContext";
import Candidate from "@/components/Candidate";
import Bets from "@/components/Bets";
import ServiceFee from "@/components/ServiceFee";
import BettingEndTime from "@/components/BettingEndTime";
import OwnerActions from "@/components/OwnerActions";

const sepoliaContractAddress = "0xd00877f1b2c5e38908e4AD6692A01B1E917C9CCc";

const contractAddress = sepoliaContractAddress;

const ETHEREUM_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

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
  const [latestResult, setLatestResult] = useState("");
  const [confirmations, setConfirmations] = useState(0);
  const requiredConfirmations = 2;

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
      const ethPrice = data["ethereum"].usd;
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
      WikiWager.abi,
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

      setLatestResult(await state.contract.getLatestResponse());

      // Get the confirmations count from the contract variable
      const contractConfirmations = await state.contract.eventConfirmation();
      const confirmations = contractConfirmations.count.toNumber();
      setConfirmations(confirmations);
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
    const candidateIndex = candidate === "Erdogan" ? 0 : 1;
    try {
      const userBet = await state.contract.calculateUserBet(
        state.account,
        candidateIndex,
        {
          from: state.account,
        }
      );
      const formattedUserBet = Number(ethers.utils.formatEther(userBet));

      if (candidateIndex === 0) {
        setUserTotalBetErdogan(formattedUserBet);
      } else if (candidateIndex === 1) {
        setUserTotalBetKemal(formattedUserBet);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getTotalBet(candidate) {
    const candidateIndex = candidate === "Erdogan" ? 0 : 1;
    try {
      const totalBetAmount = await state.contract.totalBets(candidateIndex, {
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

  async function fulfill() {
    try {
      if (!state.contract) return;
      const tx = await state.contract.fulfill();
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  const targetDate = new Date("2023-05-28T00:00:00");

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
            candidateIndex={0}
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
            candidateIndex={1}
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

        <h3 className="text-xl text-center mt-10">
          Latest Result: {latestResult}
        </h3>
        <p className="text-center">
          Result Confirmations: {confirmations} / {requiredConfirmations}
        </p>

        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={fulfill}
        >
          Fulfill
        </button>

        <Bets bets={bets} formatEthValueInUSD={formatEthValueInUSD} />
        <ServiceFee serviceFeePercentage={serviceFeePercentage} />
        <BettingEndTime bettingEndTime={bettingEndTime} />
        {isOwner && <OwnerActions declareWinner={declareWinner} />}
      </div>
    </main>
  );
}
