export const CHAIN_ID = "0x431"; // Shimmer EVM Testnet

export const DEFI_LEND_BORROW_ADDRESS =
  "0x7AD5BeE961e9e7aE4b7e6E61bca6a2AfF618b14b";

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
    assetName: "ETH",
    totalBorrow: 200000,
    totalSupply: 1000000,
    liquidity: 800000,
    price: 1900.0,
  },
  {
    assetName: "BTC",
    totalBorrow: 300000,
    totalSupply: 1200000,
    liquidity: 900000,
    price: 30000.0,
  },
  {
    assetName: "DAI",
    totalBorrow: 4000000,
    totalSupply: 10000000,
    liquidity: 6000000,
    price: 1.0,
  },
  {
    assetName: "UNI",
    totalBorrow: 1000000,
    totalSupply: 5000000,
    liquidity: 4000000,
    price: 5.5,
  },
];
