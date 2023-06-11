export default function OwnerActions({ declareWinner, fulfill }) {
  return (
    <div className="p-4">
      <button
        onClick={() => setLatestResponse("Erdogan")}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
      >
        Declare Erdogan Winner
      </button>
      <button
        onClick={() => setLatestResponse("Kemal")}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
      >
        Declare Kemal Winner
      </button>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md my-2 mx-2"
        onClick={fulfill}
      >
        Declare via DON
      </button>
    </div>
  );
}
