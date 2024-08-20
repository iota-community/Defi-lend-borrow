import { ethers } from "ethers";
import { COLX_TOKEN, COLX_BRIDGE_ADDRESS } from "./constants";
import { CONTRACT_ABI } from "./contractAbi";
import { ERC20_ABI } from "./erc20Abi";

export const sendTransaction = async (
  estdGas,
  fromAdd,
  amount,
  toAddress,
  gasLimit,
  setTransactionHash,
  storeTransactionHash
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 8);
  const tokenContract = new ethers.Contract(
    COLX_TOKEN.address,
    ERC20_ABI,
    signer
  );
  const approveTx = await tokenContract.approve(
    COLX_BRIDGE_ADDRESS,
    parsedAmount
  );
  console.log("approve tx: ", approveTx);
  const colxContract = new ethers.Contract(
    COLX_BRIDGE_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  const tx = await colxContract.sendFrom(
    fromAdd,
    "110", // layer zero arb chain id
    ethers.utils.hexZeroPad(toAddress, 32),
    parsedAmount,
    {
      refundAddress: fromAdd,
      zroPaymentAddress: "0x0000000000000000000000000000000000000000",
      adapterParams:
        "0x000100000000000000000000000000000000000000000000000000000000000493e0",
    },
    {
      gasLimit: ethers.utils.hexlify(gasLimit),
      value: estdGas,
    }
  );
  setTransactionHash(tx?.hash);
  storeTransactionHash(fromAdd, tx?.hash);
  console.log("Colx bridge tokens sent", tx);
};
