const assert= require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3= new Web3(ganache.provider());

const compiledFactory= require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();
    //factory is the layer to talk between JS and solidity
    //new version of contract
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) //new instance
        .deploy({ data: compiledFactory.bytecode}) //deployed the bytecode
        .send({ from: accounts[0], gas:'1000000'}); //who is sending
    await factory.methods.createCampaign('100').send({ //create campaign
        from: accounts[0],
        gas: '1000000'
    });
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    //access the contract
    //already deployed and you have the address 
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});

describe('Campaigns', ()=>{
    it('deploys a factory and campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('manager approved',async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    it('contribute guys',async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it('requires a minimum contri', async()=>{
        try{
            await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });
            assert(false);
        } catch(err){
            assert(err);
        }
    });
    it('manager can request only', async()=>{
        await campaign.methods.createRequest(
            'Buy batteries',
            '100', accounts[1]).send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });
     it('processes request', async()=>{
         await campaign.methods.contribute().send({
             from: accounts[0],
             value: web3.utils.toWei('10', 'ether')
         });
         await campaign.methods.createRequest(
             'Chocolates',web3.utils.toWei('5','ether'), accounts[1])
             .send({
                 from: accounts[0], gas: '1000000'
             });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], gas: '1000000'
        });
        let balance= await web3.eth.getBalance(accounts[1]); //returns a string
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        assert(balance > 103)
     });
});