import { useContext } from "react";
import EthereumContext from "../context/EthereumContext";

export default function Navbar() {
  const { state, setState } = useContext(EthereumContext);

  const trimmedAddress = state.account
    ? `${state.account.slice(0, 6)}...${state.account.slice(-4)}`
    : "";

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      setState((prevState) => ({ ...prevState, account }));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <p className="text-white">TurkElectro Oracle</p>
            </div>
          </div>
          <div className="flex">
            {state.account ? (
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
  );
}
