import React, { useState, useContext } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Button } from "reactstrap";

const TransactionForm = ({ activeTab }) => {
  const [value, setValue] = useState(0.0);
  const { connectWallet, address } = useContext(WalletContext);

  const transact = () => {
    // Logic to handle the transaction based on the active tab
    switch (activeTab) {
      case "Supply":
        // Handle supply logic
        break;
      case "Withdraw":
        // Handle withdraw logic
        break;
      case "Borrow":
        // Handle borrow logic
        break;
      case "Repay":
        // Handle repay logic
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${activeTab} amount`}
        className="transact-input"
      />
      <Button
        className="connect-btn"
        style={{ background: "rgb(45 53 73)" }}
        onClick={() => (!address ? connectWallet() : transact())}
        color="primary"
        block
      >
        {address ? "Transact" : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default TransactionForm;
