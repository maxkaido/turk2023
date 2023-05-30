import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import EthereumContext from "../context/EthereumContext";
import p from "../../package.json";
import NetworkSwitch from "@/components/NetworkSwitch";

export default function Navbar() {
  const [selectedNetwork, setSelectedNetwork] = useState("avalanche"); // Default selected network is "avalanche"
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
            <button
              className="text-white focus:outline-none mr-4"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0">
              <p className="text-white text-sm font-bold">
                Election Betting | v{p.version}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <NetworkSwitch
              selectedNetwork={selectedNetwork}
              onNetworkChange={setSelectedNetwork}
            />
          </div>
          <div className="flex items-center">
            {state.account ? (
              <p className="text-white text-sm mr-4">{trimmedAddress}</p>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded"
                onClick={requestAccount}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="px-4 pt-2 pb-4 sm:px-6">
          <div className="space-y-2">
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
              onClick={() => handleMenuLinkClick("/")}
            >
              Home
            </p>
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
              onClick={() => handleMenuLinkClick("/about")}
            >
              About
            </p>
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
              onClick={() => handleMenuLinkClick("/turkey-2023")}
            >
              Turkey 2023
            </p>
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
              onClick={() => handleMenuLinkClick("/argentina-2023")}
            >
              Argentina 2023
            </p>
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
              onClick={() => handleMenuLinkClick("/uk-2024")}
            >
              UK 2024
            </p>
            <p
              className="text-white text-sm cursor-pointer hover:text-gray-300"
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
