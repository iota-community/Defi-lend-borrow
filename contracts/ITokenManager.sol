// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IToken.sol";
import "./ISupraSValueFeed.sol";

contract ITokenManager {
    /// @notice Mapping of IToken addresses to a boolean indicating whether they are supported
    mapping(address => bool) public supportedTokens;

    /// @notice Array to store all supported token addresses
    address[] private supportedTokenList;

    /// @notice Mapping of account addresses to collateral balances
    mapping(address => mapping(address => uint256)) public accountCollaterals;

    ISupraSValueFeed internal sValueFeed;

    mapping(address => uint256) public tokenOraclePriceIndexes;

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

    error TokenNotListed(address token);
    error PriceError(address token);
    error RedeemAmountTooMuch();
    error BorrowAmountTooMuch();
    /// @notice Thrown if the supplied address is a zero address where it is not allowed
    error ZeroAddressNotAllowed();

    /// @notice Only allow supported tokens
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    /// @notice Checks if the provided address is nonzero, reverts otherwise
    /// @param address_ Address to check
    /// @custom:error ZeroAddressNotAllowed is thrown if the provided address is a zero address
    function ensureNonzeroAddress(address address_) public pure {
        if (address_ == address(0)) {
            revert ZeroAddressNotAllowed();
        }
    }

    constructor(address supraOracleFeed) {
        ensureNonzeroAddress(supraOracleFeed);

        sValueFeed = ISupraSValueFeed(supraOracleFeed);
    }

    /**
     * @notice Adds a new IToken to the manager
     * @param token The address of the IToken to add
     */
    function addToken(
        address token,
        uint256 tokenOraclePriceIndex,
        uint256 tokenCollateralFactor
    ) external {
        ensureNonzeroAddress(token);

        require(!supportedTokens[token], "Token already added");
        supportedTokens[token] = true;
        tokenOraclePriceIndexes[token] = tokenOraclePriceIndex;
        tokenCollateralFactors[token] = tokenCollateralFactor;
        supportedTokenList.push(token); // Add token to the list
        emit TokenAdded(token);
    }

    /**
     * @notice Removes an IToken from the manager
     * @param token The address of the IToken to remove
     */
    function removeToken(address token) external {
        ensureNonzeroAddress(token);

        require(supportedTokens[token], "Token not found");
        delete supportedTokens[token];
        delete tokenOraclePriceIndexes[token];

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
     * @notice Returns the list of all supported tokens
     * @return address[] array of supported token addresses
     */
    function getAllSupportedTokens() external view returns (address[] memory) {
        return supportedTokenList;
    }

    function preMintChecks(address ITokenAddress) external view {
        if (!supportedTokens[ITokenAddress]) {
            revert TokenNotListed(ITokenAddress);
        }
    }

    function preRedeemChecks(
        address iTokenAddress,
        address redeemer,
        uint256 amount
    ) external view {
        if (!supportedTokens[iTokenAddress]) {
            revert TokenNotListed(iTokenAddress);
        }

        uint256 collaterals;
        uint256 borrows;
        (collaterals, borrows) = hasLiquidity(
            redeemer,
            iTokenAddress,
            amount,
            0
        );

        uint256 canRedeem = collaterals - borrows;

        if (canRedeem < 0) {
            revert RedeemAmountTooMuch();
        }
    }

    function preBorrowChecks(
        address iTokenAddress,
        address redeemer,
        uint256 amount
    ) external view {
        if (!supportedTokens[iTokenAddress]) {
            revert TokenNotListed(iTokenAddress);
        }

        uint256 collaterals;
        uint256 borrows;
        (collaterals, borrows) = hasLiquidity(
            redeemer,
            iTokenAddress,
            0,
            amount
        );

        uint256 canBorrow = collaterals - borrows;
        if (canBorrow < 0) {
            revert BorrowAmountTooMuch();
        }
    }

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
            ISupraSValueFeed.priceFeed memory oracleData = sValueFeed.getPrice(
                tokenOraclePriceIndexes[assets[i]]
            );

            uint256 iTokenPrice = (exchangeRateMantissa * oracleData.price) /
                ONE_MANTISSA;
            uint256 iTokenWithCollateral = (iTokenPrice *
                iTokenBalance *
                tokenCollateralFactors[assets[i]]) /
                (ONE_MANTISSA * ONE_MANTISSA);

            totalAccountCollaterals += iTokenWithCollateral;

            uint256 tokenBorrows = (iTokenPrice * borrowBalance) / ONE_MANTISSA;

            totalAccountBorrows += tokenBorrows;

            if (iToken == assets[i]) {
                uint256 redeemTokenWithCollateral = (iTokenPrice *
                    redeemTokens *
                    tokenCollateralFactors[assets[i]]) /
                    (ONE_MANTISSA * ONE_MANTISSA);

                totalAccountCollaterals -= redeemTokenWithCollateral;

                tokenBorrows = (iTokenPrice * borrowTokens) / ONE_MANTISSA;
                totalAccountBorrows += tokenBorrows;
            }
        }
    }
}
