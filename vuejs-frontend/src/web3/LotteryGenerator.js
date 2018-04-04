import web3 from './web3';
import lotteryGeneratorJson from '../contract/LotteryGenerator.json' 
import config from '../config';

var lotteryGenerator;
if(web3){
    lotteryGenerator = new web3.eth.Contract(JSON.parse(lotteryGeneratorJson.interface), config.lotteryFactoryAddress);
}

export default lotteryGenerator