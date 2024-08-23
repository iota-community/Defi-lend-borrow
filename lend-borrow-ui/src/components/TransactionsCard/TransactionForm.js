import React, { useState, useContext } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const TransactionForm = ({ activeTab }) => {
  const [value, setValue] = useState(0.0);
  const [isTransactModalOpen, setIsTransactModalOpen] = useState(false);

  const { connectWallet, address } = useContext(WalletContext);

  const toggleModal = () => {
    setIsTransactModalOpen(!isTransactModalOpen);
  };

  const handleConfirmTransaction = () => {
    transact();
    toggleModal(); // Close the modal after confirming
  };

  const transact = () => {
    // Logic to handle the transaction based on the active tab
    switch (activeTab) {
      case "Supply":
        // Handle supply logic
        break;
      case "Withdraw":
        // Handle withdraw logic
        break;
      case "Borrow":
        // Handle borrow logic
        break;
      case "Repay":
        // Handle repay logic
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${activeTab} amount`}
        className="transact-input"
      />
      <div className="transact-details">
        <div className="details-title">Supply balance</div>
        <div>0</div>
      </div>
      <div className="transact-details">
        <div className="details-title">Borrow limit</div>
        <div>$0</div>
      </div>
      <div className="transact-details">
        <div className="details-title">Daily earnings</div>
        <div>$0</div>
      </div>
      <Button
        className="connect-btn"
        style={{ background: "rgb(45 53 73)" }}
        onClick={() => (!address ? connectWallet() : toggleModal())}
        color="primary"
        block
      >
        {address ? "Transact" : "Connect Wallet"}
      </Button>

      <Modal isOpen={isTransactModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Confirm Transaction</ModalHeader>
        <ModalBody>trnsx details</ModalBody>
        <ModalFooter>
          <button
            style={{ color: "green", background: "#99d199" }}
            onClick={handleConfirmTransaction}
            className="connect-btn"
          >
            Confirm Transaction
          </button>
          <button className="connect-btn" onClick={toggleModal}>
            Cancel Transaction
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TransactionForm;
