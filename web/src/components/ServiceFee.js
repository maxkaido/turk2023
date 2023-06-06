export default function ServiceFee({ serviceFeePercentage }) {
  return (
    <div className="p-4">
      <h1 className="text-1xl font-bold mb-4">Service Fee Percentage</h1>
      <p>Current service fee percentage: {serviceFeePercentage}%</p>
    </div>
  );
}
