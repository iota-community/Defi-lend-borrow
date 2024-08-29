import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Context } from "../context/Context";
import { ASSETLIST } from "../utils/constants";

const AccountDetails = ({ setIsAccountsComponent }) => {
  const { address } = useContext(Context);

  return (
    <div
      className="card"
      style={{ width: "95%", color: "white", height: "fit-content" }}
    >
      <button
        className="back-button"
        onClick={() => setIsAccountsComponent(false)}
      >
        ⬅
      </button>

      <h4>Account Details</h4>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
          display: "flex",
        }}
      >
        {" "}
        <div
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Address
        </div>{" "}
        {address}
      </div>

      <div className="list">
        <div className="headers-list">
          <div className="headers">Asset</div>
          <div className="headers">Total Borrow</div>
          <div className="headers">Total Supply</div>
          <div className="headers">Liquidity</div>
          <div className="headers">Price</div>
        </div>
        {ASSETLIST.map((asset, index) => (
          <div
            key={index}
            className="asset-row"
            // onClick={() => setSelectedAsset(asset)}
          >
            <div className="row-entry">{asset.assetName}</div>
            <div className="row-entry">
              {asset.totalBorrow.toLocaleString()}
            </div>
            <div className="row-entry">
              {asset.totalSupply.toLocaleString()}
            </div>
            <div className="row-entry">{asset.liquidity.toLocaleString()}</div>
            <div className="row-entry">{`$${asset.price.toFixed(2)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AccountDetails;
