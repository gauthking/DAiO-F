import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/Dashboard.module.css";
import moment from "moment";

import { ethers } from "ethers";
import contr from "../ABI/abi.json";
import { AppConfig } from "../appConfig";
import { useNavigate } from "react-router-dom";
import instance from "./axios";

const contractAddress = "0xCA38E5C221653c9C73F906e18D3f201896Cb2cA6";
const ABI = contr;

const Dashboard = () => {
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [AIprivKey, setAIprivKey] = useState("")
  const [AIPbKey, setAIPbKey] = useState("")
  const [aiVotes, setAiVotes] = useState([]);
  const navigate = useNavigate()
  const {
    connectWallet,
    providerConnected,
    walletAddress,
    error,
    isRegistered,
    proposalData,
    VoteOnproposal,
    checkVoted,
    checkVotedAI
  } = useContext(AppConfig);

  const [walletConnected, setWalletConnected] = useState(false);
  console.log(proposalData)
  useEffect(() => {
    connectWallet();

  }, []);
  console.log(walletAddress)


  useEffect(() => {
    getKeys()
    const fetchDisabledButtons = async () => {
      const disabledButtons = await Promise.all(
        proposalData.map(async (proposal) => {
          const voted = await checkVoted(walletAddress, parseInt(proposal[0]._hex));
          return voted;
        })
      );
      setDisabledButtons(disabledButtons);
    };
    // const setAIVoteStatuses = async () => {
    //   let tempArr = []
    //   proposalData.map(async (proposal) => {
    //     // console.log(parseInt(proposal[0]._hex))
    //     const vote = await checkVotedAI(AIPbKey, parseInt(proposal[0]._hex));
    //     tempArr.push(vote)
    //   })
    //   setAiStatus(tempArr)
    // }
    // setAIVoteStatuses();
    fetchDisabledButtons();

  }, [walletAddress]);

  useEffect(() => {
    const fetchAiVotes = async () => {
      const votes = await Promise.all(
        proposalData.map(async (proposal) => {
          const vote = await checkVotedAI(AIPbKey, parseInt(proposal[0]._hex));
          return {
            proposalId: parseInt(proposal[0]._hex),
            voted: vote
          };
        })
      );
      setAiVotes(votes);
    };

    fetchAiVotes();
  }, [AIPbKey, proposalData]);

  console.log(AIPbKey)
  const handleConnectWallet = () => {
    if (providerConnected && isRegistered) {
      // Render the wallet address
      return (
        <>
          Connected:{" "}
          <span className={`${styles.walletAddress} ${styles.glowingText}`}>
            {walletAddress}
          </span>
        </>
      );
    } else if (providerConnected) {
      return "Onboard";
    } else {
      return "Connect Wallet";
    }
  };

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
        AIPkey: AIPbKey,
        AIPvKey: AIprivKey
      })
      console.log("posted")
    } catch (error) {
      console.log("An error occured while posting the registeration data - ", error)
    }

  }

  console.log(AIPbKey, AIprivKey)

  const getKeys = async () => {
    // console.log(await checkVoted(AIPbKey, 2))
    try {
      const response = await instance.post(`/getaikeys/${walletAddress}`);
      const keys = response.data;
      console.log("getkeys called")
      setAIprivKey(keys.AIPKey);
      setAIPbKey(keys.AIPubKey);
    } catch (error) {
      console.error("Error while fetching the keys:", error);
    }
  }

  const voteByUser = async (proposalId, proposalTitle, vote, e) => {
    try {
      e.preventDefault();
      const response = await instance.post(`/getaikeys/${walletAddress}`);
      const keys = response.data;

      console.log(keys);

      setAIprivKey(keys.AIPKey);
      setAIPbKey(keys.AIPubKey);

      console.log(AIprivKey);
      console.log(AIPbKey);

      const res = vote === 1 ? "Yes" : "No";
      await VoteOnproposal(proposalId, vote);
      const id = proposalId + 5
      await voteProposal(id, proposalTitle, res);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.connectButton} onClick={connectWallet}>
        {handleConnectWallet()}
      </button>

      <button className={styles.addProposalBtn} onClick={() => navigate("/AddProposal")}>Add Proposal</button>
      <div className={styles.userInfo}>
        <p>AI Public Key - {AIPbKey}</p>
        {aiVotes.map((vote) => (
          vote.voted && <div>AI Voted on Proposal ID - {vote.proposalId}</div>
        ))}
      </div>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.proposalGrid}>
        <section className={styles.activeProposalSection}>
          {proposalData.filter((x) => x[7] === true).map((proposal, index) => (
            <div className={styles.proposalBox}>
              <p>Proposal Id - {parseInt(proposal[0]._hex)}</p>
              <p>Proposal Title - {proposal[1]}</p>
              <div className={styles.votes}>
                <button onClick={(e) => voteByUser(parseInt(proposal[0]._hex), proposal[1], 1, e)}>Yes</button>
                <button onClick={(e) => voteByUser(parseInt(proposal[0]._hex), proposal[1], 0, e)}>No</button>
              </div>
              <div className={styles.votesBox}>
                <p>For Votes : {parseInt(proposal[3]._hex)}</p>
                <p>Against Votes : {parseInt(proposal[4]._hex)}</p>
              </div>
              <div className={styles.votesBox}>
                <p>Time Initiated : {moment.unix(parseInt(proposal[8]._hex)).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>Time Left From Initiation : {moment.utc(moment.duration(parseInt(proposal[10]._hex), 'seconds').asMilliseconds()).format("HH:mm:ss")}</p>
              </div>
            </div>
          ))}

        </section>
        <section className={styles.closedProposalSection}>

          {proposalData.filter((x) => x[7] === false).map((proposal, index) => (
            <div className={styles.proposalBoxComplete}>
              <p>Proposal Id - {parseInt(proposal[0]._hex)}</p>
              <p>Proposal Title - {proposal[1]}</p>

              <div className={styles.votesBox}>
                <p>For Votes : {parseInt(proposal[3]._hex)}</p>
                <p>Against Votes : {parseInt(proposal[4]._hex)}</p>
              </div>
              <div className={styles.votesBox}>
                <p>Time Initiated : {moment.unix(parseInt(proposal[8]._hex)).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>Time Left From Initiation <b>CLOSED</b></p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;