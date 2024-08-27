import { ethers } from "ethers";
import { NETWORK_DETAILS, DEFI_LEND_BORROW_ADDRESS } from "./constants";
import { CONTRACT_ABI } from "./contractAbi";

const getAccount = async () => {
  let value = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  await changeNetwork();
  return value;
};

export const changeNetwork = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK_DETAILS.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_DETAILS],
          });
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_DETAILS.chainId }],
          });
        } catch (addError) {
          console.log("Failed to add the network to MetaMask:", addError);
        }
      } else {
        console.log("Error switching network:", error);
      }
    }
  }
};

const handleChainChanged = async () => {
  await changeNetwork();
};

if (window.ethereum) {
  window.ethereum.on("chainChanged", handleChainChanged);
}

export const getSignerAddress = async () => {
  const signerAddressArray = await getAccount();
  let signerAddress = await signerAddressArray[0];
  return signerAddress;
};

export const isValidAddress = (receiversAddress) => {
  try {
    ethers.utils.getAddress(receiversAddress);
    return true;
  } catch (error) {
    return false;
  }
};

export const getNativeBalance = async () => {
  try {
    const address = await getSignerAddress();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    const balanceInSMR = ethers.utils.formatEther(balance);
    return balanceInSMR;
  } catch (error) {
    console.log("Error getting SMR balance:", error);
    return null;
  }
};

export const getTokenBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(
    DEFI_LEND_BORROW_ADDRESS,
    CONTRACT_ABI,
    signer
  );
  const signerAdd = await signer.getAddress();
  const balance = await tokenContract.balanceOf(signerAdd);
  const balanceInWei = balance.toString();
  const balanceInDecimals = ethers.utils.formatUnits(balanceInWei, 8);
  return balanceInDecimals.slice(0, 10);
};
