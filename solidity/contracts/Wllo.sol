//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Wllo {
    mapping(address => address[]) public sellersTx;
    mapping(address => address[]) public buyersTx;
    address[] public sellerTxArray;
    address[] public buyerTxArray;

    function addSellerTx(
        address _txContractAddress,
        address _sellerAddress
    ) public {
        sellersTx[_sellerAddress].push(_txContractAddress);
        sellerTxArray.push(_txContractAddress);
    }

    function addBuyerTx(
        address _txContractAddress,
        address _buyerAddress
    ) public {
        buyersTx[_buyerAddress].push(_txContractAddress);
        buyerTxArray.push(_txContractAddress);
    }

    function removeTx(
        address _txContractAddress,
        address _sellerAddress,
        address _buyerAddress
    ) public {
        for (uint256 i = 0; i < sellersTx[_sellerAddress].length; i++) {
            if (sellersTx[_sellerAddress][i] == _txContractAddress) {
                sellersTx[_sellerAddress][i] = sellersTx[_sellerAddress][
                    sellersTx[_sellerAddress].length - 1
                ];
                sellersTx[_sellerAddress].pop();
            }
        }
        for (uint256 i = 0; i < buyersTx[_buyerAddress].length; i++) {
            if (buyersTx[_buyerAddress][i] == _txContractAddress) {
                buyersTx[_buyerAddress][i] = buyersTx[_buyerAddress][
                    buyersTx[_buyerAddress].length - 1
                ];
                buyersTx[_buyerAddress].pop();
            }
        }

        for (uint256 i = 0; i < sellerTxArray.length; i++) {
            if (sellerTxArray[i] == _txContractAddress) {
                sellerTxArray[i] = sellerTxArray[sellerTxArray.length - 1];
                sellerTxArray.pop();
            }
        }
        for (uint256 i = 0; i < buyerTxArray.length; i++) {
            if (buyerTxArray[i] == _txContractAddress) {
                buyerTxArray[i] = buyerTxArray[buyerTxArray.length - 1];
                buyerTxArray.pop();
            }
        }
    }
}
