import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import contr from "./ABI/abi";

const contractAddress = "0x6684FFF5Acd83C6AF445950EeE88D3C1A668Ed59";
const ABI = contr;

export const AppConfig = createContext();

export const AppProvider = ({ children }) => {
  const [providerConnected, setProviderConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [proposalData, setProposalData] = useState([]);

  let signedContract;

  const requestAccount = async () => {
    const accns = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setProviderConnected(true);
    setWalletAddress(accns[0]);
  };

  useEffect(() => {
    console.log("heheh");
    const getProposals = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const providerContract = new ethers.Contract(
        contractAddress,
        ABI,
        signer
      );
      console.log("HIII");
      const proposals = await providerContract.proposalList();
      const proposalCount = await providerContract._proposalId();
      setProposalData(proposals);
      console.log(proposalData);
      console.log(proposalCount);
    };
    getProposals();
  }, [providerConnected]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const newsignedContract = new ethers.Contract(
        //   contractAddress,
        //   ABI,
        //   signer
        // );
        console.log("connected");
        setIsRegistered(await IsRegistered());
        console.log(isRegistered);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error);
    }
  };

  console.log(isRegistered);
  const Register = async (ai_address, ai_status) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    await newsignedContract.register(ai_address, ai_status);
  };

  const AddProposal = async (title, endtime) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    await newsignedContract.addProposal(title, endtime);
  };

  const VoteOnproposal = async (proposalId, vote) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    await newsignedContract.voteOnproposal(proposalId, vote);
  };

  const checkVoted = async (voter, proposalId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const voted = await newsignedContract.voted(voter, proposalId);
    return voted;
  };

  const checkVotedAI = async (voter, proposalId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const votedAI = await newsignedContract.votedAI(voter, proposalId);
    // console.log(votedAI)
    return votedAI;
  };

  const VoteOnproposalAI = async (proposalId, vote) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    await newsignedContract.voteOnproposalAI(proposalId, vote);
  };

  const RevokeAI = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    await newsignedContract.revokeAI();
  };

  const completedProposals = async () => {
    const compProposalArray = [];
    const ProposalCount = await signedContract._proposalId();

    for (let i = 0; i < ProposalCount; i++) {
      const isProposalCompleted = await signedContract.completed(i);
      compProposalArray.push(isProposalCompleted);
    }
    return compProposalArray;
  };

  const OwnerToAI = async (owner) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const ownerToAI = await signedContract.ownerAi(owner);
    return ownerToAI;
  };

  const AIToOwner = async (AI_addresss) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const aiToOwner = await newsignedContract.aiOwner(AI_addresss);
    return aiToOwner;
  };

  const MembersList = async () => {
    const memberList = [];
    const membersCount = await signedContract._membersCount();
    for (var i = 0; i < membersCount; i++) {
      const _members = await signedContract.memebers(i);
      memberList.push(_members);
    }
    return memberList;
  };

  const ProposalList = async () => {
    const proposalListArray = [];
    const proposalList = await signedContract.proposals();
    return proposalList;
  };

  const IsRegistered = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const Registered = await newsignedContract.checkRegistered();
    console.log(Registered);
    return Registered;
  };

  return (
    <AppConfig.Provider
      value={{
        isRegistered,
        Register,
        AddProposal,
        VoteOnproposal,
        VoteOnproposalAI,
        RevokeAI,
        completedProposals,
        OwnerToAI,
        AIToOwner,
        MembersList,
        ProposalList,
        connectWallet,
        providerConnected,
        walletAddress,
        error,
        proposalData,
        checkVoted,
        checkVotedAI,
      }}
    >
      {children}
    </AppConfig.Provider>
  );
};
