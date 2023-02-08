import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import EPSButton from '../components/EPSButton'
import { useState, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import EPSAPI from '../contract/abi.json'
import firebase from 'firebase/app';
import 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [addy, setHotWallet] = useState<any[]>([]);

// set the users hot wallet using RAINBOW
  useEffect(() => {
    if (address) {
      setHotWallet(address as any);
    }
  }, [address]);


//set the users cold wallet using EPS
const { data, isError, isLoading, error } = useContractRead({
  address: "0x0000000000000aF8FE6E4DE40F4804C90fA8Ea8F",
  abi: EPSAPI,
  functionName: "hotToRecord",
  args: [address],
});


// const firebaseConfig = {
//   apiKey: "AIzaSyAQbJVXAZIs_8f40C0Y0QU9F_GtvL3Oquc",
//   authDomain: "wassiebot.firebaseapp.com",
//   projectId: "wassiebot",
//   storageBucket: "wassiebot.appspot.com",
//   messagingSenderId: "1046948059755",
//   appId: "1:1046948059755:web:3e63074d12a49e53706f2e",
//   measurementId: "G-VL1YQRWC2X"
// };


//send data to db
useEffect(() => {
  if (address) {
    setHotWallet(address as any);
//     const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

   
  }
}, [address, data]);

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          name="description"
          content="Generated by @rainbow-me/create-rainbowkit"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
HOT WALLET: {addy} <br></br>
{data && data.cold && <p>EPS Connected COLD WALLET: {data.cold}</p>}
       

        <h1 className={styles.title}>
          Welcome to <a href="">Wassie</a><a href="">BATTLES</a> +{' '}
         
        </h1>

       
      </main>

      <footer className={styles.footer}>
        <a href="https://blossomdao.space" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at BlossomDAO
        </a>
      </footer>
    </div>
  );
};

export default Home;
