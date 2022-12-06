const { ethers, hre, accounts } = require("hardhat");
const { expect, assert } = require("chai");

describe("dSettle", () => {
    let Dsettle,
        dSettle,
        TxFactory,
        txFactory,
        Tx,
        tx,
        DsettleContractAddress,
        signer;

    beforeEach(async () => {
        Dsettle = await ethers.getContractFactory("Dsettle");
        dSettle = await Dsettle.deploy();
        await dSettle.deployed();
        DsettleContractAddress = dSettle.address;

        TxFactory = await ethers.getContractFactory("TxFactory");
        txFactory = await TxFactory.deploy(DsettleContractAddress);
        await txFactory.deployed();

        Tx = await ethers.getContractFactory("Tx");
        signer = await ethers.getSigner();
        tx = await Tx.connect(signer).deploy(
            "shoes",
            "1000000000000000000",
            "Honolulu",
            DsettleContractAddress,
            { value: ethers.utils.parseEther("1") }
        );
        await tx.deployed();
    });
    it("tx exists", async () => {
        const currentTitle = await tx.getItem();
        assert.equal(currentTitle, "shoes", "title wrong");
    });
    it("purchase by buyer", async () => {
        const accounts = await ethers.getSigners();
        const price = await tx.connect(accounts[1]).getPrice();
        await tx
            .connect(accounts[1])
            .purchase("Switzerland", { value: price.mul(2) });
        const pending = await tx.connect(accounts[1]).getPending();
        assert.equal(pending, true);
    });
    describe("both parties settled", async () => {
        let accounts;
        beforeEach(async () => {
            accounts = await ethers.getSigners();
            const price = await tx.connect(accounts[1]).getPrice();
            await tx
                .connect(accounts[1])
                .purchase("Switzerland", { value: price.mul(2) });
        });
        it("buyer settles", async () => {
            const sellerBeginningBalance = await ethers.provider
                .getBalance(accounts[0])
                .toString();
            const price = await tx.connect(accounts[1]).getPrice();
            await tx.connect(accounts[1]).buyerSettle();
            const sellerEndingBalance = await ethers.provider
                .getBalance(accounts[0])
                .toString();
            assert(sellerEndingBalance, sellerBeginningBalance + price);
        });
    });
});
