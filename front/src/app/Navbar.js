"use client";
import React from "react";
import Provider from "./Provider";

const Navbar = ({ walletAddress, connectWallet }) => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <p className="text-white">TurkElectro Oracle</p>
            </div>
          </div>
          <Provider />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
