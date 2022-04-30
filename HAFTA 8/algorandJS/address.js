const algosdk= require('algosdk')

createadress=()=>{
	let account=algosdk.generateAccount();
	console.log("Account address :",account.addr)

	let mn = algosdk.secretKeyToMnemonic(account.sk);
	console.log("Account Mnemonic :",mn)
}

module.exports = createadress

// adress 1: D5WCE7RSD4DNNSEG2H4YC56ADUOJSNEAZAINSFYTCREC6OD5YAJM6D74EU

// adress 1 menemonic: "athlete muscle edge jelly under local shadow ordinary cigar foil sense bird proud april inspire cattle silk typical arrive reject young edit muscle about dance"

// adress 2 : WOU5WWF3TXHMFACYJ4G2YGE5RJQMFTHPML2FG7YWRENAZWAYOHHOPUUIVU
// address 2 mnemonic : "cook click garden estate nurse idle castle primary suggest coin draw hotel dismiss glide physical disagree ordinary output wrong motor happy improve size above link"
