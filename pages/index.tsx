import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import EPSButton from "../components/EPSButton";
import { useState, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import EPSAPI from "../contract/abi.json";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { createUser } from "../lib/mongo/users";


const Home: NextPage = () => {
 
  const [decoded, setDecoded] = useState<string | null>(null);
  const router = useRouter();
  const token = router.query.token as string;
  const JWT_KEY = process.env.NEXT_PUBLIC_JWT_KEY as string;
  const { address, isConnecting, isDisconnected } = useAccount();
  const [hotWallet, setHotWallet] = useState<string>("");
  const [recordedWallet, setrecordedWallet] = useState<string>("");
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };


  useEffect(() => {
    async function verifyToken() {
      try {
        const decodedToken = await jwt.verify(token, JWT_KEY);
        console.log("🦄🦄🦄", decodedToken);
        setDecoded(decodedToken as string);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) {
      verifyToken();
    }
  }, [token]);


 

  useEffect(() => {
    if (address) {
      setHotWallet(address);
    }
  }, [address]);

  const { data, isError, isLoading } = useContractRead({
    address: "0x0000000000000aF8FE6E4DE40F4804C90fA8Ea8F",
    abi: EPSAPI,
    functionName: "hotToRecord",
    args: [address],
  });


  function recordUserWallet(){
    if(!checked){
      setrecordedWallet(address as string)
    }else{
       setrecordedWallet((data as any).cold) 
    }
  
  }

  const handleCreateUser = async () => {
    setConfirmed(true)
    recordUserWallet();
    console.log(checked)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          _id:(decoded as any).id,
          guild_id:(decoded as any).guildId,
          address:recordedWallet as string,
          network:"Mumbai",
          wins:0,
          losses:0,
          played_today:0,
         

          
        }),
        
      });
      console.log("🌸🌸🌸",(decoded as any).id);
    } catch (error) {
      console.error(error);
    }
  };

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

      <main className={styles.main} suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <ConnectButton />
        
  {data && (data as any).cold && confirmed !== true && (
    
    <div style={{ border: '1px solid #ddd', padding: 16, marginBottom: 32 }}>
   <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
  Hot Wallet: 
</p>{hotWallet}
<p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
  EPS Connected Cold Wallet: 
</p>{(data as any).cold}

          
      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            style={{ marginRight: 8 }}
          />
          <span style={{ fontSize: 14 }}>
            If you don't use EPS and your wassie is NOT on the EPS wallet. Check the box 
          </span>
        </label>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleCreateUser} style={{ padding: 8, borderRadius: 8, backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  )}

  {confirmed === true && (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 24, fontWeight: 'bold' }}>Thank you!</p>
    </div>
  )}
</main>

  
     
      <footer className={styles.footer}>
        <a
          href="https://blossomdao.space"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by your frens at BlossomDAO
        </a>
      </footer>
    </div>
  );
};

export default Home;
