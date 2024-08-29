export const CHAIN_ID = "0x431"; // Shimmer EVM Testnet

export const ITOKEN_ADDRESS = "0x4342d1796006e2e19BE93ae90Fca4871E71B0C12";

export const UNDERLYING_TOKEN_ADDRESS =
  "0x4b2dAB096eEc64506B6a3299432B1491F18b9246";

export const INTEREST_RATE_MODAL_ADDRESS =
  "0x4b7cF6d2507cB5559d618FaC9F7370D8b49A53fD";

export const ITOKEN_MANAGER_ADDRESS =
  "0x4f5723A51437f797f3Fa05e7f8AA9657d0E4ee7c";

export const NETWORK_DETAILS = {
  chainId: CHAIN_ID,
  chainName: "Shimmer EVM Testnet",
  nativeCurrency: {
    name: "Shimmer",
    symbol: "SMR",
    decimals: 18,
  },
  rpcUrls: ["https://json-rpc.evm.testnet.shimmer.network"],
  blockExplorerUrls: ["https://explorer.evm.testnet.shimmer.network/"],
};

export const ASSETLIST = [
  {
    assetName: "USDT",
    totalBorrow: 5000000,
    totalSupply: 15000000,
    liquidity: 10000000,
    price: 1.0,
  },
  {
    assetName: "DAI",
    totalBorrow: 4000000,
    totalSupply: 10000000,
    liquidity: 6000000,
    price: 1.0,
  },
];
