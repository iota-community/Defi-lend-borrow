import React, { useState, useContext } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Button } from "reactstrap";

const Supply = () => {
  const [value, setValue] = useState(0.0);
  const { connectWallet, address } = useContext(WalletContext);
  const transact = () => {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="0.00"
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
export default Supply;
