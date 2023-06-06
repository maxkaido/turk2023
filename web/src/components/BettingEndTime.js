export default function BettingEndTime({ bettingEndTime }) {
  return (
    <div className="p-4">
      <h1 className="text-1xl font-bold mb-4">Betting End Time</h1>
      {bettingEndTime ? (
        <p>
          Betting end time: {new Date(bettingEndTime * 1000).toLocaleString()}
        </p>
      ) : (
        <p>Betting end time not available</p>
      )}
    </div>
  );
}
