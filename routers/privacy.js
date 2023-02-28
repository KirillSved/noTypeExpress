const  {Router} = require("express");
const connection = require("../code/db_con.js").con;
const  auth =  require("../code/auth.js")
const  bcrypt =  require("bcryptjs")
const path =require("path")

const router = Router();
const parentPathFor = path.resolve(__dirname,"..")
router.get("/", function (req,res,next){
    res.sendFile(path.resolve(parentPathFor,"public","privacy.html"))
 })

 

 module.exports=router