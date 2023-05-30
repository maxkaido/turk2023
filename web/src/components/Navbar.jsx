import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import EthereumContext from "../context/EthereumContext";

export default function Navbar() {
  const { state, setState } = useContext(EthereumContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

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

  const handleMenuLinkClick = (path) => {
    router.push(path);
    setMenuOpen(false);
  };

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
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div>
          <div className="px-2 pt-2 pb-3 sm:px-3">
            <p className="text-white" onClick={() => handleMenuLinkClick("/")}>
              Home
            </p>
            <p
              className="text-white"
              onClick={() => handleMenuLinkClick("/about")}
            >
              About
            </p>
            <p
              className="text-white"
              onClick={() => handleMenuLinkClick("/turkey-2023")}
            >
              Turkey 2023
            </p>
            <p
              className="text-white"
              onClick={() => handleMenuLinkClick("/argentina-2023")}
            >
              Argentina 2023
            </p>
            <p
              className="text-white"
              onClick={() => handleMenuLinkClick("/uk-2024")}
            >
              UK 2024
            </p>
            <p
              className="text-white"
              onClick={() => handleMenuLinkClick("/usa-2024")}
            >
              USA 2024
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
