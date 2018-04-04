# vuejs front-end for lottery smart contract

Vuejs front end implementation for the advanced lottery smart contract, written with good practices from scratch. This frontend is reactive and uses web3.js and requires Metamask installed in browser.

## Features

1. Dashboard with the list of public lotteries created by community
2. Lottery management dashboard
3. Create any number of lotteries by anyone
4. Lotteries can only be activated by the creator of the lottery
5. Lottery can be deleted by the creator of the lottery
6. Anyone can participate into lottery by spending eth limit set by the creator
7. Maximum entries is also set by the creator of the lottery
8. List of participants in the lottery is displayed in the lottery management dashboard
9. Winner is chosen by random inside the contract, triggered by lottery creator.
10. Total ether collected is paid to the winner automatically upon winner selection.

## Setup contract

1. Build lottery contract as described [here](https://github.com/ashisherc/advanced-solidity-lottery-application/tree/master/ethereum)
2. Copy output files into /src/contract
3. Deploy contract as described [here](https://github.com/ashisherc/advanced-solidity-lottery-application/tree/master/ethereum)
4. Copy contract address and paste it into /src/config.js

```js

lotteryFactoryAddress: "DEPLOYED_CONTRACT_ADDRESS_HERE"

```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
