const fs = require('fs')
let filename = './JWT.txt'
if (!process.env.SITE_JSONWEBTOKENKEY) {
    if (!fs.existsSync(filename)) {
        process.env.SITE_JSONWEBTOKENKEY = make_rand_str()
        fs.writeFileSync(filename, process.env.SITE_JSONWEBTOKENKEY)
    } else {
        process.env.SITE_JSONWEBTOKENKEY = fs.readFileSync(filename)
    }
}

function make_rand_str() {
    let length = Math.floor(Math.random() * Math.floor(15)) + 25 //25-40 длина
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}