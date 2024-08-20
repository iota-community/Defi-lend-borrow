import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";

const TransactionAlert = ({ transactionConfirmed }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (transactionConfirmed != null) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [transactionConfirmed]);

  return (
    <div className="alert-container">
      {showAlert && (
        <Alert
          fade={true}
          color={transactionConfirmed ? "primary" : "danger"}
          className="mt-3"
        >
          {transactionConfirmed
            ? "Transaction Broadcasted!"
            : "Transaction Failed"}
        </Alert>
      )}
    </div>
  );
};

export default TransactionAlert;
