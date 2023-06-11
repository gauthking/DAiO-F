import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";
import RegistrationPage from "./components/RegistrationPage";
import AddProposal from "./components/AddProposal";
import { AppProvider } from "./appConfig";

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/RegistrationPage" element={<RegistrationPage />} />
          <Route path="/AddProposal" element={<AddProposal />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
