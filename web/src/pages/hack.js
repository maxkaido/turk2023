import { useEffect } from "react";
import CountdownTimerV2 from "../components/CountdownTimerV2";

const hackathonEnd = new Date("2023-06-24T11:00:00-04:00");

export default function Home() {
  useEffect(() => {
    // Add any necessary logic or side effects here
  }, []);

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-center mb-10">
          <a href="https://www.youtube.com/watch?v=IBMzkKl-7EI">
            Chainlink Spring 2023 Hackathon
          </a>
        </h1>
        <CountdownTimerV2
          timestamp={hackathonEnd.getTime()}
          suppressHydrationWarning={true}
        />
      </div>
    </main>
  );
}
