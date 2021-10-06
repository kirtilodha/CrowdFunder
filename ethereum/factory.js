import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xa3f28a12f88429B46272601f44da9001F64a8060' //factory deployed
);
//0x702e75Ff9466a424730Fb13b6061F3859eF8c789
export default instance;