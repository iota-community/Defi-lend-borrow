const hre = require("hardhat");

async function main() {
  // Deploy InterestRateModel contract
  const InterestRateModel = await hre.ethers.getContractFactory(
    "InterestRateModel"
  );
  const interestRateModelInstance = await InterestRateModel.deploy(10, 2); // Provide values according to your will or else you can use these values as well.
  await interestRateModelInstance.waitForDeployment();
  const interestRateModelAddress = await interestRateModelInstance.getAddress();

  // Deploy MockERC20 token contract
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // Deploys with 1000 tokens with 18 decimals.
  const token = await MockERC20.deploy(
    "TOKEN_NAME_HERE",
    "TOKEN_SYMBOL_HERE",
    initialSupply
  );
  await token.waitForDeployment();
  const underlyingAddress = await token.getAddress();

  // Deploy ITokenManager contract
  const ITokenManager = await hre.ethers.getContractFactory("ITokenManager");
  const ITokenManagerInstance = await ITokenManager.deploy();
  await ITokenManagerInstance.waitForDeployment();
  const ITokenManagerAddress = await ITokenManagerInstance.getAddress();

  // Deploy IToken contract
  const IToken = await hre.ethers.getContractFactory("IToken");
  const iToken = await IToken.deploy(
    underlyingAddress,
    interestRateModelAddress,
    ITokenManagerAddress,
    "ADD_MAX_BORROW_MANTISSA_NUMBER_HERE",
    "IToken",
    "ITKN"
  );
  await iToken.waitForDeployment();
  const iTokenAddress = await iToken.getAddress();

  console.log("underlying token deployed to:", underlyingAddress);
  console.log("interestRateModel deployed to:", interestRateModelAddress);
  console.log("ITokenManager deployed to:", ITokenManagerAddress);
  console.log("IToken deployed to:", iTokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
