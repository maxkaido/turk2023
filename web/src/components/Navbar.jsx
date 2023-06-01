import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import EthereumContext from "../context/EthereumContext";
import p from "../../package.json";
import NetworkSwitch from "@/components/NetworkSwitch";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Turkey 2023", href: "/turkey-2023" },
  { name: "Argentina 2023", href: "/argentina-2023" },
  { name: "UK 2024", href: "/uk-2024" },
  { name: "USA 2024", href: "/usa-2024" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [selectedNetwork, setSelectedNetwork] = useState("avalanche"); // Default selected network is "avalanche"
  const { state, setState } = useContext(EthereumContext);
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

  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center text-gray-200 hidden lg:block font-semibold">
                  Wiki Crypto Bet - v{p.version}
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <NetworkSwitch
                    selectedNetwork={selectedNetwork}
                    onNetworkChange={setSelectedNetwork}
                  />
                </div>
                <div className="flex items-center ml-4">
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
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    router.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
