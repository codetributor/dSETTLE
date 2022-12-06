//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Tx.sol";

contract TxFactory {
    address DsettleContractAddress;

    constructor(address _DsettleContractAddress) {
        DsettleContractAddress = _DsettleContractAddress;
    }

    function createTxContract(
        string memory _item,
        uint256 _price,
        string memory _sellerPhysicalAddress
    ) public {
        new Tx(_item, _price, _sellerPhysicalAddress, DsettleContractAddress);
    }
}
