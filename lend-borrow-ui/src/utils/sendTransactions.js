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

export const mintItokens = async (amount) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);
  //approve underlying to ITokenContract
  const underlyingToken = await getContract(
    UNDERLYING_TOKEN_ADDRESS,
    UNDERLYING_CONTRACT_ABI
  );
  await underlyingToken.approve(ITOKEN_ADDRESS, parsedAmount);
  //Add token to ITokenManager if not present
  const iTokenManagerContract = await getContract(
    ITOKEN_MANAGER_ADDRESS,
    ITOKEN_MANAGER_CONTRACT_ABI
  );
  const isTokenPresent = await iTokenManagerContract.supportedTokens(
    UNDERLYING_TOKEN_ADDRESS
  );
  !isTokenPresent &&
    (await iTokenManagerContract.addToken(UNDERLYING_TOKEN_ADDRESS));
  //Mint IToken
  const iTokenContract = await getContract(ITOKEN_ADDRESS, CONTRACT_ABI);
  await iTokenContract.mint(parsedAmount);
};

export const redeemItokens = async (amount) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(ITOKEN_ADDRESS, CONTRACT_ABI);
  await iTokenContract.redeem(parsedAmount);
};

export const borrowItokens = async (amount) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(ITOKEN_ADDRESS, CONTRACT_ABI);
  await iTokenContract.borrow(parsedAmount);
};

export const repayItokens = async (amount) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);

  const iTokenContract = await getContract(ITOKEN_ADDRESS, CONTRACT_ABI);
  await iTokenContract.repay(parsedAmount);
};
