import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Context } from "../context/Context";
import "../App.css";

const ConnectWallet = () => {
  const { connectWallet, address, disconnectWallet } = useContext(Context);

  return (
    <div>
      {!address && (
        <Button
          className="connect-btn"
          onClick={() => (!address ? connectWallet() : disconnectWallet())}
          color="primary"
          block
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
