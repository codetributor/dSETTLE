require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");
require("solidity-coverage");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: "0.8.9",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accountns: [PRIVATE_KEY],
        },
        hardhat: {
            allowUnlimitedContractSize: true,
        },
    },
};
