const fs = require('fs');
const solc = require('solc');

const source = fs.readFileSync('./contracts/Lottery.sol').toString();

module.exports = solc.compile(source, 1).contracts[':Lottery'];