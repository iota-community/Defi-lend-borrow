import React, { useContext } from "react";
import "./App.css";
import { WalletContext } from "./context/WalletContext";
import { NavigationBar } from "./components/NavigationBar";
import LendBorrowPlatformDetails from "./components/LendBorrowPlatformDetails";
import TransactionsCard from "./components/TransactionsCard";

const App = () => {
  const { address, tokenBal } = useContext(WalletContext);
  console.log(tokenBal);
  return (
    <div className="app">
      <div>
        <NavigationBar />
        <LendBorrowPlatformDetails />
      </div>
      <TransactionsCard />
    </div>
  );
};

export default App;
