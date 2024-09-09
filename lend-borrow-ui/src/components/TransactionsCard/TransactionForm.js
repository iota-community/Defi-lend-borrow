import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../context/Context";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  mintItokens,
  borrowItokens,
  redeemItokens,
  repayItokens,
} from "../../utils/sendTransactions";
import { getTokenBalance } from "../../utils/ethersUtils";
import TransactionAlert from "../TransactionAlert";

const TransactionForm = ({ selectedAsset, activeTab, setSelectedAsset }) => {
  const [value, setValue] = useState(0);
  const [tokenBalance, setTokenBalance] = useState();
  const [withdrawBalance, setWithdrawBalance] = useState();
  const [isTransactModalOpen, setIsTransactModalOpen] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(null);

  const { connectWallet, address } = useContext(Context);

  useEffect(() => setValue(0), [activeTab]);

  useEffect(() => {
    const init = async () => {
      const tokenBalance = await getTokenBalance(
        selectedAsset.underlyingAddress
      );
      setTokenBalance(tokenBalance);

      const withdrawBalance = await getTokenBalance(
        selectedAsset.iTokenAddress
      );
      setWithdrawBalance(withdrawBalance);
    };
    init();
  }, [selectedAsset]);

  const toggleModal = () => {
    setIsTransactModalOpen(!isTransactModalOpen);
  };

  const handleConfirmTransaction = async () => {
    try {
      toggleModal();
      const transx = await transact(value);
      console.log(transx);
      setTransactionConfirmed(true);
    } catch (e) {
      toggleModal();
      console.log("Error in transaction", e);
      setTransactionConfirmed(false);
    }
  };

  const transact = async (amount) => {
    switch (activeTab) {
      case "Supply":
        await mintItokens(
          amount,
          selectedAsset.iTokenAddress,
          selectedAsset.underlyingAddress
        );
        break;
      case "Withdraw":
        await redeemItokens(amount, selectedAsset.iTokenAddress);
        break;
      case "Borrow":
        await borrowItokens(amount, address, selectedAsset.iTokenAddress);
        break;
      case "Repay":
        await repayItokens(amount, selectedAsset.iTokenAddress);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button className="back-button" onClick={() => setSelectedAsset({})}>
        ⬅
      </button>
      <div className="transact-input-container">
        <input
          className="transact-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${activeTab} amount`}
        />
        <button className="transact-token-name">
          {selectedAsset.assetName}
        </button>
      </div>
      {activeTab === "Supply" && (
        <div className="transact-details">
          <div className="details-title">Supply balance</div>
          <div>{tokenBalance}</div>
        </div>
      )}
      {activeTab === "Supply" && tokenBalance === 0 && (
        <div className="low-balance">Not enough Balance</div>
      )}

      {activeTab === "Withdraw" && (
        <div className="transact-details">
          <div className="details-title">Withdrawable balance</div>
          <div>{withdrawBalance}</div>
        </div>
      )}
      {activeTab === "Borrow" && (
        <div className="transact-details">
          <div className="details-title">Borrow limit</div>
          <div>$0</div>
        </div>
      )}

      <Button
        className="connect-btn"
        style={{ background: "rgb(45 53 73)" }}
        onClick={() => (!address ? connectWallet() : toggleModal())}
        color="primary"
        block
        disabled={!value || tokenBalance === 0}
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

      {/* Transaction Alert */}
      <TransactionAlert transactionConfirmed={transactionConfirmed} />
    </div>
  );
};

export default TransactionForm;
