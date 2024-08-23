import React, { useContext, useState } from "react";
import "./App.css";
import { WalletContext } from "./context/WalletContext";
import { NavigationBar } from "./components/NavigationBar";
import LendBorrowPlatformDetails from "./components/LendBorrowPlatformDetails";
import AllAssetsList from "./components/LendBorrowPlatformDetails/AllAssetsList";

import TransactionsCard from "./components/TransactionsCard";

const App = () => {
  const { address, tokenBal } = useContext(WalletContext);
  console.log(tokenBal);
  const [selectedAsset, setSelectedAsset] = useState({});
  return (
    <div className="app">
      <div>
        <NavigationBar />
        {!selectedAsset.assetName ? (
          <>
            <LendBorrowPlatformDetails />
            <AllAssetsList setSelectedAsset={setSelectedAsset} />
          </>
        ) : (
          <TransactionsCard selectedAsset={selectedAsset} />
        )}
      </div>
    </div>
  );
};

export default App;
