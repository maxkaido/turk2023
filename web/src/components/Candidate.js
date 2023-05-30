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
        placeholder="Enter Bet Amount (AVA)"
        className="bg-gray-100 text-black rounded py-2 px-4 mb-4 w-28"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        min="0"
        maxLength={7}
      />
      <button
        onClick={() => makeBet(name, betAmount)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
      >
        Bet on {name}
      </button>
      {userTotalBet > 0 ? (
        <>
          <button
            onClick={withdraw}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
          >
            Withdraw
          </button>
          <button
            onClick={claimWinnings}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
          >
            Claim Winnings
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
            disabled
          >
            Withdraw
          </button>
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
            disabled
          >
            Claim Winnings
          </button>
        </>
      )}
      <div className="mt-6">
        <p>
          Current Bet: <span>{userTotalBet}</span> AVA ≈ $
          {formatEthValueInUSD(userTotalBet)}
        </p>
        {possibleWinAmount > 0 && (
          <p>
            Possible Win: <span>+{possibleWinAmount.toFixed(2)}</span> AVA ≈ $
            {formatEthValueInUSD(possibleWinAmount)}
          </p>
        )}
        <p>
          Total Bet: <span>{totalBet}</span> AVA ≈ $
          {formatEthValueInUSD(totalBet)}
        </p>
      </div>
    </div>
  );
}
