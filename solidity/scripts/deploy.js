const { ethers } = require("hardhat");

async function main() {
    const Dsettle = await ethers.getContractFactory("TxFactory");
    const dSettle = await Dsettle.deploy();
    await dSettle.deployed();

    console.log(`TxFactory contract address: ${dSettle.address}`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});
