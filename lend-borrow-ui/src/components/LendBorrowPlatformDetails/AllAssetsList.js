import React from "react";
import { ASSETLIST } from "../../utils/constants";

const AllAssetsList = ({ setSelectedAsset }) => {
  return (
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
          onClick={() => setSelectedAsset(asset)}
        >
          <div className="row-entry">{asset.assetName}</div>
          <div className="row-entry">{asset.totalBorrow.toLocaleString()}</div>
          <div className="row-entry">{asset.totalSupply.toLocaleString()}</div>
          <div className="row-entry">{asset.liquidity.toLocaleString()}</div>
          <div className="row-entry">{`$${asset.price.toFixed(2)}`}</div>
        </div>
      ))}
    </div>
  );
};

export default AllAssetsList;
