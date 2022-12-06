// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Dsettle.sol";

contract Tx {
    uint256 multipleOfPrice = 2;
    uint sellerCollateral;
    uint buyerCollateral;
    uint tipForSeller;
    uint tipForBuyer;
    string item;
    uint256 price;
    string buyerPhysicalAddress;
    string sellerPhysicalAddress;
    bool dispute;
    address buyer;
    address seller;
    bool sellerSettled;
    bool buyerSettled;
    bool pending;
    bool finalSettlement;
    address public DsettleContractAddress;

    constructor(
        string memory _item,
        uint256 _price,
        string memory _sellerPhysicalAddress,
        address _DsettleContractAddress
    ) payable {
        require(msg.value >= _price, "You did not put enough collateral funds");

        item = _item;
        price = _price;
        sellerPhysicalAddress = _sellerPhysicalAddress;
        buyer = address(0);
        seller = msg.sender;
        DsettleContractAddress = _DsettleContractAddress;
        Dsettle(DsettleContractAddress).addSellerTx(address(this), seller);
        sellerCollateral += price;
    }

    function purchase(string memory _buyerPhysicalAddress) public payable {
        require(
            msg.value == price * multipleOfPrice,
            "Not enough memony to purchase"
        );
        buyerPhysicalAddress = _buyerPhysicalAddress;
        buyer = msg.sender;
        pending = true;
        Dsettle(DsettleContractAddress).addBuyerTx(address(this), buyer);
        buyerCollateral += price * multipleOfPrice;
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
            Dsettle(DsettleContractAddress).removeTx(
                address(this),
                seller,
                buyer
            );
            (bool success0, ) = seller.call{value: price * multipleOfPrice}("");
            (bool success1, ) = buyer.call{value: price}("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            finalSettlement = true;
        } else {
            require(sellerSettled == true, "Seller did not settle");
            Dsettle(DsettleContractAddress).removeTx(
                address(this),
                seller,
                buyer
            );
            (bool success0, ) = seller.call{value: price * multipleOfPrice}("");
            (bool success1, ) = buyer.call{value: price}("");
            if (!success0) {
                revert();
            }
            if (!success1) {
                revert();
            }
            finalSettlement = true;
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

        Dsettle(DsettleContractAddress).removeTx(address(this), seller, buyer);
        (bool success0, ) = seller.call{value: price * multipleOfPrice}("");
        (bool success1, ) = buyer.call{value: price}("");
        if (!success0) {
            revert();
        }
        if (!success1) {
            revert();
        }
        finalSettlement = true;
    }

    function sellerSettle() public {
        require(msg.sender == seller, "You are not autherized to settle");
        sellerSettled = true;
        payOutSeller(msg.sender);
    }

    function sellerRefund() public {
        require(msg.sender == seller, "You are not autherized to refund");
        Dsettle(DsettleContractAddress).removeTx(address(this), seller, buyer);
        (bool success0, ) = seller.call{value: price}("");
        (bool success1, ) = buyer.call{value: price * multipleOfPrice}("");
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
}
