const { Router } = require("express");
const connection = require("../code/db_con.js").con;
const bcrypt = require("bcryptjs");
const path = require("path");
const router = Router();
const auth = require("../code/auth.js");
const parentPathFor = path.resolve(__dirname, "..");
const fs =  require("fs")
let fileHolderPath = "C:/Users/user/Pictures/TBD_SHVED/Data/"
router.get("/",(req,res)=>{

    let pathFor = path.resolve(parentPathFor,"public","FileEditor.html");
    res.status(200).sendFile(pathFor);

});

router.get("/getFiles", async (req, res, next) => {
    // const { login, password } = req.body;
    const [{role,login}]= await auth.auth(req)
    let permission = ''
    if (role === 'USER') permission = 'USER'
    else if (role === 'OPERATOR') permission = ['USER', 'OPERATOR']
    else if (role === 'admin') permission = ['USER', 'OPERATOR', 'ADMIN']
    await connection
    .query("SELECT `id`,`file_path`,`order` FROM fileorder where `order` in (?)", [permission])
    .then(([results]) => {
      if (results.length == 0) {
        throw new Error("check correctnes data");
      }
      let dataCon = [];
      results.forEach(el => {
        console.log(el)
       
      });
      res.send(results)
    //   fs.readdir(fileHolderPath,(err,files)=>{
    //     console.log(files)
    //     files.forEach
    //   });
    //   res.send(results)
    })
    
})



router.get("/getFile/:id", async (req, res, next) => {
    // const { login, password } = req.body;
    const [{role,login}]= await auth.auth(req)
    await connection
    .query("SELECT `file_path` FROM fileorder where `id`  = ? and `order` = ?", [req.params.id,role])
    .then(([results]) => {
      if (results.length == 0) {
        res.status(500).send('check correctnes data');
        throw new Error("check correctnes data");
        
      }
      let dataCon = [];
      
      let el = results[0];
      const extension = path.extname(el.file_path).toLowerCase();
        let file = fs.readFileSync(el.file_path)
        console.log(file)
        let contentType = 'application/octet-stream';
        if (extension === '.txt') {
          contentType = 'text/plain';
        } else if (extension === '.jpg') {
          contentType = 'image/jpg';
        }

        res.set('Content-Type', contentType);
        // Image size here
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(file);
   
})
})
    // await connection
    //   .query("SELECT * FROM users WHERE login = ?", [login])
    //   .then(([results]) => {
    //     if (results.length == 0) {
    //       throw new Error("check correctnes data");
    //     }
    //     return auth.getToken(results[0].password_hash, login, password);
    //   })
    //   .then((token) => {
    //     res.send(token);
    //     //addLog({ type: 'SUCCESSFUL_USER_LOGIN', description: 'Вдало ввiйшов користувач', req, json_args: { login: login } })
    //   })
    //   .catch((error) => {
    //     //addLog({ type: 'FAIL_USER_LOGIN', description: 'Невдала спроба входу користувача', req, json_args: { login: login } })
    //     if (typeof error == "object" && error.message) {
    //       res.status(500).send(error.message);
    //     } else {
    //       res.status(500).send(error);
    //     }
    //   });
 
module.exports = router