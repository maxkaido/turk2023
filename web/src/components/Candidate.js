import Image from "next/image";

export default function Candidate({
  imageSrc,
  name,
  betAmount,
  setBetAmount,
  makeBet,
  userTotalBet,
  withdraw,
  claimWinnings,
  totalBet,
  possibleWinAmount,
  formatEthValueInUSD,
  candidateIndex,
}) {
  return (
    <div className="p-6 rounded border-2 text-center">
      <Image
        src={imageSrc}
        alt={`${name}'s portrait`}
        className="mx-auto mb-4 p-2 object-cover h-64 w-48 rounded-md"
        width={200}
        height={200}
        priority
      />
      <h1 className="text-2xl mb-2">{name}</h1>
      <input
        type="number"
        placeholder="Enter Bet Amount (ETH)"
        className="bg-gray-100 text-black rounded py-2 px-4 mb-4 w-28"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        min="0"
        maxLength={7}
      />
      <button
        onClick={() => makeBet(candidateIndex, betAmount)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-2 mx-2"
      >
        Bet ${formatEthValueInUSD(betAmount)}
      </button>
      {userTotalBet > 0 ? (
        <>
          <button
            onClick={() => withdraw(candidateIndex)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 my-2 mx-2"
          >
            Withdraw
          </button>
          <button
            onClick={() => claimWinnings(candidateIndex)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 my-2 mx-2"
          >
            Claim Winnings
          </button>
        </>
      ) : (
        <>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 my-2 mx-2"
            disabled
          >
            Withdraw
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 my-2 mx-2"
            disabled
          >
            Claim Winnings
          </button>
        </>
      )}
      <div className="mt-6">
        <p>
          Current Bet: <span>{userTotalBet}</span> AVAX ≈ $
          {formatEthValueInUSD(userTotalBet)}
        </p>
        {possibleWinAmount > 0 && (
          <p>
            Possible Win: <span>+{possibleWinAmount.toFixed(2)}</span> AVAX ≈ $
            {formatEthValueInUSD(possibleWinAmount)}
          </p>
        )}
        <p>
          Total Bet: <span>{totalBet}</span> AVAX ≈ $
          {formatEthValueInUSD(totalBet)}
        </p>
      </div>
    </div>
  );
}
