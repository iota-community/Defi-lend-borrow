import { ethers } from "ethers";
import {
  ITOKEN_ADDRESS,
  UNDERLYING_TOKEN_ADDRESS,
  INTEREST_RATE_MODAL_ADDRESS,
  ITOKEN_MANAGER_ADDRESS,
} from "./constants";
import {
  CONTRACT_ABI,
  INTEREST_RATE_MODAL_CONTRACT_ABI,
  ITOKEN_MANAGER_CONTRACT_ABI,
  UNDERLYING_CONTRACT_ABI,
} from "./contractAbi";

export const getContract = async (contractAddress, contractAbi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractAbi, signer);
};

export const mintItokens = async (
  amount,
  contractAddress,
  underlyingAddress
) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);
  //approve underlying to ITokenContract
  const underlyingToken = await getContract(
    underlyingAddress,
    UNDERLYING_CONTRACT_ABI
  );
  await underlyingToken.approve(contractAddress, parsedAmount);

  //Mint IToken
  const iTokenContract = await getContract(contractAddress, CONTRACT_ABI);
  await iTokenContract.mint(parsedAmount);
};

export const redeemItokens = async (amount, contractAddress) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(contractAddress, CONTRACT_ABI);
  await iTokenContract.redeem(parsedAmount);
};

export const borrowItokens = async (amount, borrower, contractAddress) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(contractAddress, CONTRACT_ABI);
  await iTokenContract.borrow(parsedAmount, borrower);
};

export const repayItokens = async (amount, contractAddress) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(contractAddress, CONTRACT_ABI);
  await iTokenContract.repay(parsedAmount);
};
