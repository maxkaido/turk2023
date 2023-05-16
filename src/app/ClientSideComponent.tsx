"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

function ClientSideComponent() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Replace with your contract's ABI and address
  const contractABI = [];
  const contractAddress = "";

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  }, []);

  async function loadBlockchainData() {
    // Connect to Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const signer = provider.getSigner();
    const account = await signer.getAddress();
    setAccount(account);

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    setContract(contract);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    loadBlockchainData();
  }

  async function bet(candidate) {
    // Call the bet function on your contract
    const tx = await contract.bet(candidate);
    await tx.wait();
  }
  const [result, setResult] = useState(null);

  return (
    <div>
      {/* Display the result */}
      {result && <p>Result: {result}</p>}
      <div>
        <button
          onClick={requestAccount}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet
        </button>
        {account && (
          <p className="ml-4 text-sm text-gray-400">Connected: {account}</p>
        )}
      </div>
    </div>
  );
}

export default ClientSideComponent;
