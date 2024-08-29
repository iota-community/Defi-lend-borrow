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

  return (
    <div className="app">
      <div>
        <NavigationBar setIsAccountsComponent={setIsAccountsComponent} />

        {isAccountsComponent ? (
          <AccountDetails setIsAccountsComponent={setIsAccountsComponent} />
        ) : (
          <>
            {!selectedAsset.assetName ? (
              <>
                <LendBorrowPlatformDetails />
                <AllAssetsList setSelectedAsset={setSelectedAsset} />
              </>
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
