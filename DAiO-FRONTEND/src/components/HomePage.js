import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
import { AppConfig } from "../appConfig";

const HomePage = () => {
  const navigate = useNavigate();

  const {
    connectWallet,
    providerConnected,
    walletAddress,
    error,
    isRegistered,
  } = useContext(AppConfig);

  const routeTo = () => {
    if (isRegistered) {
      navigate("/Dashboard");
    } else {
      navigate("/RegistrationPage");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DAiO</h1>
      <h2 className={styles.subtitle}>Explore DAO x AI</h2>
      <button
        className={`${styles.connectButton} ${providerConnected ? styles.connected : ""
          }`}
        onClick={connectWallet}
        disabled={providerConnected}
      >
        {providerConnected ? (
          <>
            Connected:{" "}
            <span className={styles.walletAddress}>{walletAddress}</span>
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>
      <button
        disabled={!providerConnected}
        className={`${styles.mainBtn} ${providerConnected && isRegistered ? styles.getStarted : styles.onboard
          }`}
        onClick={() => routeTo()}
      >
        {providerConnected && isRegistered ? "Enter DAO" : "Onboard"}
      </button>
      {error && <p className={styles.error}>{error.toString()}</p>}
    </div>
  );
};

export default HomePage;
