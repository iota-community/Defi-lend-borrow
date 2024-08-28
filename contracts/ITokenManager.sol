// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IToken.sol";

contract ITokenManager {
    /// @notice Mapping of IToken addresses to a boolean indicating whether they are supported
    mapping(address => bool) public supportedTokens;

    /// @notice Array to store all supported token addresses
    address[] private supportedTokenList;

    /// @notice Mapping of account addresses to collateral balances
    mapping(address => mapping(address => uint256)) public accountCollaterals;

    /// @notice Events for adding/removing tokens and updating collateral
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event CollateralUpdated(address indexed account, address indexed token, uint256 newCollateral);

    /// @notice Only allow supported tokens
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    /**
     * @notice Adds a new IToken to the manager
     * @param token The address of the IToken to add
     */
    function addToken(address token) external {
        require(!supportedTokens[token], "Token already added");
        supportedTokens[token] = true;
        supportedTokenList.push(token);  // Add token to the list
        emit TokenAdded(token);
    }

    /**
     * @notice Removes an IToken from the manager
     * @param token The address of the IToken to remove
     */
    function removeToken(address token) external {
        require(supportedTokens[token], "Token not found");
        supportedTokens[token] = false;

        // Remove token from the list
        for (uint i = 0; i < supportedTokenList.length; i++) {
            if (supportedTokenList[i] == token) {
                supportedTokenList[i] = supportedTokenList[supportedTokenList.length - 1];
                supportedTokenList.pop();
                break;
            }
        }

        emit TokenRemoved(token);
    }

    /**
     * @notice Updates the collateral for a specific account and token
     * @param account The address of the account
     * @param token The address of the token
     * @param newCollateral The new collateral amount
     */
    function updateCollateral(address account, address token, uint256 newCollateral) external onlySupportedToken(token) {
        accountCollaterals[account][token] = newCollateral;
        emit CollateralUpdated(account, token, newCollateral);
    }

    /**
     * @notice Checks if the account has sufficient collateral to borrow
     * @param account The address of the account
     * @param token The address of the token being borrowed
     * @param borrowAmount The amount of token being borrowed
     * @return bool indicating if the account has enough collateral
     */
    function checkCollateral(address account, address token, uint256 borrowAmount) external view returns (bool) {
        // Example logic: 1.5x collateral requirement
        uint256 collateral = accountCollaterals[account][token];
        return collateral >= borrowAmount * 150 / 100;
    }

    /**
     * @notice Returns the list of all supported tokens
     * @return address[] array of supported token addresses
     */
    function getAllSupportedTokens() external view returns (address[] memory) {
        return supportedTokenList;
    }
}
