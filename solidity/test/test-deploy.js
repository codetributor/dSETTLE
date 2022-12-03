const { ethers, hre } = require("hardhat");
const { expect, assert } = require("chai");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { getSignatureForFn } = require("typechain");

describe("wllo", () => {
  let Wllo, wllo, TxFactory, txFactory, Tx, tx, wlloContractAddress, signer;

  beforeEach(async () => {
    Wllo = await ethers.getContractFactory("Wllo");
    wllo = await Wllo.deploy();
    await wllo.deployed();
    wlloContractAddress = wllo.address;

    TxFactory = await ethers.getContractFactory("TxFactory");
    txFactory = await TxFactory.deploy(wlloContractAddress);
    await txFactory.deployed();

    Tx = await ethers.getContractFactory("Tx");
    signer = await ethers.getSigner();
    tx = await Tx.connect(signer).deploy(
      "shoes",
      "1000000000000000000",
      "Honolulu",
      wlloContractAddress,
      { value: ethers.utils.parseEther("1") }
    );
    await tx.deployed();
  });
  it("value exists", async () => {
    const currentTitle = await tx.getItem();
    assert.equal(currentTitle, "shoes", "title wrong");
  });
});
