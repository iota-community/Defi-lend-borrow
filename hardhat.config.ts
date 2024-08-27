import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const priv_key = "YOUR_PRIVATE_KEY_HERE"; 

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    shimmer_evm_testnet: {
      url: "https://json-rpc.evm.testnet.shimmer.network",
      chainId: 1073,
      accounts: [priv_key],
    },
  },
  etherscan: {
    apiKey: "YOUR_API_KEY_HERE",
    customChains: [
      {
        network: "shimmer_evm_testnet",
        chainId: 1073,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api/",
          browserURL: "https://explorer.evm.testnet.shimmer.network/",
        },
      },
    ]
  }
};

export default config;
