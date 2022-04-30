const algosdk = require('algosdk');

const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": "" // fill in yours
};

var alice_mnemonic = ""; // fill in yours
var aliceAccount = algosdk.mnemonicToSecretKey(alice_mnemonic);
var bobAddress = ''; // change to yours

let client = new algosdk.Algodv2(token, server, port);

(async () => {
    let assetID = ; // change to your own assetID
    let params = await client.getTransactionParams().do();
    let sender = aliceAccount.addr;
    let recipient = bobAddress;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let note = undefined;
    let amount = 200000;
    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
        amount, note, assetID, params);
    let rawSignedTxn = txn.signTxn(aliceAccount.sk)
    let tx = (await client.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction : " + tx.txId);
})().catch(e => {
    console.log(e);
});
