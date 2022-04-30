const algosdk = require('algosdk');

const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": ""
};

var bob_mnemonic = ""; // fill in yours

var bobAccount = algosdk.mnemonicToSecretKey(bob_mnemonic);
var aliceAddress = ''; // change to yours

let client = new algosdk.Algodv2(token, server, port);

(async () => {
    let assetID = ; // change to your own assetID
    let params = await client.getTransactionParams().do();
    let sender = bobAccount.addr;
    let recipient = aliceAddress;
    let revocationTarget = undefined;
    let closeRemainderTo = aliceAddress;
    let note = undefined;
    let amount = 0;
    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
        amount,  note, assetID, params);
    let rawSignedTxn = txn.signTxn(bobAccount.sk)
    let tx = (await client.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction : " + tx.txId);
})().catch(e => {
    console.log(e);
});

