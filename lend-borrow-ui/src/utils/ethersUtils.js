import { ethers } from "ethers";
import {
  NETWORK_DETAILS,
  ITOKEN_ADDRESS,
  ITOKEN_MANAGER_ADDRESS,
} from "./constants";
import {
  CONTRACT_ABI,
  ITOKEN_MANAGER_CONTRACT_ABI,
  UNDERLYING_CONTRACT_ABI,
} from "./contractAbi";
import { getContract } from "./sendTransactions";

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

export const getItokenBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(ITOKEN_ADDRESS, CONTRACT_ABI, signer);
  const signerAdd = await signer.getAddress();
  const balance = await tokenContract.balanceOf(signerAdd);
  const balanceInWei = balance.toString();
  const balanceInDecimals = ethers.utils.formatUnits(balanceInWei, 18);
  return balanceInDecimals.slice(0, 10);
};

export const getCollateral = async (accountAddr, tokenAddr) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(ITOKEN_ADDRESS, CONTRACT_ABI, signer);
  const collateral = await tokenContract.checkCollateral(
    accountAddr,
    tokenAddr
  );

  return collateral;
};

export const getItokenDetails = async (iTokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(iTokenAddress, CONTRACT_ABI, signer);

  const totalBorrows = await tokenContract.totalBorrows();
  const totalBorrowsInDecimals = ethers.utils.formatUnits(totalBorrows, 18);

  const totalSupply = await tokenContract.totalSupply();
  const totalSupplyInDecimals = ethers.utils.formatUnits(totalSupply, 18);

  return {
    totalBorrows: totalBorrowsInDecimals,
    totalSupply: totalSupplyInDecimals,
  };
};

export const getTokenDetails = async (tokenAddress, accountAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(
    tokenAddress,
    UNDERLYING_CONTRACT_ABI,
    signer
  );

  const tokenName = await tokenContract.name();
  const tokenSymbol = await tokenContract.symbol();
  const balance = await tokenContract.balanceOf(accountAddress);

  return {
    tokenName,
    tokenSymbol,
    tokenBalance: balance,
  };
};

export const getTokenBalance = async (contractAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  let tokenContract = new ethers.Contract(
    contractAddress,
    CONTRACT_ABI,
    signer
  );
  const signerAdd = await signer.getAddress();
  const balance = await tokenContract.balanceOf(signerAdd);
  const balanceInWei = balance.toString();
  const balanceInDecimals = ethers.utils.formatUnits(balanceInWei, 18);
  return balanceInDecimals.slice(0, 6);
};

export const getAllSupportedTokens = async () => {
  const ITokenManagerInstance = await getContract(
    ITOKEN_MANAGER_ADDRESS,
    ITOKEN_MANAGER_CONTRACT_ABI
  );

  // Fetch the list of all supported IToken addresses
  const allItokensList = await ITokenManagerInstance.getAllSupportedTokens();

  // Initialize arrays to store the underlying tokens and iTokens
  let underlyingSupported = [];
  let iTokenSupported = [];

  // Loop through each IToken address and fetch the underlying token address
  for (const iTokenAddress of allItokensList) {
    const ITokenInstance = await getContract(iTokenAddress, CONTRACT_ABI);
    const underlyingAddress = await ITokenInstance.underlying();

    underlyingSupported.push(underlyingAddress);
    iTokenSupported.push(iTokenAddress);
  }

  // Create the final JSON object with two entries
  const result = {
    underlyingSupported: underlyingSupported,
    iTokenSupported: iTokenSupported,
  };
  return result;
};

export const getTokenName = async (contractAddress) => {
  const instance = await getContract(contractAddress, UNDERLYING_CONTRACT_ABI);
  return await instance.symbol();
};
