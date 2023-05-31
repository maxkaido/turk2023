import { useEffect } from "react";
import CountdownTimer from "../components/CountdownTimer";

export default function Home() {
  const targetDate = new Date("2023-06-10T00:00:00");

  useEffect(() => {
    // Add any necessary logic or side effects here
  }, []);

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-center mb-10">
          Chainlink Spring 2023 Hackathon
        </h1>
        <CountdownTimer
          targetDate={targetDate}
          suppressHydrationWarning={true}
        />
      </div>
      <div className="bg-gray-100">
        <header className="bg-blue-500">
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Election Betting</h1>
          </div>
        </header>
        <main className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Bet on your favorite candidate
              </h2>
              <p className="text-gray-700 mb-6">
                Welcome to Election Betting, where you can place bets on the
                upcoming election. Choose your candidate and enter the amount
                you want to bet. If your candidate wins, you`ll get a share of
                the total winnings. It`s easy, fun, and exciting!
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">How it works</h3>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>Choose your favorite candidate: Kemal or Erdogan.</li>
                  <li>Enter the amount you want to bet.</li>
                  <li>Wait for the election result.</li>
                  <li>
                    If your candidate wins, you`ll receive a portion of the
                    total winnings.
                  </li>
                </ol>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">
                  Important Information
                </h3>
                <p className="text-gray-700">
                  Betting is open until the specified end time. After that, the
                  result will be announced, and the winnings will be distributed
                  among the winners. Please note that there is a service fee
                  applied to the winnings.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Claim Your Winnings</h3>
                <p className="text-gray-700">
                  If you win, you can claim your winnings by clicking the `Claim
                  Winnings` button. The winnings will be transferred to your
                  account automatically.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Declare the Winner</h3>
                <p className="text-gray-700">
                  The winner will be declared automatically based on the
                  election result. However, in certain situations, the owner has
                  the authority to manually declare the winner.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Contact Support</h3>
                <p className="text-gray-700">
                  If you have any questions or need assistance, please contact
                  our support team at support@electionbetting.com.
                </p>
              </div>
              <div className="text-center">
                <a
                  href="/bet"
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Start Betting
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
