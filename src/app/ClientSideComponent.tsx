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

  useEffect(() => {
    // Perform client-side calculations
    const calculatedResult = 2 + 2;
    setResult(calculatedResult);
  }, []);

  return (
    <div>
      {/* Display the result */}
      {result && <p>Result: {result}</p>}
      <div>
        <h1>Welcome to ElectroVote Oracle</h1>
        <button onClick={requestAccount}>Connect Wallet</button>
        <h2>Current account: {account}</h2>
        <button onClick={() => bet("candidate1")}>Bet on Candidate 1</button>
        <button onClick={() => bet("candidate2")}>Bet on Candidate 2</button>
      </div>
    </div>
  );
}

export default ClientSideComponent;
