import Head from 'next/head'
import Image from 'next/image'
import styles from './index.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Assetz Capital Technical Challenge</title>
      </Head>

      <header className={styles.header}>
        Logo
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </>
  )
}
