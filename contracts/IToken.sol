// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./InterestRateModel.sol";
import "./ITokenManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IToken Contract
 * @dev ERC20 token representing an interest-bearing asset with lending and borrowing functionalities.
 */
contract IToken is ERC20, ReentrancyGuard {
    /// @notice Container for borrow balance information
    /// @member principal Total balance (with accrued interest), after applying the most recent balance-changing action
    /// @member interestIndex Global borrowIndex as of the most recent balance-changing action
    struct BorrowSnapshot {
        uint256 principal;
        uint256 interestIndex;
    }

    /// @notice The underlying ERC20 token
    ERC20 public underlying;

    /// @notice The interest rate model for calculating borrow and supply rates
    InterestRateModel public interestRateModel;

    /// @notice The ITokenManager for managing tokens and collateral
    ITokenManager public tokenManager;

    /// @notice Mapping of addresses to their borrow amounts
    mapping(address => BorrowSnapshot) public accountBorrows;

    /// @notice Initial exchange rate used when minting the first ITokens (used when totalSupply = 0)
    uint256 internal constant initialExchangeRateMantissa = 1e18;

    /// @notice Slot(block or second) number that interest was last accrued at
    uint256 public accrualBlockNumber;

    /// @notice Accumulator of the total earned interest rate since the opening of the market
    uint256 public borrowIndex;

    /// @notice Total amount of borrows in the system
    uint256 public totalBorrows;

    /// @notice Official record of token balances for each account
    mapping(address => uint256) internal accountTokens;

    /// @notice Maximum borrow rate that can ever be applied per slot(block or second)
    uint256 internal immutable MAX_BORROW_RATE_MANTISSA;

    uint256 public constant ONE_MANTISSA = 1e18;

    /// @notice Thrown if the supplied address is a zero address where it is not allowed
    error ZeroAddressNotAllowed();

    error BorrowRateTooMuch();

    error InsufficientBalance();

    error BorrowCashNotAvailable();

    error NO_ERROR();

    /**
     * @notice Constructs the IToken contract
     * @param _underlying The address of the underlying ERC20 token
     * @param _interestRateModel The address of the interest rate model contract
     * @param _tokenManager The address of the ITokenManager contract
     * @param maxBorrowRateMantissa The maximum borrow rate mantissa
     * @param tokenName The name of the IToken
     * @param tokenSymbol The symbol of the IToken
     */
    constructor(
        address _underlying,
        address _interestRateModel,
        address _tokenManager,
        uint256 maxBorrowRateMantissa,
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) {
        ensureNonzeroAddress(_underlying);
        ensureNonzeroAddress(_interestRateModel);
        ensureNonzeroAddress(_tokenManager);

        underlying = ERC20(_underlying);
        interestRateModel = InterestRateModel(_interestRateModel);
        tokenManager = ITokenManager(_tokenManager);
        MAX_BORROW_RATE_MANTISSA = maxBorrowRateMantissa;
        borrowIndex = ONE_MANTISSA;
    }

    /**
     * @notice Mints IToken by depositing the underlying token
     * @param amount The amount of the underlying token to deposit
     * @return bool indicating success
     */
    function mint(uint256 amount) external nonReentrant returns (bool) {
        accrueInterest();
        tokenManager.preMintChecks(address(this));

        uint256 exchangeRate = _exchangeRateStored();
        underlying.transferFrom(msg.sender, address(this), amount);

        uint256 mintTokens = exchangeRate != 0
            ? (amount * ONE_MANTISSA) / exchangeRate
            : (amount * ONE_MANTISSA) / 1;
        _mint(msg.sender, mintTokens);

        // Update collateral in ITokenManager
        uint256 balanceAfter = accountTokens[msg.sender] + mintTokens;
        accountTokens[msg.sender] = balanceAfter;

        return true;
    }

    /**
     * @notice Redeems IToken by withdrawing the underlying token
     * @param amount The amount of IToken to redeem
     * @return bool indicating success
     */
    function redeem(uint256 amount) external nonReentrant returns (bool) {
        accrueInterest();

        tokenManager.preRedeemChecks(address(this), msg.sender, amount);
        uint256 exchangeRate = _exchangeRateStored();

        uint256 redeemUnderlyingAmount = exchangeRate != 0
            ? (amount * exchangeRate) / ONE_MANTISSA
            : (amount * 1) / ONE_MANTISSA;

        if (underlying.balanceOf(address(this)) <= redeemUnderlyingAmount) {
            revert InsufficientBalance();
        }

        _burn(msg.sender, amount);

        uint256 balanceAfter = accountTokens[msg.sender] - amount;
        accountTokens[msg.sender] = balanceAfter;

        underlying.transfer(msg.sender, redeemUnderlyingAmount);

        return true;
    }

    /**
     * @notice Borrows the underlying token from the contract
     * @param borrowAmount The amount of the underlying token to borrow
     * @return bool indicating success
     */
    function borrow(
        uint256 borrowAmount,
        address borrower
    ) external nonReentrant returns (bool) {
        accrueInterest();

        tokenManager.preBorrowChecks(address(this), msg.sender, borrowAmount);

        uint256 cash = underlying.balanceOf(address(this));

        if (cash < borrowAmount) {
            revert BorrowCashNotAvailable();
        }

        uint256 accountBorrowsPrev = _borrowBalanceStored(borrower);
        uint256 accountBorrowsNew = accountBorrowsPrev + borrowAmount;
        uint256 totalBorrowsNew = totalBorrows + borrowAmount;

        underlying.transfer(msg.sender, totalBorrowsNew);

        return true;
    }

    function _doTransferIn(
        address from,
        uint256 amount
    ) internal virtual returns (uint256) {
        IERC20 token = IERC20(underlying);
        uint256 balanceBefore = token.balanceOf(address(this));
        token.transferFrom(from, address(this), amount);
        uint256 balanceAfter = token.balanceOf(address(this));
        // Return the amount that was *actually* transferred
        return balanceAfter - balanceBefore;
    }

    /**
     * @notice Repays the borrowed underlying token
     * @param repayAmount The amount of the underlying token to repay
     * @return bool indicating success
     */
    function repay(
        uint256 repayAmount,
        address borrower
    ) external nonReentrant returns (bool) {
        accrueInterest();

        uint256 accountBorrowsPrev = _borrowBalanceStored(msg.sender);
        uint256 repayAmountFinal = repayAmount >= accountBorrowsPrev
            ? accountBorrowsPrev
            : repayAmount;
        underlying.transferFrom(msg.sender, address(this), repayAmountFinal);
        uint256 actualRepayAmount = _doTransferIn(borrower, repayAmountFinal);

        uint256 accountBorrowsNew = accountBorrowsPrev - actualRepayAmount;
        uint256 totalBorrowsNew = totalBorrows - actualRepayAmount;

        /* We write the previously calculated values into storage */
        accountBorrows[borrower].principal = accountBorrowsNew;
        accountBorrows[borrower].interestIndex = borrowIndex;
        totalBorrows = totalBorrowsNew;
        return true;
    }

    /**
     * @notice Returns the current borrow rate per block
     * @return The current borrow rate as a mantissa (scaled by 1e18)
     */
    function getBorrowRate() public view returns (uint256) {
        uint256 cash = underlying.balanceOf(address(this));
        return interestRateModel.getBorrowRate(cash, totalBorrows);
    }

    /**
     * @notice Returns the current supply rate per block
     * @return The current supply rate as a mantissa (scaled by 1e18)
     */
    function getSupplyRate() public view returns (uint256) {
        uint256 cash = underlying.balanceOf(address(this));
        return interestRateModel.getSupplyRate(cash, totalBorrows);
    }

    /// @notice Checks if the provided address is nonzero, reverts otherwise
    /// @param address_ Address to check
    /// @custom:error ZeroAddressNotAllowed is thrown if the provided address is a zero address
    function ensureNonzeroAddress(address address_) public pure {
        if (address_ == address(0)) {
            revert ZeroAddressNotAllowed();
        }
    }

    /**
     * @notice Applies accrued interest to total borrows and reserves
     * @dev This calculates interest accrued from the last checkpointed slot(block or second)
     *  up to the current slot(block or second) and writes new checkpoint to storage and
     *  reduce spread reserves to protocol share reserve
     * @return Always NO_ERROR
     * @custom:event Emits AccrueInterest event on success
     * @custom:access Not restricted
     */
    function accrueInterest() public virtual returns (uint256) {
        /* Remember the initial block number or timestamp */
        uint256 currentBlockNumber = block.number;

        /* Read the previous values out of storage */
        uint256 cashPrior = underlying.balanceOf(address(this));
        uint256 borrowsPrior = totalBorrows;
        uint256 borrowIndexPrior = borrowIndex;

        /* Calculate the current borrow interest rate */
        uint256 borrowRateMantissa = interestRateModel.getBorrowRate(
            cashPrior,
            borrowsPrior
        );
        if (borrowRateMantissa >= MAX_BORROW_RATE_MANTISSA) {
            revert BorrowRateTooMuch();
        }

        /* Calculate the number of slots elapsed since the last accrual */
        uint256 blockDelta = currentBlockNumber - accrualBlockNumber;

        /*
         * Calculate the interest accumulated into borrows and reserves and the new index:
         *  simpleInterestFactor = borrowRate * blockDelta
         *  interestAccumulated = simpleInterestFactor * totalBorrows
         *  totalBorrowsNew = interestAccumulated + totalBorrows
         *  borrowIndexNew = simpleInterestFactor * borrowIndex + borrowIndex
         */

        uint256 simpleInterestFactor = borrowRateMantissa * blockDelta;
        uint256 interestAccumulated = simpleInterestFactor * borrowsPrior;
        uint256 totalBorrowsNew = interestAccumulated + borrowsPrior;

        uint256 borrowIndexNew = (simpleInterestFactor * borrowIndexPrior) +
            borrowIndexPrior;

        /////////////////////////
        // EFFECTS & INTERACTIONS
        // (No safe failures beyond this point)

        /* We write the previously calculated values into storage */
        accrualBlockNumber = currentBlockNumber;
        borrowIndex = borrowIndexNew;
        totalBorrows = totalBorrowsNew;

        return 0;
    }

    function _borrowBalanceStored(
        address account
    ) internal view returns (uint256) {
        /* Get borrowBalance and borrowIndex */
        BorrowSnapshot memory borrowSnapshot = accountBorrows[account];

        /* If borrowBalance = 0 then borrowIndex is likely also 0.
         * Rather than failing the calculation with a division by 0, we immediately return 0 in this case.
         */
        if (borrowSnapshot.principal == 0) {
            return 0;
        }

        /* Calculate new borrow balance using the interest index:
         *  recentBorrowBalance = borrower.borrowBalance * market.borrowIndex / borrower.borrowIndex
         */
        uint256 principalTimesIndex = borrowSnapshot.principal * borrowIndex;

        return principalTimesIndex / borrowSnapshot.interestIndex;
    }

    function _exchangeRateStored() internal view virtual returns (uint256) {
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            /*
             * If there are no tokens minted:
             *  exchangeRate = initialExchangeRate
             */
            return initialExchangeRateMantissa;
        }
        /*
         * Otherwise:
         *  exchangeRate = (totalCash + totalBorrows + badDebt - totalReserves) / totalSupply
         */
        uint256 totalCash = underlying.balanceOf(address(this));
        uint256 cashPlusBorrowsMinusReserves = totalCash + totalBorrows;
        uint256 exchangeRate = (cashPlusBorrowsMinusReserves * ONE_MANTISSA) /
            _totalSupply;

        return exchangeRate;
    }

    function getAccountSnapshot(
        address account
    ) external view returns (uint256, uint256, uint256) {
        return (
            accountTokens[account],
            _borrowBalanceStored(account),
            _exchangeRateStored()
        );
    }
}
