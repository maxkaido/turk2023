"use client";
import Image from "next/image";
import Navbar from "./Navbar";
import CountdownTimer from "./CountdownTimer";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const targetDate = new Date("2023-05-28T00:00:00");
  return (
    <main className="bg-gray-800 text-white min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-4xl text-center mb-10">Turk Election Bet</h1>
        <CountdownTimer targetDate={targetDate} />
        <h2 className="text-3xl text-center mb-10">
          {" "}
          Bet on the next Turkish president{" "}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Image
              src="/c1.jpg"
              alt="Erdogan"
              className="mx-auto mb-2 p-2"
              width={200}
              height={24}
              priority
            />
            <h1 className="text-2xl text-center mb-1">Recep Tayyip Erdoğan </h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
              Bet on Erdogan
            </button>
            <p>
              Current Bet: <span id="currentBet1">0</span> ETH
            </p>
            <p>
              Possible Win: <span id="possibleProfit1">0</span> ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">0</span> ETH
            </p>
          </div>
          <div className="text-center">
            <Image
              src="/c2.jpg"
              alt="Erdogan"
              className="mx-auto mb-2 p-2"
              width={200}
              height={24}
              priority
            />
            <h1 className="text-2xl text-center mb-1">Kemal Kılıçdaroğlu</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
              Bet on Kemal
            </button>
            <p>
              Current Bet: <span id="currentBet1">0</span> ETH
            </p>
            <p>
              Possible Win: <span id="possibleProfit1">0</span> ETH
            </p>
            <p>
              Total Bet: <span id="totalBet1">0</span> ETH
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
