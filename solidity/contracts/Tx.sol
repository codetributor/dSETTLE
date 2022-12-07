// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./TxFactory.sol";

contract Tx {
    address public TxFactoryContractAddress;

    string item;
    uint256 price;
    string sellerPhysicalAddress;
    uint256 id;

    string buyerPhysicalAddress;

    uint256 multipleOfPrice = 2;

    uint sellerCollateral;
    uint buyerCollateral;

    uint tipForSeller;
    uint tipForBuyer;

    bool dispute;
    address buyer;
    address seller;
    bool sellerSettled;
    bool buyerSettled;
    bool pending;
    bool finalSettlement;

    constructor(
        string memory _item,
        uint256 _price,
        string memory _sellerPhysicalAddress,
        uint256 _id,
        address _TxFactoryContractAddress
    ) payable {
        require(msg.value >= _price, "You did not put enough collateral funds");

        item = _item;
        price = _price;
        sellerPhysicalAddress = _sellerPhysicalAddress;
        id = _id;

        TxFactoryContractAddress = _TxFactoryContractAddress;

        buyer = address(0);
        seller = Tx.origin;

        sellerCollateral += price;

        TxFactory(TxFactoryContractAddress).setTransaction(Tx.origin);
    }

    function purchase(string memory _buyerPhysicalAddress, address _TxContractAddress) public payable {
        require(
            msg.value == price * multipleOfPrice,
            "Not enough memony to purchase"
        );
        buyerPhysicalAddress = _buyerPhysicalAddress;
        buyer = msg.sender;
        pending = true;
        sellerCollateral += msg.value * multipleOfPrice;

        }
 
 }    

    function setDispute() public {
        require(msg.sender == buyer, "You are not authorized to dispute");
        dispute = true;
    }

    function tipSeller() public payable {
        require(msg.sender == buyer, "You are not authorized to to tip");
        tipForSeller += msg.value;
    }

    function tipBuyer() public payable {
        require(msg.sender == seller, "You are not authorized to tip");
        tipForBuyer += msg.value;
    }

    function payOutbuyer(address _msgSender) public {
        require(_msgSender == buyer, "You are not authorized to settle");
        if (dispute == false) {
            TxFactory(TxFactoryContractAddress).removeTx(
                address(this)
            );
            (bool success0, ) = seller.call{value: sellerCollateral + tipForSeller}("");
            (bool success1, ) = buyer.call{value: buyerCollateral + tipForBuyer}("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            buyerCollateral = 0;
            sellerCollateral = 0;
            tipForBuyer = 0;
            tipForSeller = 0;
            finalSettlement = true;
            pending = false;
           
        } else {
            require(sellerSettled == true, "Seller did not settle");
            TxFactory(TxFactoryContractAddress).removeTx(
                address(this)
            );
            (bool success0, ) = seller.call{value: sellerCollateral + tipForSeller}("");
            (bool success1, ) = buyer.call{value: buyerCollateral + tipForBuyer}("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            finalSettlement = true;
            pending = false;
            tipForBuyer = 0;
            tipForSeller = 0;
            buyerCollateral = 0;
            sellerCollateral = 0;
        }
    }

    function buyerSettle() public {
        require(msg.sender == buyer, "You are not authorized to settle");
        buyerSettled = true;
        payOutbuyer(msg.sender);
    }

    function payOutSeller(address _msgSender) public {
        require(dispute == true && buyerSettled == true);
        require(_msgSender == seller, "You are not authorized to settle");

        TxFactory(TxFactoryContractAddress).removeTx(address(this));
        (bool success0, ) = seller.call{value: sellerCollateral + tipForSeller}("");
        (bool success1, ) = buyer.call{value: buyerCollateral + tipForBuyer}("");
        if (!success0) {
            revert();
        }
        if (!success1) {
            revert();
        }
        finalSettlement = true;
        pending = false;
        tipForBuyer = 0;
        tipForSeller = 0;
        buyerCollateral = 0;
        sellerCollateral = 0;
    }

    function sellerSettle() public {
        require(msg.sender == seller, "You are not autherized to settle");
        sellerSettled = true;
        payOutSeller(msg.sender);
    }

    function sellerRefund() public {
        require(msg.sender == seller, "You are not autherized to refund");
        TxFactory(TxFactoryContractAddress).removeTx(address(this));
        (bool success0, ) = seller.call{value: sellerCollateral + tipForSeller}("");
        (bool success1, ) = buyer.call{value: buyerCollateral + tipForBuyer}("");
        if (!success0) {
            revert();
        }
        if (!success1) {
            revert();
        }
        finalSettlement = true;
        pending = false;
        tipForBuyer = 0;
        tipForSeller = 0;
        buyerCollateral = 0;
        sellerCollateral = 0;
    }

    function getTransactionAddress() public view returns(address) {
        return address(this);
    }

    function getSellerCollateral() public view returns (uint256) {
        return sellerCollateral;
    }

    function getbuyerCollateral() public view returns (uint256) {
        return buyerCollateral;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getItem() public view returns (string memory) {
        return item;
    }

    function getTotalContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPending() public view returns (bool) {
        return pending;
    }

    function getSellerPhysicalAddress() public view returns (string memory) {
        return sellerPhysicalAddress;
    }
}
