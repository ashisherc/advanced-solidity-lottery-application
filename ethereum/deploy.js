const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./build/LotteryGenerator.json');
const config = require('./config');

const provider = new HDWalletProvider(
    config.SEED_WORDS,
    config.PROVIDER_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to delpoy from account : ", accounts[0]);

    const inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode
        })
        .send({ from: accounts[0], gas: "6000000" });
    console.log("Contract deployed to : ", inbox.options.address);
}

deploy();