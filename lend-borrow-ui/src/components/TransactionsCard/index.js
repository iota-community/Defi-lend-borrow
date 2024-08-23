import React, { useState } from "react";
import TabsPanel from "./Tabs";
import TransactionForm from "./TransactionForm";

const TransactionsCard = ({ Asset }) => {
  const [activeTab, setActiveTab] = useState("Supply");

  return (
    <div className="card" style={{ width: "fit-content" }}>
      <TabsPanel activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        <TransactionForm activeTab={activeTab} />
      </div>
    </div>
  );
};

export default TransactionsCard;
