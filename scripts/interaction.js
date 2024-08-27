const { ethers } = require("hardhat");
// import hre from "hardhat";
const { abi } = require("../artifacts/contracts/IToken.sol/IToken.json");

async function main() {
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const contractABI = abi;
  // Connect to the Hardhat network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const result = await contract.mint(1);
  console.log("Function Result:", provider);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
