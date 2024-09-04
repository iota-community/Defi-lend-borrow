import React, { useContext, useState } from "react";
import "./App.css";
import { Context } from "./context/Context";
import { NavigationBar } from "./components/NavigationBar";
import LendBorrowPlatformDetails from "./components/LendBorrowPlatformDetails";
import AllAssetsList from "./components/LendBorrowPlatformDetails/AllAssetsList";
import AccountDetails from "./components/AccountDetails";
import TransactionsCard from "./components/TransactionsCard";

const App = () => {
  const { address, tokenBal } = useContext(Context);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [isAccountsComponent, setIsAccountsComponent] = useState(false);
  const [totalSuppliesSum, setTotalSuppliesSum] = useState(0);
  const [totalBorrowsSum, setTotalBorrowsSum] = useState(0);

  return (
    <div className="app">
      <div>
        <NavigationBar setIsAccountsComponent={setIsAccountsComponent} />

        {isAccountsComponent ? (
          <AccountDetails setIsAccountsComponent={setIsAccountsComponent} />
        ) : (
          <>
            {!selectedAsset.assetName ? (
              <div className="details-container">
                <div className="dashboard-title">Dashboard</div>

                <div className="dashboard-subheading">Platform Details</div>
                <LendBorrowPlatformDetails
                  totalSuppliesSum={totalSuppliesSum}
                  totalBorrowsSum={totalBorrowsSum}
                />
                <div
                  style={{ marginTop: "25px" }}
                  className="dashboard-subheading"
                >
                  All Available Assets
                </div>
                <AllAssetsList
                  setSelectedAsset={setSelectedAsset}
                  setTotalBorrowsSum={setTotalBorrowsSum}
                  setTotalSuppliesSum={setTotalSuppliesSum}
                />
              </div>
            ) : (
              <TransactionsCard
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
