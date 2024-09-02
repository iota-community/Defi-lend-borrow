// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IInterestRateModel.sol";

/**
 * @title InterestRateModel Contract
 */
contract InterestRateModel is IInterestRateModel {
    event NewInterestParams(uint baseRatePerBlock, uint multiplierPerBlock);

    uint256 private constant BASE = 1e18;

    /**
     * @notice The approximate number of blocks per year that is assumed by the interest rate model
     */
    uint public constant blocksPerYear = 2102400;

    /**
     * @notice The multiplier of utilization rate that gives the slope of the interest rate
     */
    uint public multiplierPerBlock;

    /**
     * @notice The base interest rate which is the y-intercept when utilization rate is 0
     */
    uint public baseRatePerBlock;

    /**
     * @notice Construct an interest rate model
     * @param baseRatePerYear The approximate target base APR, as a mantissa (scaled by BASE)
     * @param multiplierPerYear The rate of increase in interest rate wrt utilization (scaled by BASE)
     */
    constructor(uint baseRatePerYear, uint multiplierPerYear) {
        baseRatePerBlock = baseRatePerYear / blocksPerYear;
        multiplierPerBlock = multiplierPerYear / blocksPerYear;

        emit NewInterestParams(baseRatePerBlock, multiplierPerBlock);
    }

    /**
     * @notice Calculates the utilization rate of the market: `borrows / (cash + borrows)`
     * @param cash The amount of cash in the market
     * @param borrows The amount of borrows in the market
     * @return The utilization rate as a mantissa between [0, BASE]
     */
    function utilizationRate(
        uint cash,
        uint borrows
    ) public pure returns (uint) {
        // Utilization rate is 0 when there are no borrows
        if (borrows == 0) {
            return 0;
        }

        return (borrows * BASE) / (cash + borrows);
    }

    /**
     * @notice Calculates the current borrow rate per block, with the error code expected by the market
     * @param cash The amount of cash in the market
     * @param borrows The amount of borrows in the market
     * @return The borrow rate percentage per block as a mantissa (scaled by BASE)
     */
    function getBorrowRate(uint cash, uint borrows) public view returns (uint) {
        uint ur = utilizationRate(cash, borrows);
        return ((ur * multiplierPerBlock) / BASE) + baseRatePerBlock;
    }

    /**
     * @notice Calculates the current supply rate per block
     * @param cash The amount of cash in the market
     * @param borrows The amount of borrows in the market
     * @return The supply rate percentage per block as a mantissa (scaled by BASE)
     */
    function getSupplyRate(uint cash, uint borrows) public view returns (uint) {
        uint oneMinusReserveFactor = BASE;
        uint borrowRate = getBorrowRate(cash, borrows);
        uint rateToPool = (borrowRate * oneMinusReserveFactor) / BASE;
        return (utilizationRate(cash, borrows) * rateToPool) / BASE;
    }
}
