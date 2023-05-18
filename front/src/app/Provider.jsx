"use client";

import { useEffect, useState, SetStateAction } from "react";
import { ethers } from "ethers";

function Provider() {
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
    if (!contract) return;
    const tx = await contract.bet(candidate);
    await tx.wait();
  }

  return (
    <div className="flex">
      {account ? (
        <p className="text-white mr-4">{account}</p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={requestAccount}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default Provider;
