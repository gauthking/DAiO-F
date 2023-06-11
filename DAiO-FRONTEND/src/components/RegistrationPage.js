import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/RegistrationPage.module.css";
import Web3 from "web3";
import { AppConfig } from "../appConfig";
import instance from "./axios";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const web3 = new Web3();
  const {
    connectWallet,
    providerConnected,
    walletAddress,
    isRegistered,
    Register
  } = useContext(AppConfig);
  const navigate = useNavigate()
  const [aiAllow, setAiAllow] = useState(false)
  const [AIPkey, setAIPkey] = useState("")
  const [AIPubKey, setAIPubKey] = useState("")
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    question1: "Do you have prior experience or knowledge in the field of [specific field relevant to the DAO]?",
    question2: "Are you excited about joining the DAO community and actively participating in its activities?",
    question3: "Are you interested in collaborating with other members of the DAO to work on projects or initiatives?",
    question4: "Would you support the idea of creating a mentorship program within the DAO to help beginners in the field?",
    question5: "Should the DAO allocate resources to develop comprehensive educational materials and resources?",
  });

  const [formRes, setFormRes] = useState({
    res1: "",
    res2: "",
    res3: "",
    res4: "",
    res5: ""
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormRes((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  console.log(AIPkey, AIPubKey)
  console.log(walletAddress)
  const voteProposal = async (proposalId, proposalQues, proposalRes) => {
    try {
      console.log("jiji")
      const vote = instance.post('/vote', {
        walletAddress: walletAddress,
        response: {
          qnId: proposalId,
          question: proposalQues,
          res: proposalRes
        },
        AIPkey: AIPubKey,
        AIPvKey: AIPkey
      })
      console.log("posted")
    } catch (error) {
      console.log("An error occured while posting the registeration data - ", error)
    }

  }

  const register = async (aiAddress, status, e) => {
    e.preventDefault();
    if (status === 1) {
      setAiAllow(true);
    }
    await Register(aiAddress, status);
  };
  // console.log(providerConnected)

  useEffect(() => {
    connectWallet();
    const AIAccount = web3.eth.accounts.create();
    setAIPkey(AIAccount.privateKey);
    setAIPubKey(AIAccount.address);

  }, []);



  const handleNextPage = async (id, question, response, event) => {
    event.preventDefault();
    try {
      await voteProposal(id, question, response);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log("An error occurred while posting the registration data - ", error);
    }
  };

  const fundAI = async (e) => {
    e.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const recipientAddress = AIPubKey
    const amount = ethers.utils.parseUnits('0.05', 'ether')
    const transaction = {
      to: recipientAddress,
      value: amount,
    };
    const sendTransac = signer.sendTransaction(transaction);
    sendTransac.then((tx) => {
      console.log(`Tranferred 0.5Matic to AI-${AIPubKey} Transaction hash: ${tx.hash}`);
      // Wait for the transaction to be mined
      return tx.wait();
    }).then((receipt) => {
      console.log('Transaction was mined in block:', receipt.blockNumber);
      navigate("/Dashboard")
    }).catch((error) => {
      console.error('Error sending transaction:', error)
    });
  }

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => prevPage - 1);
  // };
  console.log(formRes.res1)
  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{formData.question1}</label>
              <input
                type="text"
                name="res1"
                onChange={handleInputChange}
                value={formRes.res1}
                className={styles.formInput}
                required
                disabled={!providerConnected}
              />
            </div>
            <button className={styles.nextButton} onClick={(event) => handleNextPage(0, formData.question1, formRes.res1, event)}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{formData.question2}</label>
              <input
                type="text"
                name="res2"
                onChange={handleInputChange}
                value={formRes.res2}
                className={styles.formInput}
                required
                disabled={!providerConnected}
              />
            </div>
            {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
            <button className={styles.nextButton} onClick={(event) => handleNextPage(1, formData.question2, formRes.res2, event)}>
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{formData.question3}</label>
              <input
                type="text"
                name="res3"
                onChange={handleInputChange}
                value={formRes.res3}
                className={styles.formInput}
                required
                disabled={!providerConnected}
              />
            </div>
            {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
            <button className={styles.nextButton} onClick={(event) => handleNextPage(2, formData.question3, formRes.res3, event)}>
              Next
            </button>

          </div>
        );
      case 4:
        return (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{formData.question4}</label>
              <input
                type="text"
                name="res4"
                onChange={handleInputChange}
                value={formRes.res4}
                className={styles.formInput}
                required
                disabled={!providerConnected}
              />
            </div>
            {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
            <button className={styles.nextButton} onClick={(event) => handleNextPage(3, formData.question4, formRes.res4, event)}>
              Next
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{formData.question5}</label>
              <input
                type="text"
                onChange={handleInputChange}
                value={formRes.res5}
                name="res5"
                className={styles.formInput}
                required
                disabled={!providerConnected}
              />
            </div>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={!providerConnected}
              onClick={(event) => handleNextPage(4, formData.question5, formRes.res5, event)}
            >
              Submit
            </button>
          </div>
        );
      case 6:
        return (
          <div className={styles.aiinfo}>
            <div>
              <div>AI Private Key : {AIPkey}</div>
              <div>AI Public Key : {AIPubKey}</div>
            </div>
            <div className={styles.aiinfo_consent}>If you consent to provide your AI Account the PERMISSIONS to vote on your behalf after the voting period ends, THEN please register!</div>
            <div className={styles.buttonboxes}>
              <button className={styles.aisubmit} onClick={(e) => register(AIPubKey, 1, e)}>Register with AI BASED Voting</button>
              <button className={styles.noaisubmit} onClick={(e) => register(AIPubKey, 0, e)}>Register with no AI Power</button>
            </div>

            {aiAllow && <button onClick={(e) => fundAI(e)} className={styles.fundbtn}>Fund Wallet with 0.05 Matic to cover gas fees made by AI AUTOMATED VOTE</button>}

          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
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
      <div >
        <h1 className={styles.title}>Onboarding</h1>
        <form
          className={styles.form}
          // onSubmit={handleSubmit}
          disabled={!walletConnected}
        >
          {renderFormPage()}
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
