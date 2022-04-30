const algosdk=require('algosdk');

const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": "" // fill in yours
};
//asset-id= 76230366
var aliceAddress = ''; // change to yours
//alice mnemonic:""
var bobAddress = ''; // change to yours
//bob mnemonic=""

let client=new algosdk.Algodv2(token, server, port);

( async() => {

    let alice_account_info = (await client.accountInformation(aliceAddress).do());
    console.log("Asset of Alice: ");
    console.log(alice_account_info.assets);

    let bob_account_info = (await client.accountInformation(bobAddress).do());
    console.log("Asset of Bob: ");
    console.log(bob_account_info.assets);

})().catch(e => {
	console.log(e);
})
