import web3 from './web3';
import lotteryJson from '../contract/Lottery.json'

var lottery;
if (web3) {
    lottery = new web3.eth.Contract(JSON.parse(lotteryJson.interface));
}

export default lottery;
