import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import Head from "next/head";
import EthereumContext from "../context/EthereumContext";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import p from "../../package.json";

export default function App({ Component, pageProps }) {
  const [sharedState, setSharedState] = useState({
    account: "",
    provider: null,
    contract: null,
  });

  return (
    <>
      <Head>
        <title>Election Betting | v{p.version}</title>
        <meta name="description" content="Election Betting" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <>
        <EthereumContext.Provider
          value={{ state: sharedState, setState: setSharedState }}
        >
          <Navbar />
          <Component {...pageProps} />
        </EthereumContext.Provider>
        <Toaster />
        <Footer />
      </>
      <Analytics />
    </>
  );
}
