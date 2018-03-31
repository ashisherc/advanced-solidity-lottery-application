const fs = require('fs-extra');
const solc = require('solc');

const source = fs.readFileSync('./contracts/Lottery.sol').toString();
const ouput = solc.compile(source, 1).contracts;

fs.removeSync('./build');

fs.ensureDirSync('./build');

for (let contract in ouput){
    fs.outputJsonSync(
        './build/' + contract.replace(':', '') + '.json',
        ouput[contract] 
    );
}
