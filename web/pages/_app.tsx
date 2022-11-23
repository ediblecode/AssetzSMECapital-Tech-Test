import "../styles/globals.css";
import type { AppProps } from "next/app";
import styles from "./_app.module.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.logo}
          src="https://www.assetzcapital.co.uk/images/logo-white.svg"
          alt=""
        />
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
