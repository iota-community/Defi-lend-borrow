// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./InterestRateModel.sol";
import "./ITokenManager.sol";

/**
 * @title IToken Contract
 * @dev ERC20 token representing an interest-bearing asset with lending and borrowing functionalities.
 */
contract IToken is ERC20, ReentrancyGuard {
    /// @notice The underlying ERC20 token
    ERC20 public underlying;

    /// @notice The interest rate model for calculating borrow and supply rates
    InterestRateModel public interestRateModel;

    /// @notice The ITokenManager for managing tokens and collateral
    ITokenManager public tokenManager;

    /// @notice Mapping of addresses to their borrow amounts
    mapping(address => uint256) public borrows;

    /// @notice Total amount of borrows in the system
    uint256 public totalBorrows;

    /// @notice Total amount of reserves in the system
    uint256 public totalReserves;

    /// @notice The reserve factor as a mantissa (scaled by 1e18)
    uint256 public reserveFactorMantissa = 1e16; // 1%

    /**
     * @notice Constructs the IToken contract
     * @param _underlying The address of the underlying ERC20 token
     * @param _interestRateModel The address of the interest rate model contract
     * @param _tokenManager The address of the ITokenManager contract
     */
    constructor(address _underlying, address _interestRateModel, address _tokenManager)
        ERC20("IToken", "ITKN")
    {
        underlying = ERC20(_underlying);
        interestRateModel = InterestRateModel(_interestRateModel);
        tokenManager = ITokenManager(_tokenManager);
    }

    /**
     * @notice Mints IToken by depositing the underlying token
     * @param amount The amount of the underlying token to deposit
     * @return bool indicating success
     */
    function mint(uint256 amount) external nonReentrant returns (bool) {
        require(underlying.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        _mint(msg.sender, amount);

        // Update collateral in ITokenManager
        tokenManager.updateCollateral(msg.sender, address(this), balanceOf(msg.sender));

        return true;
    }

    /**
     * @notice Redeems IToken by withdrawing the underlying token
     * @param amount The amount of IToken to redeem
     * @return bool indicating success
     */
    function redeem(uint256 amount) external nonReentrant returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        require(underlying.transfer(msg.sender, amount), "Transfer failed");

        // Update collateral in ITokenManager
        tokenManager.updateCollateral(msg.sender, address(this), balanceOf(msg.sender));

        return true;
    }

    /**
     * @notice Borrows the underlying token from the contract
     * @param amount The amount of the underlying token to borrow
     * @return bool indicating success
     */
    function borrow(uint256 amount) external nonReentrant returns (bool) {
        uint256 cash = underlying.balanceOf(address(this));
        uint256 borrowRate = interestRateModel.getBorrowRate(cash, totalBorrows, totalReserves);
        uint256 interest = (amount * borrowRate) / 1e18;

        require(cash >= amount, "Insufficient liquidity");
        require(tokenManager.checkCollateral(msg.sender, address(this), amount), "Insufficient collateral");
        
        borrows[msg.sender] += (amount + interest);
        totalBorrows += (amount + interest);
        require(underlying.transfer(msg.sender, amount), "Transfer failed");

        return true;
    }

    /**
     * @notice Repays the borrowed underlying token
     * @param amount The amount of the underlying token to repay
     * @return bool indicating success
     */
    function repay(uint256 amount) external nonReentrant returns (bool) {
        require(borrows[msg.sender] >= amount, "Repay amount exceeds borrow");
        require(underlying.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 cash = underlying.balanceOf(address(this));
        uint256 borrowRate = interestRateModel.getBorrowRate(cash, totalBorrows, totalReserves);
        uint256 interest = (amount * borrowRate) / 1e18;

        borrows[msg.sender] -= amount;
        totalBorrows -= (amount - interest);
        totalReserves += interest;

        // Update collateral in ITokenManager
        tokenManager.updateCollateral(msg.sender, address(this), borrows[msg.sender]);

        return true;
    }

    /**
     * @notice Returns the current borrow rate per block
     * @return The current borrow rate as a mantissa (scaled by 1e18)
     */
    function getBorrowRate() public view returns (uint256) {
        uint256 cash = underlying.balanceOf(address(this));
        return interestRateModel.getBorrowRate(cash, totalBorrows, totalReserves);
    }

    /**
     * @notice Returns the current supply rate per block
     * @return The current supply rate as a mantissa (scaled by 1e18)
     */
    function getSupplyRate() public view returns (uint256) {
        uint256 cash = underlying.balanceOf(address(this));
        return interestRateModel.getSupplyRate(cash, totalBorrows, totalReserves, reserveFactorMantissa);
    }
}
