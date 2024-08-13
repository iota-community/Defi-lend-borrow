const hre = require("hardhat");

async function main() {
  const IToken = await hre.ethers.getContractFactory("IToken");
  const interestRateModelAddressContract = await hre.ethers.getContractFactory(
    "InterestRateModel"
  );
  const interestRateModelInstance =
    await interestRateModelAddressContract.deploy(1, 1);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const totalSupply = await ethers.parseUnits("1000", 8); // Deploys with 1000 tokens with 8 decimals
  const token = await MockERC20.deploy("MockERC20", "MTKN", totalSupply);
  await token.waitForDeployment();
  const underlyingAddress = await token.getAddress();
  const interestRateModelAddress = await interestRateModelInstance.getAddress();

  const iToken = await IToken.deploy(
    underlyingAddress,
    interestRateModelAddress
  );
  await iToken.waitForDeployment();
  const iTokenAddress = await iToken.getAddress();
  console.log("IToken deployed to:", iTokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
