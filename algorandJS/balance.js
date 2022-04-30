const algosdk = require('algosdk');

checkbalance = () =>{

    const port='';
    const token={
        'x-api-key': process.env.API // fill in yours
    };

    
    const Testserver="https://testnet-algorand.api.purestake.io/ps2"; 
    let client=new algosdk.Algodv2(token,Testserver,port);



    let account = 'D5WCE7RSD4DNNSEG2H4YC56ADUOJSNEAZAINSFYTCREC6OD5YAJM6D74EU';

    ( async() => {
        let account_info = (await client.accountInformation(account).do());
        console.log("Balance of account "+account+": " + JSON.stringify(account_info.amount));
    })().catch(e => {
        console.log(e);
    })
}


module.exports = checkbalance