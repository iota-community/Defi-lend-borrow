export const CHAIN_ID = "0x7A69"; // HardhatETH network

export const DEFI_LEND_BORROW_ADDRESS =
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export const NETWORK_DETAILS = {
  chainId: CHAIN_ID,
  chainName: "Hardhat ETH",
  nativeCurrency: {
    name: "Hardhat ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://127.0.0.1:8545/"],
  blockExplorerUrls: [""],
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
