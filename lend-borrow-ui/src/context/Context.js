import { createContext, useEffect, useState } from "react";
import {
  getNativeBalance,
  getSignerAddress,
  isValidAddress,
  changeNetwork,
} from "../utils/ethersUtils";

export const Context = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState();
  const [tokenBal, setTokenBal] = useState();
  const [smrBal, setSmrBal] = useState();
  const [currentGasPrice, setCurrentGasPrice] = useState();
  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum && window.ethereum.isMetaMask) {
          await changeNetwork();
          const addr = await getSignerAddress();
          const smrBalance = await getNativeBalance();
          setSmrBal(smrBalance);
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
      const smrBalance = await getNativeBalance();
      setSmrBal(smrBalance);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await changeNetwork();
        const addr = await getSignerAddress();
        const smrBalance = await getNativeBalance();
        setSmrBal(smrBalance);
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
    <Context.Provider
      value={{
        address,
        smrBal,
        tokenBal,
        connectWallet,
        disconnectWallet,
        fetchBalances,
        currentGasPrice,
        setCurrentGasPrice,
      }}
    >
      {children}
    </Context.Provider>
  );
};
