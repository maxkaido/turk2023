import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import EthereumContext from "../context/EthereumContext";

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
          <Component {...pageProps} />
        </EthereumContext.Provider>
        <Toaster />
      </>
      <Analytics />
    </>
  );
}
