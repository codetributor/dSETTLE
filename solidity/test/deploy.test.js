const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

async function main() {
    describe("dSETTLE", async () => {
        let Dsettle, dSettle;
        beforeEach(async () => {
            Dsettle = await ethers.getContractFactory("TxFactory");
            dSettle = await Dsettle.deploy();
            await dSettle.deployed();
        });
        describe("create items", async () => {
            let Tx1, Tx2, Tx3;
            beforeEach(async () => {
                const accounts = await ethers.getSigners();
                await dSettle
                    .connect(accounts[1])
                    .createTxContract(
                        "shoes",
                        "1000000000000000000",
                        "Honolulu",
                        {
                            value: ethers.utils.parseEther("1"),
                        }
                    );
                Tx1 = await ethers.getContractAt(
                    "Tx",
                    await dSettle.getTransaction(1)
                );
                await dSettle
                    .connect(accounts[2])
                    .createTxContract(
                        "hat",
                        "1000000000000000000",
                        "New York",
                        {
                            value: ethers.utils.parseEther("1"),
                        }
                    );
                Tx2 = await ethers.getContractAt(
                    "Tx",
                    await dSettle.getTransaction(2)
                );
                await dSettle
                    .connect(accounts[3])
                    .createTxContract("boba", "1000000000000000000", "Spain", {
                        value: ethers.utils.parseEther("1"),
                    });
                Tx3 = await ethers.getContractAt(
                    "Tx",
                    await dSettle.getTransaction(3)
                );
            });
            it("check items", async () => {
                assert.equal(await Tx1.getItem(), "shoes");
                assert.equal(await Tx2.getItem(), "hat");
                assert.equal(await Tx3.getItem(), "boba");
            });
            describe("make a purchase", async () => {
                beforeEach(async () => {
                    const accounts = await ethers.getSigners();
                    await Tx1.connect(accounts[4]).purchase("China", {
                        value: ethers.utils.parseEther("2"),
                    });
                });
                it("confirm pending", async () => {
                    const accounts = await ethers.getSigners();
                    assert.equal(
                        await Tx1.connect(accounts[4]).getPending(),
                        true
                    );
                });
                it("confirm buyer address", async () => {
                    const accounts = await ethers.getSigners();
                    assert.equal(
                        await Tx1.connect(
                            accounts[4]
                        ).getBuyerPhysicalAddress(),
                        "China"
                    );
                });
                describe("settle", async () => {
                    let sellerCollateral,
                        buyerCollateral,
                        person1,
                        person4,
                        transactionResponse,
                        transactionReceipt,
                        endingPerson1,
                        endingPerson4,
                        endingBuyerCollateral,
                        endingSellerCollateral,
                        fees,
                        finalSettlement,
                        pending;
                    beforeEach(async () => {
                        const accounts = await ethers.getSigners();
                        sellerCollateral = await Tx1.connect(
                            accounts[1]
                        ).getSellerCollateral();

                        buyerCollateral = await Tx1.connect(
                            accounts[4]
                        ).getBuyerCollateral();

                        person1 = await accounts[1].getBalance();
                        person4 = await accounts[4].getBalance();
                        transactionResponse = await Tx1.connect(
                            accounts[4]
                        ).buyerSettle();
                        transactionReceipt = await transactionResponse.wait(1);

                        fees = await transactionReceipt.gasUsed.mul(
                            transactionReceipt.effectiveGasPrice
                        );
                        endingPerson1 = await accounts[1].getBalance();
                        endingPerson4 = await accounts[4].getBalance();

                        endingSellerCollateral = await Tx1.connect(
                            accounts[4]
                        ).getSellerCollateral();
                        endingBuyerCollateral = await Tx1.connect(
                            accounts[4]
                        ).getBuyerCollateral();
                        finalSettlement = await Tx1.connect(
                            accounts[4]
                        ).getFinalSettlement();
                        pending = await Tx1.connect(accounts[4]).getPending();
                    });
                    it("confirm authorization required", async () => {
                        const accounts = await ethers.getSigners();
                        expect(await Tx1.connect(accounts[1]).sellerSettle()).to
                            .be.reverted;
                    });
                    it("confirm collateral of seller", async () => {
                        assert.equal(
                            sellerCollateral.toString(),
                            ethers.utils.parseEther("1")
                        );
                    });
                    it("confirm collateral of buyer", async () => {
                        assert.equal(
                            buyerCollateral.toString(),
                            ethers.utils.parseEther("2")
                        );
                    });
                    it("confirm seller payout", async () => {
                        const settleBalance1 = person1.add(sellerCollateral);
                        assert.equal(
                            endingPerson1.toString(),
                            settleBalance1.toString()
                        );
                    });
                    it("confirm buyer payout", async () => {
                        assert.equal(
                            endingPerson4.add(fees).toString(),
                            person4.add(buyerCollateral).toString()
                        );
                    });
                    it("confirm contract collateral settled", async () => {
                        assert.equal(endingBuyerCollateral, 0);
                        assert.equal(endingBuyerCollateral, 0);
                    });
                    it("confirm final settlement", async () => {
                        assert.equal(finalSettlement, true);
                    });
                    it("confirm pending is settled", async () => {
                        assert.equal(pending, false);
                    });
                });
                describe("dispute", async () => {
                    let transactionResponse1,
                        transactionReceipt1,
                        transactionResponse2,
                        transactionReceipt2,
                        isDispute,
                        endingIsDispute;
                    beforeEach(async () => {
                        const accounts = await ethers.getSigners();
                        isDispute = await Tx1.getDispute();
                        const transactionResponse1 = await Tx1.connect(
                            accounts[4]
                        ).setDispute();
                        const transactionReceipt1 =
                            transactionResponse1.wait(1);
                        endingIsDispute = await Tx1.connect(
                            accounts[4]
                        ).getDispute();
                    });
                    it("confirm dispute", async () => {
                        assert.equal(isDispute, false);
                        assert.equal(endingIsDispute, true);
                    });
                    describe("tip buyer", async () => {
                        let startingTipForBuyer, endingTipForBuyer;
                        beforeEach(async () => {
                            const accounts = await ethers.getSigners();
                            startingTipForBuyer = await Tx1.getTipForBuyer();
                            const transactionResponse2 = await Tx1.connect(
                                accounts[1]
                            ).tipBuyer({
                                value: ethers.utils.parseEther(".5"),
                            });
                            transactionReceipt2 =
                                await transactionResponse2.wait(1);
                            endingTipForBuyer = await Tx1.getTipForBuyer();
                        });
                        it("confirm tip for buyer", async () => {
                            assert.equal(startingTipForBuyer, 0);
                            assert.equal(
                                endingTipForBuyer.toString(),
                                ethers.utils.parseEther(".5")
                            );
                        });
                        describe("seller and buyer settle", async () => {
                            let beforeBalancePerson1,
                                beforeBalancePerson4,
                                endingBalancePerson1,
                                endingBalancePerson4,
                                transactionResponse3,
                                transactionReceipt3,
                                transactionResponse4,
                                transactionReceipt4,
                                gasFeePerson1,
                                gasFeePerson4,
                                sellerCollateral1,
                                buyerCollateral1,
                                endingTipForBuyer1,
                                buyerSettled,
                                sellerSettled;
                            beforeEach(async () => {
                                let accounts = await ethers.getSigners();
                                endingTipForBuyer1 = await Tx1.getTipForBuyer();
                                sellerCollateral1 =
                                    await Tx1.getSellerCollateral();
                                beforeBalancePerson1 =
                                    await accounts[1].getBalance();
                                transactionResponse4 = await Tx1.connect(
                                    accounts[1]
                                ).sellerSettle();
                                transactionReceipt4 =
                                    await transactionResponse4.wait(1);
                                gasFeePerson1 =
                                    await transactionReceipt4.gasUsed.mul(
                                        transactionReceipt4.effectiveGasPrice
                                    );

                                buyerCollateral1 =
                                    await Tx1.getBuyerCollateral();
                                beforeBalancePerson4 =
                                    await accounts[4].getBalance();
                                transactionResponse3 = await Tx1.connect(
                                    accounts[4]
                                ).buyerSettle();
                                transactionReceipt3 =
                                    await transactionResponse3.wait(1);
                                gasFeePerson4 =
                                    await transactionReceipt3.gasUsed.mul(
                                        transactionReceipt3.effectiveGasPrice
                                    );

                                endingBalancePerson1 =
                                    await accounts[1].getBalance();
                                endingBalancePerson4 =
                                    await accounts[4].getBalance();
                                sellerSettled = await Tx1.getSellerSettled();
                                buyerSettled = await Tx1.getBuyerSettled();
                            });
                            it("confirm dispute seller payout", async () => {
                                assert.equal(
                                    endingBalancePerson1
                                        .add(gasFeePerson1)
                                        .toString(),
                                    beforeBalancePerson1
                                        .add(sellerCollateral1)
                                        .toString()
                                );
                            });
                            it("confirm dispute buyer payout", async () => {
                                const balanceAndCollateral =
                                    beforeBalancePerson4.add(buyerCollateral1);
                                assert.equal(
                                    endingBalancePerson4
                                        .add(gasFeePerson4)
                                        .toString(),
                                    balanceAndCollateral
                                        .add(endingTipForBuyer1)
                                        .toString()
                                );
                            });
                        });
                    });
                });
                describe("seller refund", async () => {
                    let transactionResponse,
                        transactionReceipt,
                        fees,
                        beforeBalancePerson1,
                        beforeBalancePerson4,
                        endingBalancePerson1,
                        endingBalancePerson4,
                        buyerCollateral,
                        sellerCollateral;
                    beforeEach(async () => {
                        const accounts = await ethers.getSigners();
                        sellerCollateral = await Tx1.getSellerCollateral();
                        buyerCollateral = await Tx2.getBuyerCollateral();
                        beforeBalancePerson1 = await accounts[1].getBalance();
                        beforeBalancePerson4 = await accounts[4].getBalance();
                        transactionResponse = await Tx1.connect(
                            accounts[1]
                        ).sellerRefund();
                        transactionReceipt = await transactionResponse.wait(1);
                        fees = await transactionReceipt.gasUsed.mul(
                            transactionReceipt.effectiveGasPrice
                        );
                        endingBalancePerson1 = await accounts[1].getBalance();
                        endingBalancePerson4 = await accounts[4].getBalance();
                    });
                    it("confirm buyers payout collateral", async () => {
                        assert(
                            endingBalancePerson4.toString(),
                            beforeBalancePerson4.add(buyerCollateral).toString()
                        );
                    });
                    it("confirm seller payout collateral", async () => {
                        assert(
                            endingBalancePerson1.add(fees).toString(),
                            beforeBalancePerson1
                                .add(sellerCollateral)
                                .toString()
                        );
                    });
                });
            });
        });
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
