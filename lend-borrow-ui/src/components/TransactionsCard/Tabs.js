import React from "react";

const Tab = ({ tabName, activeTab, setActiveTab }) => {
  return (
    <button
      className={`${activeTab === tabName ? "selectedTab" : "tab"}`}
      onClick={() => setActiveTab(tabName)}
    >
      {tabName}
    </button>
  );
};

const TabsPanel = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="tabsPanel"
      style={{ display: "flex", marginBottom: "20px" }}
    >
      <Tab tabName="Supply" activeTab={activeTab} setActiveTab={setActiveTab} />
      <Tab
        tabName="Withdraw"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Tab tabName="Borrow" activeTab={activeTab} setActiveTab={setActiveTab} />
      <Tab tabName="Repay" activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default TabsPanel;
