import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import EthereumContext from "../context/EthereumContext";

export default function Navbar() {
  const { state, setState } = useContext(EthereumContext);
  const [menuOpen, setMenuOpen] = useState(false);

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
              <p className="text-white mr-4">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {trimmedAddress}
              </p>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={requestAccount}
              >
                Connect Wallet
              </button>
            )}
          </div>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Menu items go here */}
            <p className="text-white">Home</p>
            <p className="text-white">About</p>
            <p className="text-white">Turkey 2023</p>
            <p className="text-white">Argentina 2023</p>
            <p className="text-white">Argentina 2023</p>
            <p className="text-white">UK 2024</p>
            <p className="text-white">US 2024</p>
          </div>
        </div>
      )}
    </nav>
  );
}
