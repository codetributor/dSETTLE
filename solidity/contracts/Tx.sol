// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Wllo.sol";

contract Tx {
    uint256 multipleOfPrice = 2;
    address owner;
    uint sellerCollateral;
    uint buyerCollateral;
    uint tipForSeller;
    uint tipForBuyer;

    struct Transaction {
        string item;
        uint256 price;
        string recipientPhysicalAddress;
        string sellerPhysicalAddress;
        bool dispute;
        address recipient;
        address seller;
        bool sellerSettled;
        bool recipientSettled;
        bool pending;
        bool finalSettlement;
    }

    Transaction public transaction;

    address public WlloContractAddress;

    constructor(
        string memory _item,
        uint256 _price,
        string memory _sellerPhysicalAddress,
        address _WlloContractAddress
    ) payable {
        require(msg.value >= _price, "You did not put enough collateral funds");
        Transaction memory _transaction = Transaction(
            _item,
            _price,
            _sellerPhysicalAddress,
            "null",
            false,
            address(0),
            msg.sender,
            false,
            false,
            false,
            false
        );
        transaction = _transaction;
        owner = msg.sender;
        transaction.seller = msg.sender;
        WlloContractAddress = _WlloContractAddress;
        Wllo(WlloContractAddress).addSellerTx(
            address(this),
            transaction.seller
        );
        sellerCollateral += transaction.price;
    }

    function purchase(string memory _recipientPhysicalAddress) public payable {
        require(
            msg.value == transaction.price * multipleOfPrice,
            "Not enough memory to purchase"
        );
        transaction.recipientPhysicalAddress = _recipientPhysicalAddress;
        transaction.recipient = msg.sender;
        transaction.pending = true;
        Wllo(WlloContractAddress).addBuyerTx(
            address(this),
            transaction.recipient
        );
        buyerCollateral += transaction.price * multipleOfPrice;
    }

    function dispute() public {
        require(
            msg.sender == transaction.recipient,
            "You are not authorized to dispute"
        );
        transaction.dispute = true;
    }

    function tipSeller() public payable {
        require(
            msg.sender == transaction.recipient,
            "You are not authorized to to tip"
        );
        tipForSeller += msg.value;
    }

    function tipBuyer() public payable {
        require(
            msg.sender == transaction.seller,
            "You are not authorized to tip"
        );
        tipForBuyer += msg.value;
    }

    function payOutRecipient(address _msgSender) public {
        require(
            _msgSender == transaction.recipient,
            "You are not authorized to settle"
        );
        if (transaction.dispute == false) {
            Wllo(WlloContractAddress).removeTx(
                address(this),
                transaction.seller,
                transaction.recipient
            );
            (bool success0, ) = transaction.seller.call{
                value: transaction.price * multipleOfPrice
            }("");
            (bool success1, ) = transaction.recipient.call{
                value: transaction.price
            }("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            transaction.finalSettlement = true;
        } else {
            require(transaction.sellerSettled == true, "Seller did not settle");
            Wllo(WlloContractAddress).removeTx(
                address(this),
                transaction.seller,
                transaction.recipient
            );
            (bool success0, ) = owner.call{
                value: transaction.price * multipleOfPrice
            }("");
            (bool success1, ) = transaction.recipient.call{
                value: transaction.price
            }("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            transaction.finalSettlement = true;
        }
    }

    function recipientSettle() public {
        require(
            msg.sender == transaction.recipient,
            "You are not authorized to settle"
        );
        transaction.recipientSettled = true;
        payOutRecipient(msg.sender);
    }

    function payOutSeller(address _msgSender) public {
        require(
            transaction.dispute == true && transaction.recipientSettled == true
        );
        require(
            _msgSender == transaction.seller,
            "You are not authorized to settle"
        );

        Wllo(WlloContractAddress).removeTx(
            address(this),
            transaction.seller,
            transaction.recipient
        );
        (bool success0, ) = transaction.seller.call{
            value: transaction.price * multipleOfPrice
        }("");
        (bool success1, ) = transaction.recipient.call{
            value: transaction.price
        }("");
        if (!success0) {
            revert();
        }
        if (!success1) {
            revert();
        }
        transaction.finalSettlement = true;
    }

    function sellerSettle() public {
        require(
            msg.sender == transaction.seller,
            "You are not autherized to settle"
        );
        transaction.sellerSettled = true;
        payOutSeller(msg.sender);
    }

    function sellerRefund() public {
        require(
            msg.sender == transaction.seller,
            "You are not autherized to refund"
        );
        Wllo(WlloContractAddress).removeTx(
            address(this),
            transaction.seller,
            transaction.recipient
        );
        (bool success0, ) = transaction.seller.call{value: transaction.price}(
            ""
        );
        (bool success1, ) = transaction.recipient.call{
            value: transaction.price * multipleOfPrice
        }("");
        if (!success0) {
            revert();
        }
        if (!success1) {
            revert();
        }
    }

    function getSellerCollateral() public view returns (uint256) {
        return sellerCollateral;
    }

    function getRecipientCollateral() public view returns (uint256) {
        return buyerCollateral;
    }

    function getPrice() public view returns (uint256) {
        return transaction.price;
    }

    function getItem() public view returns (string memory) {
        return transaction.item;
    }

    function getTotalContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
