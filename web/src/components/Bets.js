export default function Bets({ bets, formatEthValueInUSD }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bets</h1>
      {bets.map((bet, index) => (
        <div
          key={index}
          className="bg-gray-900 rounded shadow p-4 mb-4 text-gray-200"
        >
          <p className="text-sm">
            <span className="font-semibold">Bet Amount: </span>
            {bet.amount} AVAX ≈ ${formatEthValueInUSD(bet.amount)}
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
  );
}
