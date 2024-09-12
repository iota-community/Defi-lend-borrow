import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/Context";
import {
  getAllSupportedTokens,
  getTokenName,
  getItokenDetails,
  getTokenUsdPrice,
} from "../utils/ethersUtils";
import { ethers } from "ethers";

const AccountDetails = ({ setIsAccountsComponent }) => {
  const { address } = useContext(Context);
  const [allAssets, setAllAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const init = async () => {
      const { underlyingSupported, iTokenSupported } =
        await getAllSupportedTokens();

      const assetsArray = await Promise.all(
        underlyingSupported.map(async (underlyingAddress, index) => {
          const iTokenAddress = iTokenSupported[index];
          const tokenName = await getTokenName(underlyingAddress);
          // const tokenPriceInUSD = await getTokenUsdPrice(iTokenAddress);
          const tokenPriceInUSD = 1;
          const tokenDetails = await getItokenDetails(iTokenAddress);

          return {
            assetName: tokenName,
            underlyingAddress,
            iTokenAddress,
            totalBorrow: tokenDetails.totalBorrows,
            totalSupply: tokenDetails.totalSupply,
            price: tokenPriceInUSD ? tokenPriceInUSD : 0,
          };
        })
      );

      setAllAssets(assetsArray);
    };
    init();
    setIsLoading(false);
  }, []);

  const formatBigNumber = (value) => {
    if (ethers.BigNumber.isBigNumber(value)) {
      return parseFloat(ethers.utils.formatUnits(value, 18));
    }
    return parseFloat(value);
  };

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

          <div className="list-accounts" style={{ width: "470px !important" }}>
            <div className="headers-list">
              <div className="headers">Asset</div>
              <div className="headers">Total Supply</div>
              <div className="headers">Price</div>
            </div>
            {allAssets.map((asset, index) => (
              <div key={index} className="asset-row">
                <div className="row-entry">{asset.assetName}</div>
                <div className="row-entry">
                  {formatBigNumber(asset.totalSupply).toFixed(3)}
                </div>
                <div className="row-entry">{`$${
                  asset.price && asset.price.toFixed(2)
                }`}</div>
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
          <div className="dashboard-subheading">Borrows</div>
          <div className="list-accounts" style={{ width: "470px !important" }}>
            <div className="headers-list">
              <div className="headers">Asset</div>
              <div className="headers">Total Borrow</div>
              <div className="headers">Price</div>
            </div>
            {allAssets.map((asset, index) => (
              <div key={index} className="asset-row">
                <div className="row-entry">{asset.assetName}</div>

                <div className="row-entry">
                  {formatBigNumber(asset.totalBorrow).toFixed(3)}
                </div>
                <div className="row-entry">{`$${
                  asset.price && asset.price.toFixed(2)
                }`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
