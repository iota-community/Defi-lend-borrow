import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const priv_key = process.env.PRIVATE_KEY || ""; 

const config: HardhatUserConfig = {
  solidity: {
    version:"0.8.24",
    settings:{
      optimizer: {
        enabled: true,
        runs: 2000,
      },
      viaIR: true,
    }
  },
  networks: {
    shimmer_evm_testnet: {
      url: "https://json-rpc.evm.testnet.shimmer.network",
      chainId: 1073,
      accounts: [priv_key],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "shimmer_evm_testnet",
        chainId: 1073,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api/",
          browserURL: "https://explorer.evm.testnet.shimmer.network/",
        },
      },
    ],
  },
};

export default config;
