 const  express = require( "express"); // Модель импорта модуля согласно стандарту питона, модуль експортируеться целиком как експерес
// //const path = require("path")
 const  path = require( "path");
 const  {requestTime,logger} = require( "./public/middleware.js")
 const dotenv = require("dotenv")
 const cookiePsrser = require("cookie-parser")
 var https = require("https")
 const fs = require("fs")
 dotenv.config();
require("./code/jwt_env")
// import chalk from "chalk";
 //const __dirname = path.resolve();
// let dotenvp=path.join(__dirname,"./env")
// //require('dotenv').config({path: dotenvp})
// const PORT = process.env.PORT ?? 3001  // || 3001  два варианта или, и с проверкой наличия в енв 
// // чтобы передать в енв надо использовать export PORT = 3000, SET PORT = 3000
// const app = express();
const app = express("express")
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())
const router =  require( "./routers/router.js");
const PORT = process.env.PORT ?? 3003
app.use(cookiePsrser())
app.use(express.urlencoded({ extended: true }));
app.use(router); // инициализирую подключeние обработчика  запросов todos методом инциализации новых middleware(?)
//bodyParser.urlencoded({extended:true})
app.use("/login", require("./routers/auth.js"))
app.use("/fileEdit", require("./routers/fileEdit.js"))
app.use("/privacy", require("./routers/privacy.js"))
app.use(requestTime,logger)
// app.use(function (req, res, next) {
//     next(createError(404))
//   })
  
// const server = http.createServer(app)
// require('./code/db_wait').wait(() => {
//   server.listen(process.env.SITE_PORT || 80)
// })

app.use(express.static(path.resolve(__dirname,"public")));

app.listen(PORT,()=>{
console.info(`Server has been started ON port::${PORT}...`)
}) 
var options = {
    key: fs.readFileSync('ssl\\192-168.0.5-privateKey.key', 'utf8'),
    cert: fs.readFileSync('ssl\\192-168.0.5.crt', 'utf8'),
  };
  // https
  https.createServer(options, app).listen(80);