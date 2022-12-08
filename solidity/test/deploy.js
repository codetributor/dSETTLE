const { ethers } = require("hardhat");
const { assert } = require("chai");

async function main() {
    describe("dSETTLE", async () => {
        let Dsettle, dSettle;
        beforeEach(async () => {
            Dsettle = await ethers.getContractFactory("TxFactory");
            dSettle = await Dsettle.deploy();
            await dSettle.deployed();
        });
        it("check items", async () => {
            const accounts = await ethers.getSigners();
            await dSettle
                .connect(accounts[1])
                .createTxContract("shoes", "1000000000000000000", "Honolulu", {
                    value: ethers.utils.parseEther("1"),
                });
            const Tx1 = await ethers.getContractAt(
                "Tx",
                await dSettle.getTransaction(1)
            );
            assert.equal(await Tx1.getItem(), "shoes");

            await dSettle
                .connect(accounts[2])
                .createTxContract("hat", "1000000000000000000", "New York", {
                    value: ethers.utils.parseEther("1"),
                });
            const Tx2 = await ethers.getContractAt(
                "Tx",
                await dSettle.getTransaction(2)
            );
            assert.equal(await Tx2.getItem(), "hat");

            await dSettle
                .connect(accounts[3])
                .createTxContract("boba", "1000000000000000000", "Spain", {
                    value: ethers.utils.parseEther("1"),
                });
            const Tx3 = await ethers.getContractAt(
                "Tx",
                await dSettle.getTransaction(3)
            );
            assert.equal(await Tx3.getItem(), "boba");
        });
        it("check purchase", async () => {
            const accounts = await ethers.getSigners();
            await dSettle
                .connect(accounts[1])
                .createTxContract("shoes", "1000000000000000000", "Honolulu", {
                    value: ethers.utils.parseEther("1"),
                });
            const Tx1 = await ethers.getContractAt(
                "Tx",
                await dSettle.getTransaction(1)
            );
            await Tx1.connect(accounts[4]).purchase("China", {
                value: ethers.utils.parseEther("2"),
            });
            assert.equal(await Tx1.connect(accounts[4]).getPending(), true);
        });
        it("check payout", async () => {
            const accounts = await ethers.getSigners();
            await dSettle
                .connect(accounts[1])
                .createTxContract("shoes", "1000000000000000000", "Honolulu", {
                    value: ethers.utils.parseEther("1"),
                });
            const Tx1 = await ethers.getContractAt(
                "Tx",
                await dSettle.getTransaction(1)
            );
            await Tx1.connect(accounts[4]).purchase("China", {
                value: ethers.utils.parseEther("2"),
            });
            const sellerCollateral = await Tx1.connect(
                accounts[4]
            ).getSellerCollateral();
            const buyerCollateral = await Tx1.connect(
                accounts[4]
            ).getBuyerCollateral();
            const transaction = await Tx1.connect(accounts[4]).buyerSettle();
            const endingSellerCollateral = await Tx1.connect(
                accounts[4]
            ).getSellerCollateral();
            const endingBuyerCollateral = await Tx1.connect(
                accounts[4]
            ).getBuyerCollateral();
            assert.equal(endingBuyerCollateral, 0);
            assert.equal(endingBuyerCollateral, 0);
        });
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
