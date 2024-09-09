import React, { useState, useEffect } from "react";
import {
  getAllSupportedTokens,
  getTokenName,
  getItokenDetails,
} from "../../utils/ethersUtils";
import ReactLoading from "react-loading";
import { getTokenUsdPrice } from "../../utils/ethersUtils";

const AllAssetsList = ({
  setSelectedAsset,
  setTotalSuppliesSum,
  setTotalBorrowsSum,
}) => {
  const [allAssets, setAllAssets] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);

    const init = async () => {
      // Fetch all supported tokens (both underlying and iTokens)
      const { underlyingSupported, iTokenSupported } =
        await getAllSupportedTokens();

      // Map over the supported tokens and fetch token details
      const assetsArray = await Promise.all(
        underlyingSupported.map(async (underlyingAddress, index) => {
          const iTokenAddress = iTokenSupported[index];

          // Fetch data from the underlying token
          const tokenName = await getTokenName(underlyingAddress);
          // const tokenPriceInUSD = await getTokenUsdPrice(iTokenAddress);
          const tokenPriceInUSD = 1;
          // Fetch data from the iToken
          const tokenDetails = await getItokenDetails(iTokenAddress);

          // Combine the data into a single object
          return {
            assetName: tokenName,
            underlyingAddress,
            iTokenAddress,
            totalBorrow: tokenDetails.totalBorrows,
            totalSupply: tokenDetails.totalSupply,
            collateralFactor: tokenDetails.collateralFactor,
            liquidity: Math.floor(Math.random() * 1000),
            price: tokenPriceInUSD ? tokenPriceInUSD : 0,
          };
        })
      );

      // Calculate the total supplies and borrows sum
      const totalSupplies = assetsArray.reduce((sum, asset) => {
        return sum + parseFloat(asset.totalSupply || 0);
      }, 0);

      const totalBorrows = assetsArray.reduce((sum, asset) => {
        return sum + parseFloat(asset.totalBorrow || 0);
      }, 0);

      setAllAssets(assetsArray);
      setTotalSuppliesSum(totalSupplies);
      setTotalBorrowsSum(totalBorrows);
    };
    init();
    setIsLoading(false);
  }, []);
  console.log("allAssets", allAssets);

  return (
    <div>
      {!isLoading ? (
        <div className="list" style={{ width: "80%" }}>
          <div className="headers-list">
            <div className="headers">Asset</div>
            <div className="headers"> Address</div>
            <div className="headers">Total Borrow</div>
            <div className="headers">Total Supply</div>
            <div className="headers">Collateral Factor</div>
            <div className="headers">Price</div>
          </div>
          {allAssets.map((asset, index) => (
            <div
              key={index}
              className="asset-row"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="row-entry">{asset.assetName}</div>

              <div className="row-entry">
                <a
                  href={`https://explorer.evm.testnet.shimmer.network/address/${asset.iTokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${asset.iTokenAddress.substring(0, 7)}...`}
                </a>
              </div>
              <div className="row-entry">
                {asset.totalBorrow && asset.totalBorrow.slice(0, 6)}
              </div>
              <div className="row-entry">
                {asset.totalSupply && asset.totalSupply.slice(0, 6)}
              </div>
              <div className="row-entry">
                {asset.collateralFactor
                  ? asset.collateralFactor.toString()
                  : "N/A"}
              </div>
              {asset.price && (
                <div className="row-entry">{`$${asset.price?.toFixed(2)}`}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          "Loading Tokens data ......"
          <ReactLoading type={"spin"} color={"white"} height={20} width={20} />
        </>
      )}
    </div>
  );
};

export default AllAssetsList;
