import { Lato } from "@next/font/google";
import type { AppProps } from "next/app";

import styles from "./_app.page.module.css";
import "../styles/globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={lato.className}>
      <header className={styles.header}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.logo}
          src="https://www.assetzcapital.co.uk/images/logo-white.svg"
          alt=""
        />
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
