import React, { useContext } from "react";
import { Button } from "reactstrap";
import { WalletContext } from "../context/WalletContext";
import "../App.css";

const ConnectWallet = () => {
  const { connectWallet, address, disconnectWallet } =
    useContext(WalletContext);

  return (
    <div>
      <Button
        className="connect-btn"
        onClick={() => (!address ? connectWallet() : disconnectWallet())}
        color="primary"
        block
      >
        {address ? "Disconnect Wallet" : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default ConnectWallet;
