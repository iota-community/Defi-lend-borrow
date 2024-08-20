import React, { useState } from "react";
import Supply from "./Supply";
import Withdraw from "./Withdraw";
import Borrow from "./Borrow";
import Repay from "./Repay";

const TransactionsCard = () => {
  const [activeTab, setActiveTab] = useState("Supply");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="card">
      <div
        className="tabsPanel"
        style={{ display: "flex", marginBottom: "20px" }}
      >
        <button
          className={`${activeTab === "Supply" ? "selectedTab" : "tab"}`}
          onClick={() => handleTabClick("Supply")}
        >
          Supply
        </button>
        <button
          className={`${activeTab === "Withdraw" ? "selectedTab" : "tab"}`}
          onClick={() => handleTabClick("Withdraw")}
        >
          Withdraw
        </button>
        <button
          className={`${activeTab === "Borrow" ? "selectedTab" : "tab"}`}
          onClick={() => handleTabClick("Borrow")}
        >
          Borrow
        </button>
        <button
          className={`${activeTab === "Repay" ? "selectedTab" : "tab"}`}
          onClick={() => handleTabClick("Repay")}
        >
          Repay
        </button>
      </div>
      <div>
        {activeTab === "Supply" && <Supply />}
        {activeTab === "Withdraw" && <Withdraw />}
        {activeTab === "Borrow" && <Borrow />}
        {activeTab === "Repay" && <Repay />}
      </div>
    </div>
  );
};

export default TransactionsCard;
