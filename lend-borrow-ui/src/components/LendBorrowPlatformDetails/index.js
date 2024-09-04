import React, { useState, useEffect } from "react";
import { getItokenDetails } from "../../utils/ethersUtils";
import ReactLoading from "react-loading";
import { ITOKEN_ADDRESS } from "../../utils/constants";

const LendBorrowPlatformDetails = ({ totalSuppliesSum, totalBorrowsSum }) => {
  const [itokenDetails, setItokenDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const details = await getItokenDetails(ITOKEN_ADDRESS);
      setItokenDetails(details);
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <div className="LendBorrowPlatformDetailsCard">
      <div className="cardInnerContainer">
        <div className="heading">Total Supplies </div>
        <div className="subHeading">
          {isLoading ? (
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={20}
              width={20}
            />
          ) : (
            totalSuppliesSum && totalSuppliesSum.toString().slice(0, 6)
          )}
        </div>
      </div>
      <div
        className="cardInnerContainer"
        style={{ borderRight: "1px solid transparent" }}
      >
        <div className="heading">Total borrows</div>
        <div className="subHeading">
          {isLoading ? (
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={20}
              width={20}
            />
          ) : (
            totalBorrowsSum && totalBorrowsSum.toString().slice(0, 6)
          )}
        </div>
      </div>
    </div>
  );
};

export default LendBorrowPlatformDetails;
