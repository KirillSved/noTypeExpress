const  moment = require("moment");
const colors = require("colors");


module.exports.requestTime = function requestTime(req,res,next){
req.requestTime=moment(new Date()).format('HH:mm:ss')
next();
}

module.exports.logger = function logger(req,res,next){
console.log(colors.green(`requestTime : ${req.requestTime}`));
next();
}