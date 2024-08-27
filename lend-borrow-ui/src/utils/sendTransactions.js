import { ethers } from "ethers";
import { DEFI_LEND_BORROW_ADDRESS } from "./constants";
import { CONTRACT_ABI } from "./contractAbi";

const getITokenContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(DEFI_LEND_BORROW_ADDRESS, CONTRACT_ABI, signer);
};
const performTransaction = async (method, amount) => {
  try {
    const iTokenContract = await getITokenContract();
    const parsedAmount = ethers.utils.parseUnits(amount.toString(), 8);
    const transaction = await iTokenContract[method](parsedAmount);
    console.log(transaction);
  } catch (e) {
    console.log(`Error while transacting: `, e);
  }
};

export const mintTokens = async (amount) =>
  await performTransaction("mint", amount);
export const borrowTokens = async (amount) =>
  await performTransaction("borrow", amount);

export const redeemTokens = async (amount) =>
  await performTransaction("redeem", amount);
export const repayTokens = async (amount) =>
  await performTransaction("repay", amount);
