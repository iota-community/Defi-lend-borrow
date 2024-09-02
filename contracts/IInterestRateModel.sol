// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInterestRateModel {
    function getBorrowRate(
        uint cash,
        uint borrows
    ) external view returns (uint);

    function getSupplyRate(
        uint cash,
        uint borrows
    ) external view returns (uint);
}
