const HDWalletProvider = require("@truffle/hdwallet-provider");

const networkId = process.env.npm_package_config_ganache_networkId;
const gasPrice = process.env.npm_package_config_ganache_gasPrice;
const gasLimit = process.env.npm_package_config_ganache_gasLimit;
const etherscanApiKey = process.env.npm_package_config_deploy_etherscanApiKey;
const account = process.env.npm_package_config_deploy_account;
const deployKey = [process.env.npm_package_config_deploy_key];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: networkId,
      gas: gasLimit,
      gasPrice: gasPrice,
      skipDryRun: true,
    },
    kovan: {
      network_id: "42",
      provider: () =>
        new HDWalletProvider(
          deployKey,
          "https://kovan.infura.io/v3/04c5f76635f24c70b28488be34dbd838"
        ),
      gasPrice: 10000000000, // 10 gwei
      gas: 6900000,
      from: account,
      timeoutBlocks: 500,
      skipDryRun: true,
    },
    main: {
      network_id: "1",
      provider: () =>
        new HDWalletProvider(
          deployKey,
          "https://mainnet.infura.io/v3/04c5f76635f24c70b28488be34dbd838"
        ),
      gasPrice: 80000000000, // 10 gwei
      gas: 6900000,
      from: account,
      timeoutBlocks: 500,
      skipDryRun: true,
    },
  },

  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 2,
    },
  },

  compilers: {
    solc: {
      version: "^0.6.0",
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: etherscanApiKey,
  },
};
