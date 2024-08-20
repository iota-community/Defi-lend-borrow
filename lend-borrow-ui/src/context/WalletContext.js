import { createContext, useEffect, useState } from "react";
import {
  getNativeBalance,
  getSignerAddress,
  isValidAddress,
  getTokenBalance,
  changeNetwork,
} from "../utils/ethersUtils";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState();
  const [tokenBal, setTokenBal] = useState();
  const [bnbBal, setBnbBal] = useState();
  const [currentGasPrice, setCurrentGasPrice] = useState();
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionList, setTransactionList] = useState([]);
  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum && window.ethereum.isMetaMask) {
          await changeNetwork();
          const addr = await getSignerAddress();
          const bnbBalance = await getNativeBalance();
          // const tokenBalance = await getTokenBalance();
          setBnbBal(bnbBalance);
          // setTokenBal(tokenBalance);
          setAddress(addr);
        }
      } catch (err) {
        console.log(err);
      }

      if (window.ethereum) {
        window.ethereum.on("accountsChanged", connectWallet);
      }
    };
    init();
  }, []);

  const fetchBalances = async () => {
    if (isValidAddress(address)) {
      const bnbBalance = await getNativeBalance();
      const tokenBalance = await getTokenBalance();
      setBnbBal(bnbBalance);
      setTokenBal(tokenBalance);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await changeNetwork();
        const addr = await getSignerAddress();
        const bnbBalance = await getNativeBalance();
        const tokenBalance = await getTokenBalance();
        setBnbBal(bnbBalance);
        setTokenBal(tokenBalance);
        setAddress(addr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectWallet = async () => {
    try {
      setAddress(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        bnbBal,
        tokenBal,
        connectWallet,
        disconnectWallet,
        fetchBalances,
        currentGasPrice,
        setCurrentGasPrice,
        transactionHash,
        setTransactionHash,
        transactionList,
        setTransactionList,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
