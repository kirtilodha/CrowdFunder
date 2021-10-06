const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "inflict gown witness history will flock season plunge sea elephant attitude library",
  "https://rinkeby.infura.io/v3/a50273c548074e82b4b1e77976f16a5f"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying contract from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode})
    .send({ gas: "1000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
};

deploy();