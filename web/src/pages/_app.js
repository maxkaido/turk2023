import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import EthereumContext from "../context/EthereumContext";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  const [sharedState, setSharedState] = useState({
    account: "",
    provider: null,
    contract: null,
  });

  return (
    <>
      <>
        <EthereumContext.Provider
          value={{ state: sharedState, setState: setSharedState }}
        >
          <Navbar />
          <Component {...pageProps} />
        </EthereumContext.Provider>
        <Toaster />
      </>
      <Footer />
      <Analytics />
    </>
  );
}
