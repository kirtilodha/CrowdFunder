const path = require('path');
const solc= require('solc');
const fs= require('fs-extra');

//delete build
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); 
//reading solidity file
const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
//compiling
const output= solc.compile(source,1).contracts;
//output contains both contracts

//create build folder
fs.ensureDirSync(buildPath);
//iterate over keys
for(let contract in output){
    fs.outputJsonSync( //where to write, what to write
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    );
}
