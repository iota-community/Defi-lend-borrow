const hre = require("hardhat");

async function main() {
  // Deploy InterestRateModel contract
  const InterestRateModel = await hre.ethers.getContractFactory(
    "InterestRateModel"
  );
  const interestRateModelInstance = await InterestRateModel.deploy(10, 2);
  await interestRateModelInstance.waitForDeployment();
  const interestRateModelAddress = await interestRateModelInstance.getAddress();

  // Deploy MockERC20 token contract
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const totalSupply = hre.ethers.parseUnits("1000", 18); // Deploys with 1000 tokens with 18 decimals
  const token = await MockERC20.deploy("MockERC20", "MTKN", totalSupply);
  await token.waitForDeployment();
  const underlyingAddress = await token.getAddress();

  // Deploy ITokenManager contract
  const ITokenManager = await hre.ethers.getContractFactory("ITokenManager");
  const ITokenManagerInstance = await ITokenManager.deploy(
    "0x6bf7b21145Cbd7BB0b9916E6eB24EDA8A675D7C0"
  ); // supra oracle address for shimmer evm
  await ITokenManagerInstance.waitForDeployment();
  const ITokenManagerAddress = await ITokenManagerInstance.getAddress();

  // Deploy IToken contract
  const IToken = await hre.ethers.getContractFactory("IToken");
  const iToken = await IToken.deploy(
    underlyingAddress,
    interestRateModelAddress,
    ITokenManagerAddress,
    11,
    "IToken",
    "ITKN"
  );
  await iToken.waitForDeployment();
  const iTokenAddress = await iToken.getAddress();

  console.log("underlyingAddress deployed to:", underlyingAddress);
  console.log(
    "interestRateModelAddress deployed to:",
    interestRateModelAddress
  );
  console.log("ITokenManagerAddress deployed to:", ITokenManagerAddress);
  console.log("IToken deployed to:", iTokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
