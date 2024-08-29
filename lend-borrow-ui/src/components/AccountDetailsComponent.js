import React, { useContext } from "react";
import { Button } from "reactstrap";
import { WalletContext } from "../context/Context";

const AccountDetailsComponent = ({ setIsAccountsComponent }) => {
  const { address } = useContext(WalletContext);

  return (
    <div
      className="card"
      style={{ width: "350px", color: "white", height: "fit-content" }}
    >
      <button
        className="back-button"
        onClick={() => setIsAccountsComponent(false)}
      >
        ⬅
      </button>

      <h4>Account Details</h4>
      <div style={{ marginBottom: "20px" }}>Address : {address}</div>

      <div className="transact-details">
        <div className="details-title">Assets Supplied</div>
        <div>0.0</div>
      </div>
      <div className="transact-details">
        <div className="details-title">Asset Borrowed</div>
        <div>0.0</div>
      </div>
    </div>
  );
};
export default AccountDetailsComponent;
