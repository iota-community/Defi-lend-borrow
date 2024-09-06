// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ITokenManager is Ownable {
    /// @notice Mapping of IToken addresses to a boolean indicating whether they are supported
    mapping(address => bool) public supportedTokens;

    /// @notice Array to store all supported iToken addresses
    address[] public supportedTokenList;

    /// @notice Mapping of account addresses to collateral balances
    mapping(address => mapping(address => uint256)) public accountCollaterals;

    /// @notice Mapping of token addresses to their USD prices
    mapping(address => uint256) public tokenUSDPrices;

    /// @notice Mapping of token addresses to their collateral factors
    mapping(address => uint256) public tokenCollateralFactors;

    uint256 public constant ONE_MANTISSA = 1e18;

    /// @notice Events for adding/removing tokens and updating collateral
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event CollateralUpdated(
        address indexed account,
        address indexed token,
        uint256 newCollateral
    );

    /// @notice Custom errors
    error TokenNotListed(address token);
    error PriceError(address token);
    error RedeemAmountTooMuch();
    error BorrowAmountTooMuch();
    error ZeroAddressNotAllowed();

    /// @notice Only allow supported tokens
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /// @notice Checks if the provided address is nonzero, reverts otherwise
    /// @param address_ Address to check
    function ensureNonzeroAddress(address address_) public pure {
        if (address_ == address(0)) {
            revert ZeroAddressNotAllowed();
        }
    }

    /**
     * @notice Adds a new IToken to the manager
     * @param token The address of the IToken to add
     * @param tokenUSDPrice The USD price of the token in Mantissa
     * @param tokenCollateralFactor The collateral factor of the token in Mantissa
     */
    function addToken(
        address token,
        uint256 tokenUSDPrice,
        uint256 tokenCollateralFactor
    ) external onlyOwner {
        ensureNonzeroAddress(token);

        // Use revert if the token has already been added
        if (supportedTokens[token]) {
            revert("Token already added");
        }

        // Revert if collateral factor is greater than 1e18 (1 Mantissa)
        if (tokenCollateralFactor > 1e18) {
            revert("Collateral factor cannot be greater than 1");
        }

        supportedTokens[token] = true;
        tokenUSDPrices[token] = tokenUSDPrice;
        tokenCollateralFactors[token] = tokenCollateralFactor;
        supportedTokenList.push(token);

        emit TokenAdded(token);
    }

    /**
     * @notice Removes an IToken from the manager
     * @param token The address of the IToken to remove
     */
    function removeToken(address token) external onlyOwner {
        ensureNonzeroAddress(token);
        require(supportedTokens[token], "Token not found");

        delete supportedTokens[token];
        delete tokenUSDPrices[token];

        // Remove token from the list
        for (uint i = 0; i < supportedTokenList.length; i++) {
            if (supportedTokenList[i] == token) {
                supportedTokenList[i] = supportedTokenList[
                    supportedTokenList.length - 1
                ];
                supportedTokenList.pop();
                break;
            }
        }

        emit TokenRemoved(token);
    }

    /**
     * @notice Performs checks before allowing a mint operation.
     * @dev Reverts if the token address is not listed in the supported tokens.
     * @param ITokenAddress The address of the token to check.
     */
    function preMintChecks(address ITokenAddress) external view {
        if (!supportedTokens[ITokenAddress]) {
            revert TokenNotListed(ITokenAddress);
        }
    }

    /**
     * @notice Performs checks before allowing a redeem operation.
     * @dev Reverts if the token address is not listed, or if the amount to redeem exceeds the allowable amount based on liquidity.
     * @param iTokenAddress The address of the token to redeem.
     * @param redeemer The address of the account redeeming the tokens.
     * @param amount The amount of underlying token to redeem.
     */
    function preRedeemChecks(
        address iTokenAddress,
        address redeemer,
        uint256 amount
    ) external view {
        if (!supportedTokens[iTokenAddress]) {
            revert TokenNotListed(iTokenAddress);
        }

        uint256 totalCollateralsInUSD;
        uint256 totalBorrowsInUSD;
        (totalCollateralsInUSD, totalBorrowsInUSD) = hasLiquidity(
            redeemer,
            iTokenAddress,
            amount,
            0
        );

        int256 canRedeem = int256(totalCollateralsInUSD - totalBorrowsInUSD);

        if (canRedeem < 0) {
            revert RedeemAmountTooMuch();
        }
    }

    /**
     * @notice Performs checks before allowing a borrow operation.
     * @dev Reverts if the token address is not listed, or if the amount to borrow exceeds the allowable amount based on liquidity.
     * @param iTokenAddress The address of the token to borrow.
     * @param redeemer The address of the account borrowing the tokens.
     * @param amount The amount of tokens to borrow.
     */
    function preBorrowChecks(
        address iTokenAddress,
        address redeemer,
        uint256 amount
    ) external view {
        if (!supportedTokens[iTokenAddress]) {
            revert TokenNotListed(iTokenAddress);
        }

        uint256 totalCollateralsInUSD;
        uint256 totalBorrowsInUSD;
        (totalCollateralsInUSD, totalBorrowsInUSD) = hasLiquidity(
            redeemer,
            iTokenAddress,
            0,
            amount
        );

        int256 canBorrow = int256(totalCollateralsInUSD - totalBorrowsInUSD);
        if (canBorrow < 0) {
            revert BorrowAmountTooMuch();
        }
    }

    /**
     * @notice Calculates the total collateral and borrow balances of an account.
     * @dev Iterates over all supported tokens to determine the total collateral and borrow values, adjusting for any specific redeem or borrow amounts.
     * @param account The address of the account to check liquidity for.
     * @param iToken The address of the token in question.
     * @param redeemTokens The amount of underlying token to redeem (if any).
     * @param borrowTokens The amount of underlying token to borrow (if any).
     * @return totalAccountCollaterals The total value of collateral in USD.
     * @return totalAccountBorrows The total value of borrows in USD.
     */
    function hasLiquidity(
        address account,
        address iToken,
        uint256 redeemTokens,
        uint256 borrowTokens
    )
        internal
        view
        returns (uint256 totalAccountCollaterals, uint256 totalAccountBorrows)
    {
        address[] memory assets = supportedTokenList;
        uint256 assetsLength = assets.length;
        uint256 iTokenBalance;
        uint256 borrowBalance;
        uint256 exchangeRateMantissa;

        for (uint8 i; i < assetsLength; ++i) {
            IToken asset = IToken(assets[i]);

            (iTokenBalance, borrowBalance, exchangeRateMantissa) = asset
                .getAccountSnapshot(account);

            uint256 iTokenPriceInUSD = (exchangeRateMantissa *
                tokenUSDPrices[assets[i]]) / ONE_MANTISSA;

            uint256 iTokenWithCollateralInUSD = (iTokenPriceInUSD *
                iTokenBalance *
                tokenCollateralFactors[assets[i]]) /
                (ONE_MANTISSA * ONE_MANTISSA);

            totalAccountCollaterals += iTokenWithCollateralInUSD;

            uint256 tokenBorrowsInUSD = (tokenUSDPrices[assets[i]] *
                borrowBalance) / ONE_MANTISSA;

            totalAccountBorrows += tokenBorrowsInUSD;

            if (iToken == assets[i]) {
                uint256 redeemTokenWithCollateralInUSD = (tokenUSDPrices[
                    assets[i]
                ] * redeemTokens) / ONE_MANTISSA;

                totalAccountCollaterals -= redeemTokenWithCollateralInUSD;

                tokenBorrowsInUSD =
                    (tokenUSDPrices[assets[i]] * borrowTokens) /
                    ONE_MANTISSA;
                totalAccountBorrows += tokenBorrowsInUSD;
            }
        }
    }

    /**
     * @notice Updates the USD price of a supported token
     * @param token The address of the token to update the price for
     * @param newUSDPrice The new USD price to set for the token
     */
    function updateTokenUSDPrice(
        address token,
        uint256 newUSDPrice
    ) external onlyOwner onlySupportedToken(token) {
        ensureNonzeroAddress(token);

        // Update the USD price for the token
        tokenUSDPrices[token] = newUSDPrice;
    }
}
