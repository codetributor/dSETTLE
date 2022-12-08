//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Tx.sol";

contract TxFactory {
    address TxFactoryAddress;
    address TxContractAddress;
    uint256 id;

    mapping(address => address[]) public transactions;
    address[] public s_transactionsArray;

    constructor() {
        id = 0;
    }

    function createTxContract(
        string memory _item,
        uint256 _price,
        string memory _sellerPhysicalAddress
    ) public payable {
        require(msg.value >= _price);
        id += 1;
        (new Tx){value: _price}(
            _item,
            _price,
            _sellerPhysicalAddress,
            msg.sender,
            id,
            address(this)
        );
    }

    function setTransaction(
        address _seller,
        address _txContractAddress
    ) public {
        transactions[_seller].push(_txContractAddress);
        s_transactionsArray.push(_txContractAddress);
    }

    function removeTx(address _transactionAddress) public {
        address[] memory transactionsArray = s_transactionsArray;
        for (uint256 i = 0; i < transactionsArray.length; i++) {
            if (transactionsArray[i] == _transactionAddress) {
                transactionsArray[i] = transactionsArray[
                    transactionsArray.length - 1
                ];
                s_transactionsArray.pop();
            }
        }
    }

    function getId() public view returns (uint256) {
        return id;
    }

    function getTransaction(
        uint256 _id
    ) public view returns (address _transactionAddress) {
        address[] memory transactionsArray = s_transactionsArray;
        for (uint256 i = 0; i < transactionsArray.length; i++) {
            if (Tx(transactionsArray[i]).getId() == _id) {
                _transactionAddress = s_transactionsArray[i];
            }
        }
    }
}
