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
    iota_evm_testnet: {
      url: "https://json-rpc.evm.testnet.iotaledger.net",
      chainId: 1075,
      accounts: [priv_key],
    },  
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "iota_evm_testnet",
        chainId: 1075,
        urls: {
          apiURL: "https://explorer.evm.testnet.iotaledger.net/api/",
          browserURL: "https://explorer.evm.testnet.iotaledger.net/",
        },
      },
    ],
  },
};

export default config;
