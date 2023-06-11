import React from "react";

const AboutWikiWager = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            About Wiki Wager
          </h2>
        </div>
        <div className="mt-12">
          <div className="text-center">
            <p className="text-lg text-gray-200">
              Welcome to Wiki Wager, where betting meets the power of
              technology!
            </p>
            <p className="mt-4 text-lg text-gray-200">
              Our platform is built on the Ethereum network and harnesses the
              potential of blockchain and artificial intelligence to provide an
              unparalleled betting experience. At Wiki Wager, you can place bets
              on the outcomes of various real-world events, starting with the
              2023 Turkish General Elections.
            </p>
            <p className="mt-4 text-lg text-gray-200">
              Our platform is backed by transparent and secure smart contracts
              that not only enable betting functionality but also handle payouts
              in a fully automated and decentralized manner.
            </p>
            <p className="mt-4 text-lg text-gray-200">
              To ensure real-time and reliable data, we have integrated with
              Chainlink, a leading decentralized oracle network. Chainlink nodes
              fetch election results from authoritative sources like Wikipedia.
              We then utilize the power of OpenAI`s language processing model,
              GPT-3.5, to interpret the data and determine the winners
              accurately.
            </p>
            <p className="mt-4 text-lg text-gray-200">
              At Wiki Wager, we are driven by our passion for blockchain
              technology, fair elections, and the innovative applications of AI.
              We are excited to offer a platform that combines these interests,
              contributing to a transparent, decentralized, and thrilling
              future.
            </p>
            <p className="mt-4 text-lg text-gray-200">
              Remember, Wiki Wager is not just about predicting winners; it`s
              about actively participating in the process and experiencing the
              excitement of these significant events firsthand.
            </p>
            <p className="mt-4 text-lg text-gray-200 font-bold">
              Join us in this new era of engaging and transparent betting!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutWikiWager;
