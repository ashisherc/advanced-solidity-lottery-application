#   Advanced Lottery Solidity Smart Contract

This is an advanced lottery smart contract explaining some of the very useful CRUD operations required to create an application using solidity on Ethereum.

## Features

Uses very less amount of gas for doing operations such as deleting data from array, finding data from array, by using Struct to store index pointer to the array of data. A blog article would be better I guess to understand the contract. Please read the [README](https://github.com/ashisherc/advanced-solidity-lottery-application/tree/master/vuejs-frontend) of vuejs front-end for this contract to know all features of this contract.

## How to use

### Clone the repo

``` sh
$ git clone git@github.com:ashisherc/advanced-solidity-lottery-application.git

$ cd advanced-solidity-lottery-application/ethereum
$ npm install
```
### Setup configuration file

open config.js file and make the changes accordingly.
```js
    SEED_WORDS: "12 WORD SEED HERE",
    PROVIDER_URL: "Provider URL here, exp. from infura.io"
```

#### Run test

```$ npm test```

#### Compile

```$ node compile```

This will generate build files inside /build folder, required to deploy the contract and to use in front-end.

#### Deploy
```$ npm run deploy```
