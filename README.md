# STBX Token

## Recommendations for use

When using functions, all return numeric values (like `balances`, `totalSupply`, `allowances`) must
be divided by `10^18` to get the value that should be.

When usnig function `stockSplit(_x, _y)` and `reverseStockSplit(_x, _y)`, you need to choose power
to multiply and use it every time you need to call this functions. `_x` and `_y` must be multiplied
on `10^power` every time. Power must be the same as with the first call to one of the functions.
Otherwise, a calculation error will occur and it will be impossible to fix without contract
redeploying.
We recommend using `10^5` for these (when looking at splits and reverse splits, we did not
find more than 5 values after the decimal point).

## Local launching and deploying

```
npm run start
```

## Testing

```
npm run test
```

## Deployment

In order to deploy the contract you have to edit `package.json` at `config.deploy` section. You have to specify:

- `key` - deployment private key serialized as a hex string
- `account` - Ethereum account derived from the `key`
- `etherscanApiKey` - API key from Etherscan (used for contract verification process)

Once the above-mentioned variables are set you can run:

```sh
npm run deploy -- --network kovan
```
This will deploy contract in testnet.

To deploy contract in mainnet you need to run:

```sh
npm run deploy -- --network main
```

And after deployment process is finished you'll be able to see output like this:

```plain
1_deploy_contracts.js
=====================

   Deploying 'STBXToken'
   ---------------------
   > transaction hash:    0x912d3e31f4a8872e4c39ed8ccced79c5bba45c023e66a99dc075778cfa531911
   > Blocks: 0            Seconds: 4
   > contract address:    0xc2cAdbBa7291894Be58ff718Eac5f2458f3C807A
   > block number:        21996046
   > block timestamp:     1604920940
   > account:             0xbeef3e472c30BEC98b89710bd9aE437aa6F40c6b
   > balance:             0.8927423
   > gas used:            4888141 (0x4a964d)
   > gas price:           25 gwei
   > value sent:          0 ETH
   > total cost:          0.122203525 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:         0.122203525 ETH
```

## Contract Verification

It's also possible to automatically verify the contract on Etherscan after deployment.

Once deployment has finished, run the following command:

```sh
npm run verify -- --network kovan
```