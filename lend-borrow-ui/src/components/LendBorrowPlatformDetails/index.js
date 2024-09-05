import React from "react";

const LendBorrowPlatformDetails = ({ totalSuppliesSum, totalBorrowsSum }) => {
  return (
    <div className="LendBorrowPlatformDetailsCard">
      <div className="cardInnerContainer">
        <div className="heading">Total Supplies </div>
        <div className="subHeading">
          {totalSuppliesSum && totalSuppliesSum.toString().slice(0, 6)}
        </div>
      </div>
      <div
        className="cardInnerContainer"
        style={{ borderRight: "1px solid transparent" }}
      >
        <div className="heading">Total borrows</div>
        <div className="subHeading">
          {totalBorrowsSum && totalBorrowsSum.toString().slice(0, 6)}
        </div>
      </div>
    </div>
  );
};

export default LendBorrowPlatformDetails;
