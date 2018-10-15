var webServer = require("../webServer/server/server").server
var user = require("./user")
var userServer = require("./userserver")
var log = console.log

// setTimeout(async ()=>{
//     console.log(await user.deleteArticle(20));
//     '/deleteArticle'
// },1000)

async function test() {
    //post.serchStr,false,post.start,post.end)
    // res= await userServer.function['/searchArticle'](0, 0, 0, 0, JSON.stringify({serchStr:"广",end:3}))
    // console.log(res)

}
test()


var tfa = require('2fa');
tfa.generateKey(31, function (err, key) {
    console.log(key);
    // crypto secure hex key with 32 characters
    // generate crypto-secure backups codes in a user-friendly pattern
    // tfa.generateBackupCodes(num, pattern (optional), cb)
    tfa.generateBackupCodes(8, 'xxxx-xxxx-xxxx', function (err, codes) {
        // [ '7818-b7b8-c928', '3526-dc04-d3f2', 'be3c-5d9f-cb68', ... ]
        console.log(codes);
        // these should be sent to the user, stored and checked when we get a 2fa code
    });

    // generate a google QR code so the user can save their new key
    // tfa.generateGoogleQR(name, accountname, secretkey, cb)
    tfa.generateGoogleQR('Company', 'email@gmail.com', key, function (err, qr) {
        // data URL png image for google authenticator
        console.log(qr);//图片 base64的

    });

    var opts = {
        beforeDrift: 2,
        afterDrift: 2,
        drift: 4,
        step: 30
    };

    var counter = Math.floor(Date.now() / 1000 / opts.step);
    var code = tfa.generateCode(key, counter);//用来登录的6位短码
    console.log(code);
});