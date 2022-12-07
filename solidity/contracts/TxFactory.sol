//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Tx.sol";

contract TxFactory {
    address TxFactoryAddress;
    address TxContractAddress;
    uint256 id;

    mapping(address => Tx[]) public transactions;
    Tx[] public transactionsArray;

    constructor(address _DsettleContractAddress) {
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
            id,
            address(this)
        );
    }

    function setTransaction(
        address _transactionAddress
    ) public view returns (Tx) {
        transactions[Tx.origin].push(_transactionAddress);
        transactionsArray.push(_transactionAddress);
    }

    function removeTx(address _transactionAddress) public {
        address[] memory transactions = transactionsArray;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (
                transactions[i].getTransactionAddress() == _transactionAddress
            ) {
                transactionsArray[i] = transactionsArray[
                    transactionsArray.length - 1
                ];
                transactionsArray.pop();
            }
        }
    }

    function getId() public view returns (uint256) {
        return id;
    }
}
