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
    </main>
  );
}
