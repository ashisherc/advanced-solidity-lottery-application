const ganache = require('ganache-cli');
const Web3 = require('web3');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiAlmost = require('chai-almost');
const assert = require('chai').assert;
const should = require('chai').should();

chai.use(chaiAsPromised);
chai.use(chaiAlmost());

const { interface, bytecode } = require('../build/LotteryGenerator.json');
const lotteryBuild = require('../build/Lottery.json');

describe('Lottery Deployed Not Live', () => {
    const provider = ganache.provider();
    const web3 = new Web3(provider);
    let accounts;
    let lottery;

    before(async () => {
        accounts = await web3.eth.getAccounts();
        const lotteryGenerator = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode })
            .send({ from: accounts[0], gas: "2000000" });
        await lotteryGenerator.methods.createLottery('lottery').send({ from: accounts[0], gas: "2000000" });
        const lotteryAddress = await lotteryGenerator.methods.getLotteries().call();
        lottery = new web3.eth.Contract(JSON.parse(lotteryBuild.interface), lotteryAddress[0]);
    });

    it('contract deployed', () => {
        assert.ok(lottery.options.address);
    });

    it('has manager as creator', async () => {
        const manager = await lottery.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('lottery is not live', async () => {
        const status = await lottery.methods.isLotteryLive().call();
        status.should.be.false;
    });

    it('does not allow entry if lottery is not live', async () => {
        lottery.methods.participate("User1").send({
            from: accounts[0],
            gas: "1000000",
            value: web3.utils.toWei("0.01", 'ether')
        }).should.be.rejectedWith(Error);
    });

    it('Others can not activate the lottery', async () => {
        const maxEntries = 2, ethRequired = 1;
        await lottery.methods.activateLottery(maxEntries, ethRequired).send({
            from: accounts[1],
            gas: "1000000",
        }).should.be.rejectedWith(Error);
    });

    it('Manager can activate the lottery', async () => {
        const maxEntries = 2, ethRequired = 1;
        await lottery.methods.activateLottery(maxEntries, ethRequired).send({
            from: accounts[0],
            gas: "1000000",
        }).should.be.fulfilled;
    });
});

describe('Lottery Deployed and Live', async () => {
    const provider = ganache.provider();
    const web3 = new Web3(provider);
    let accounts;
    let lottery;
    before(async () => {
        accounts = await web3.eth.getAccounts();
        const lotteryGenerator = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode })
            .send({ from: accounts[0], gas: "2000000" });
        await lotteryGenerator.methods.createLottery('lottery').send({ from: accounts[0], gas: "2000000" });
        const lotteryAddress = await lotteryGenerator.methods.getLotteries().call();
        lottery = new web3.eth.Contract(JSON.parse(lotteryBuild.interface), lotteryAddress[0]);

        const maxEntries = 2, ethRequired = 1;
        await lottery.methods.activateLottery(maxEntries, ethRequired).send({
            from: accounts[0],
            gas: "1000000",
        })
    });

    it('lottery is live', async () => {
        const status = await lottery.methods.isLotteryLive().call();
        status.should.be.true;
    })

    it('allows to participate in lottery', async () => {
        await lottery.methods.participate("User1").send({
            from: accounts[1],
            gas: "1000000",
            value: web3.utils.toWei("1", "ether")
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[1]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    it('returns list of player addresses', async () => {
        const players = await lottery.methods.getPlayers().call();
        players.should.include(accounts[1]);
    })

    it('returns a player by given address', async () => {
        const player = await lottery.methods.getPlayer(accounts[1]).call();
        // Player name
        player[0].should.be.equal("User1");
        // Participation count
        player[1].should.be.equal('1');
    })

    it('requires exact amount of ether', async () => {
        lottery.methods.participate("User0").send({
            from: accounts[0],
            value: web3.utils.toWei("0.5", "ether"),
            gas: "1000000"
        }).should.be.rejectedWith(Error);
    });

    it('only manager can pick winner', async () => {
        lottery.methods.declareWinner().send({
            from: accounts[1],
            gas: "1000000"
        }).should.be.rejectedWith(Error);
    });
});

describe("Lottery win is declared, and lottery is set to deactivated state", () => {
    const provider = ganache.provider();
    const web3 = new Web3(provider);
    let accounts;
    let lottery;
    before(async () => {
        accounts = await web3.eth.getAccounts();
        const lotteryGenerator = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode })
            .send({ from: accounts[0], gas: "2000000" });
        await lotteryGenerator.methods.createLottery('lottery').send({ from: accounts[0], gas: "2000000" });
        const lotteryAddress = await lotteryGenerator.methods.getLotteries().call();
        lottery = new web3.eth.Contract(JSON.parse(lotteryBuild.interface), lotteryAddress[0]);

        const maxEntries = 2, ethRequired = 1;
        await lottery.methods.activateLottery(maxEntries, ethRequired).send({
            from: accounts[0],
            gas: "1000000",
        })

        // participate with only one account hence its the winner, and assert -
        //  balance after winning the lottery
        await lottery.methods.participate("User1").send({
            from: accounts[1],
            gas: "1000000",
            value: web3.utils.toWei("1", "ether")
        });

        await lottery.methods.declareWinner().send({
            from: accounts[0],
            gas: "1000000"
        });
    });

    it('Eth is sent to the winner', async () => {
        // initial balance of account 2 == account 1
        const initialBalance = await web3.eth.getBalance(accounts[2]);
        const newBalance = await web3.eth.getBalance(accounts[1]);

        const iniBlncEth = parseFloat(web3.utils.fromWei(initialBalance, "ether"));
        const newBlncEth = parseFloat(web3.utils.fromWei(newBalance, "ether"));

        iniBlncEth.should.be.almost(newBlncEth, 0.01);
    });

    it('Winner is stored', async () => {
        const winner = await lottery.methods.winner().call();
        winner.should.have.property("name", "User1");
        winner.should.have.property("entryCount", '1');
    })
})
