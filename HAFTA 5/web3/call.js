// solidity complier
 
solc = require("solc");
 
// file system - read and write files to your computer
fs = require("fs");
 
// ganache - local blockchain
 
// web3 interface
Web3 = require("web3");
 
// setup a http provider
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
 
// reading the file contents of the smart  contract
 
fileContent = fs.readFileSync("Add.sol").toString();
//console.log(fileContent);
 
// create an input structure for my solidity complier
var input = {
    language: "Solidity",
    sources: {
        "Add.sol": {
            content: fileContent,
        },
    },
 
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};
 
var output = JSON.parse(solc.compile(JSON.stringify(input)));
//console.log("Output: ", output);
 
ABI = output.contracts["Add.sol"]["Add"].abi;
bytecode = output.contracts["Add.sol"]["Add"].evm.bytecode.object;
//console.log("Bytecode: ", bytecode);
//console.log("ABI: ", ABI);
 
contract = new web3.eth.Contract(ABI);
var defaultAccount;
 
web3.eth.getAccounts().then((accounts) => {
    console.log("Accounts: ", accounts);
    defaultAccount = accounts[0];
    console.log("Default Account: ", defaultAccount);
    contract.deploy({ data: bytecode }).send({ from: defaultAccount, gas: 4000000 }).on("receipt", (receipt) => {
            console.log("Contract Address: ", receipt.contractAddress)
        })
        .then((addContract) => {
            addContract.methods.getSum().call((err, sum) => {
                console.log("Initial Sum: ", sum);
            });
            addContract.methods.Sum(2, 9).send({
                from: defaultAccount
            }, () => {
                addContract.methods.getSum().call((err, sum) => {
                    console.log("Final Sum: ", sum);
                });
            });
        });
});