import React, { useState } from "react";
import TabsPanel from "./Tabs";
import TransactionForm from "./TransactionForm";

const TransactionsCard = ({ selectedAsset, setSelectedAsset }) => {
  const [activeTab, setActiveTab] = useState("Supply");

  return (
    <div className="card" style={{ width: "fit-content" }}>
      <TabsPanel activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        <TransactionForm
          selectedAsset={selectedAsset}
          activeTab={activeTab}
          setSelectedAsset={setSelectedAsset}
        />
      </div>
    </div>
  );
};

export default TransactionsCard;
