import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Context } from "../context/Context";
import { ASSETLIST } from "../utils/constants";

const AccountDetails = ({ setIsAccountsComponent }) => {
  const { address } = useContext(Context);

  return (
    <div>
      <h4 style={{ color: "white", marginLeft: "75px", marginBottom: "40px" }}>
        Account Details
      </h4>
      <div style={{ display: "flex", gap: "30px" }}>
        <div
          className="card"
          style={{
            width: "40%",
            color: "white",
            height: "fit-content",
            padding: "14px",
          }}
        >
          <div className="dashboard-subheading">Supplies</div>

          <button
            style={{ top: "-100%" }}
            className="back-button"
            onClick={() => setIsAccountsComponent(false)}
          >
            ⬅
          </button>

          <div className="list">
            <div className="headers-list">
              <div className="headers">Asset</div>
              <div className="headers">Total Supply</div>
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
                  {asset.totalSupply.toLocaleString()}
                </div>
                <div className="row-entry">{`$${asset.price.toFixed(2)}`}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="card"
          style={{
            width: "40%",
            color: "white",
            height: "fit-content",
            padding: "14px",
          }}
        >
          {" "}
          <div className="dashboard-subheading">Borrows</div>
          <div className="list">
            <div className="headers-list">
              <div className="headers">Asset</div>
              <div className="headers">Total Borrow</div>
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
                  {asset.totalSupply.toLocaleString()}
                </div>
                <div className="row-entry">{`$${asset.price.toFixed(2)}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountDetails;
