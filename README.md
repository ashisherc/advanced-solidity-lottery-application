# This is an old project, the solidity code might still be relevant today, but the frontend might not work.

#   Advanced Lottery Solidity Smart Contract

This is an advanced lottery smart contract explaining some of the very useful CRUD operations required to create an application using solidity on Ethereum.

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

## How to use

### Clone the repo

``` sh
$ git clone git@github.com:ashisherc/advanced-solidity-lottery-application.git
```

Refer README inside ethereum and vuejs-frontend folder to run the application.

You can use [Ganache](http://truffleframework.com/ganache/) GUI as private testnet for the purpose and connect Metamask to Ganache.
