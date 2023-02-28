const { Router } = require ("express"); // Модель импорта модуля согласно стандарту питона, модуль експортируеться целиком как експерес
//const path = require("path")
const  path = require( "path");
const chalk = require( "chalk");
//const __dirname = path.resolve();
let dotenvp=path.join(__dirname,"./env")
require('dotenv').config({path: dotenvp})
const PORT = process.env.PORT ?? 3001  // || 3001  два варианта или, и с проверкой наличия в енв 
// чтобы передать в енв надо использовать export PORT = 3000, SET PORT = 3000
const router = Router();
const parentPathFor = path.resolve(__dirname,"..")

router.get("/",(req,res)=>{
 // res.send("<h1> Its test-express Server </h1>") ------->//TODO Проверить в req токен тут 

   let pathFor = path.resolve(parentPathFor,"public","index.html");
   console.log(chalk.green(pathFor));
    res.sendFile(pathFor)
})

router.get("/ask",(req,res)=>{
    let pathFor = path.resolve(parentPathFor,"public","ask.html");
    res.sendFile(pathFor,{active:"ask"});
})

router.get("/welcome",(req,res)=>{
    let pathFor = path.resolve(parentPathFor,"public","welcome.html");
   console.log(chalk.green(pathFor));
   res.sendFile(pathFor)
   //console.log(req.requestTime)
})

router.get("/download",(req,res)=>{
    let pathFor = path.resolve(parentPathFor,"public","img","diagram.png");
    console.log(`file had been download ::=>${pathFor}`)
    res.download(pathFor);
})

// router.get("/truly",(req,res)=>{
//     let pathFor = path.resolve(__dirname,"public","")
// })
// router 
let rand = 0;
router.post("/truly",(req,res)=>{
    let pathFor = path.resolve(parentPathFor,"public","js","bootstrap")
    console.log(pathFor);
    
    if (!(process.env.REGISTER_POSSIBILITY === 'true')) {
        res.status(500).send('Доступ для нової реєстрації закритий! №___'+rand++)
        return
      }
})

router.get("/checkSpinner",(req,res)=>{

    let pathFor = path.resolve(parentPathFor,"public","spinnerTpage.html");
    res.status(200).sendFile(pathFor);

});

module.exports = router
