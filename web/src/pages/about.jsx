import React from "react";

const AboutElectionBetting = () => {
  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            About ElectionBetting
          </h2>
        </div>
        <div className="mt-12">
          <div className="text-center">
            <p className="text-xl text-white">
              Welcome to the ElectionBetting Platform, where political
              enthusiasts meet cutting-edge technology!
            </p>
            <p className="mt-4 text-xl text-white">
              Our platform leverages the power of blockchain and artificial
              intelligence to provide a unique and thrilling experience.
              Developed on the Ethereum network, ElectionBetting allows users to
              place bets on the outcomes of political events - starting with the
              2023 Turkish General Elections.
            </p>
            <p className="mt-4 text-xl text-white">
              Our transparent and secure smart contracts are the backbone of our
              platform. These contracts not only enable the betting
              functionality but also manage payouts, all in a fully automated,
              decentralized manner.
            </p>
            <p className="mt-4 text-xl text-white">
              To provide real-time and reliable data, we integrate with
              Chainlink, a leading decentralized oracle network. Chainlink nodes
              fetch election results from authoritative sources like Wikipedia.
              We then utilize OpenAI`s language processing model, GPT-4, to
              interpret the data and determine the winner.
            </p>
            <p className="mt-4 text-xl text-white">
              At ElectionBetting, we are passionate about blockchain technology,
              fair elections, and innovative applications of AI. We`re thrilled
              to offer a platform that marries these interests, contributing to
              a transparent, decentralized, and exciting future.
            </p>
            <p className="mt-4 text-xl text-white">
              Remember: it`s not just about guessing who will win, it`s about
              participating in the process and the thrill of following these
              significant events.
            </p>
            <p className="mt-4 text-xl text-white font-bold">
              Join us in this new era of political engagement!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutElectionBetting;
