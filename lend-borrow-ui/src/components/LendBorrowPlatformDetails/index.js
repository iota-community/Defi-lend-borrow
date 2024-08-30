import React, { useState, useEffect } from "react";
import { getItokenDetails } from "../../utils/ethersUtils";
import ReactLoading from "react-loading";

const LendBorrowPlatformDetails = () => {
  const [itokenDetails, setItokenDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const details = await getItokenDetails();
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
            itokenDetails.totalReserves
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
            itokenDetails.totalBorrows
          )}
        </div>
      </div>
    </div>
  );
};

export default LendBorrowPlatformDetails;
