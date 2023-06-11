import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
import { AppConfig } from "../appConfig";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import moment from "moment";


const AddProposal = () => {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [title, setTitle] = useState("")
    const navigate = useNavigate();
    const handleDateTimeChange = (date) => {
        setSelectedDateTime(date);
    };
    console.log(moment(selectedDateTime).unix())
    const {
        connectWallet,
        providerConnected,
        walletAddress,
        error,
        isRegistered,
        AddProposal
    } = useContext(AppConfig);

    const addProposal = async () => {
        try {
            const time = Math.abs(moment().unix() - moment(selectedDateTime).unix())
            console.log(time)
            await AddProposal(title, time)
        } catch (error) {
            console.log("An error occured while creating the proposal")
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Add a New Proposal</h1>
            <h2 className={styles.subtitle}></h2>
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
            {error && <p className={styles.error}>{error.toString()}</p>}

            <div className={styles.proposalFields}>
                <p>Proposal Title</p>
                <input type="text" onChange={(e) => setTitle(e.target.value)} />

                <div>
                    <DateTimePicker
                        onChange={handleDateTimeChange}
                        value={selectedDateTime}
                    />
                </div>

                <button onClick={() => addProposal()}>Create New Proposal</button>
            </div>
        </div>
    );
};

export default AddProposal;