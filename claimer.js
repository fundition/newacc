require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const sql = require('mssql')
var dsteemhf = require('dsteem-hf20');
var dsteem = require('dsteem');
app.listen(port, () => console.log(`Listening on ${port}`));

var clienthf = new dsteemhf.Client('https://api.steemit.com');
var client = new dsteem.Client('https://api.steemit.com');

function claim_account(creator, active_key)
{
    return new Promise(resolve => {
        const wif = dsteem.PrivateKey.fromString(active_key);

    const fee = dsteem.Asset.from(0, 'STEEM');

    const op = [
        'claim_account',
        {
            creator: creator,
            extensions: [],
            fee: fee
        }];

    client.broadcast.sendOperations([op], wif).then(function (result) {
        console.log('Included in block: ' + result.block_num)
        resolve("=");
    }, function (error) {
        if (error.message.indexOf("Please wait to transact, or power up STEEM.") === -1)
            console.error(error);
        resolve("-");
    });
});
}



async function main()
{

    let rc = await clienthf.rc.getRCMana("fundition");

    console.log("fundition rc  : " + rc.percentage);

    if (rc.percentage >= 9000)
        await claim_account("fundition", process.env.FUNDITION_KEY)
}

function run() {
    main();
    setInterval(main, 600000);
};

console.log("Running...");
run();





