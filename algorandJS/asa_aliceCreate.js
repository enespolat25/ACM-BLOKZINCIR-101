const algosdk = require('algosdk');

const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": "d0tj2DSVGb28ppQa1MQpi9k35hArrNPP5PNLzXdU" // fill in yours
};

var alice_mnemonic = "athlete muscle edge jelly under local shadow ordinary cigar foil sense bird proud april inspire cattle silk typical arrive reject young edit muscle about dance"; // fill in yours
var aliceAccount = algosdk.mnemonicToSecretKey(alice_mnemonic);

let client = new algosdk.Algodv2(token, server, port);

(async () => {
    let params = await client.getTransactionParams().do();
    let note = undefined; 
    let addr = aliceAccount.addr;
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1000000;
    let unitName = "TTACM";
    let assetName = "TT ACM";
    let assetURL = "https://www.youtube.com/watch?v=V2KOlu30U-w&list=PLH2Ca1J4pIrx4FKOgFqsmsfB_wH1m4kxf";
    let assetMetadataHash = "01234567890123456789012345678901";
    let manager = aliceAccount.addr;
    let reserve = aliceAccount.addr;
    let freeze = aliceAccount.addr;
    let clawback = aliceAccount.addr;
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(addr, note,
         totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
        clawback, unitName, assetName, assetURL, assetMetadataHash, params);
    let rawSignedTxn = txn.signTxn(aliceAccount.sk);
    let tx = (await client.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction : " + tx.txId);
})().catch(e => {
    console.log(e);
});

