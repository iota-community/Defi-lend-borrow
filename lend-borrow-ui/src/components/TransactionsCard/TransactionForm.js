import React, { useState, useContext, useEffect } from "react";
import { WalletContext } from "../../context/WalletContext";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  mintItokens,
  borrowItokens,
  redeemItokens,
  repayItokens,
} from "../../utils/sendTransactions";
import { getTokenBalance } from "../../utils/ethersUtils";

const TransactionForm = ({ selectedAsset, activeTab, setSelectedAsset }) => {
  const [value, setValue] = useState(0);
  // const [value, setValue] = useState(0);

  const [tokenBalance, setTokenBalance] = useState();

  const [isTransactModalOpen, setIsTransactModalOpen] = useState(false);

  const { connectWallet, address } = useContext(WalletContext);

  useEffect(() => setValue(0), [activeTab]);
  useEffect(() => {
    const init = async () => {
      const underlyingTokenBalance = await getTokenBalance();
      setTokenBalance(underlyingTokenBalance);
    };
    init();
  }, []);

  const toggleModal = () => {
    setIsTransactModalOpen(!isTransactModalOpen);
  };

  const handleConfirmTransaction = async () => {
    try {
      toggleModal();
      const transx = await transact(value);
    } catch (e) {
      toggleModal();
      console.log("Error in trnsx", e);
    }
  };

  const transact = async (amount) => {
    switch (activeTab) {
      case "Supply":
        await mintItokens(amount);
        break;
      case "Withdraw":
        await redeemItokens(amount);
        break;
      case "Borrow":
        await borrowItokens(amount);
        break;
      case "Repay":
        await repayItokens(amount);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button className="back-button" onClick={() => setSelectedAsset({})}>
        ⬅
      </Button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${activeTab} amount`}
        className="transact-input"
      />
      <div className="transact-details">
        <div className="details-title">Supply balance</div>
        <div>{tokenBalance}</div>
      </div>
      {tokenBalance == 0 && (
        <div className="low-balance">Not enough Balance</div>
      )}

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
        disabled={!value || tokenBalance == 0}
      >
        {address ? "Transact" : "Connect Wallet"}
      </Button>

      <Modal isOpen={isTransactModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Confirm Transaction</ModalHeader>
        <ModalBody>
          {activeTab} amount : {value}
        </ModalBody>
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
