// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISupraSValueFeed {
    // Data structure to hold the pair data
    struct priceFeed {
        uint256 round;
        uint256 decimals;
        uint256 time;
        uint256 price;
    }

    // requesting s-value for a single pair
    function getPrice(
        uint256 _priceIndex
    ) external view returns (priceFeed memory);
}
