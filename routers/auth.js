const { Router } = require("express");
const connection = require("../code/db_con.js").con;
const auth = require("../code/auth.js");
const bcrypt = require("bcryptjs");
const path = require("path");
const { sendEmail, check4Email } = require("../code/mailer.js");

// import { createRequire } from 'module';
//const require = createRequire(import.meta.url);
const router = Router();
const parentPathFor = path.resolve(__dirname, "..");
//const addLog = require('../code/logs').add
router.get("/", function (req, res, next) {
  res.sendFile(path.resolve(parentPathFor, "public", "signUpMod.html"));
});

router.post("/login", async (req, res, next) => {
  const { login, password } = req.body;
  await connection
    .query("SELECT * FROM users WHERE login = ?", [login])
    .then(([results]) => {
      if (results.length == 0) {
        throw new Error("check correctnes data");
      }
      return auth.getToken(results[0].password_hash, login, password);
    })
    .then((token) => {
      res.send(token);
      //addLog({ type: 'SUCCESSFUL_USER_LOGIN', description: 'Вдало ввiйшов користувач', req, json_args: { login: login } })
    })
    .catch((error) => {
      //addLog({ type: 'FAIL_USER_LOGIN', description: 'Невдала спроба входу користувача', req, json_args: { login: login } })
      if (typeof error == "object" && error.message) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    });
});

router.post("/register", async (req, res) => {
  const user = {
    name: req.body.userName || "USER",
    login: req.body.login,
    role: req.body.role || "USER",
    password_hash: bcrypt.hashSync(req.body.password, 10), // 10 - saltRounds
  };
  await connection
    .query("INSERT INTO users SET ?", user)
    .then((_) => {
      res.send("Seccesfull registration");
    })
    .catch((error) => {
      if (error.code == "ER_DUP_ENTRY") {
        res.status(400).send("rent login name");
      } else res.status(500).send(error.message);
    });
});

function randz(min = 100, max = 998) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let allconCode = [];
router.post("/conCode", async (req, res) => {
  check4Email(req.body.login)
    .then((login) => {
      let conCode = randz();
      let message = `
    Это сообщение сгенерировано попыткой смены пароля 
    для аккаунта на тестом сайте Шведа Кирила , 
    если ее осуществили не вы пожалуйста игнорируйте это сообщение
    ------------------------------------
    
    RESET PASSWORD CODE : ${conCode}
    `;
      sendEmail(login, message, res);
      allconCode.push({ login: req.body.login, conCode: conCode });
      res.send("reset password code sended on your email");
    })
    .catch((error) => {
      if (typeof error === "object" && "message" in error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    });

  // const user = {
  //     name:"User",
  //     login:req.body.login,
  //     role:"User",
  //     password_hash:bcrypt.hashSync(req.body.password, 10) // 10 - saltRounds
  // }
  // await connection.query("INSERT INTO users SET ?",user)
  // .then(_=>{
  //     res.send("Seccesfull registration")
  // })
  // .catch(error =>{
  //     if(error.code == "ER_DUP_ENTRY"){
  //         res.status(400).send("rent login name")
  //     }else res.status(500).send(error.message)
  // })
});

router.post("/reset", async (req, res) => {
  const { login, password } = req.body;
  let password_hash = bcrypt.hashSync(password, 10);
  let userConCode = req.body.conCode;

  let checkCode = allconCode.find(
    (el) => el.login == login && el.conCode == userConCode
  );
  if (checkCode == undefined) {
    res.status(404).send("Not valid login or code");

    return;
  } else {
    await connection
      .query("UPDATE users SET password_hash = ? where login = ?;", [
        password_hash,
        login,
      ])
      .then((_) => {
        res.send("Seccesfull reset");
      })
      .catch((error) => {
        if (error.code == "ER_DUP_ENTRY") {
          res.status(400).send("rent login name");
        } else res.status(500).send(error.message);
      });

    // const user = {
    //     name:"User",
    //     login:req.body.login,
    //     role:"User",
    //     password_hash:bcrypt.hashSync(req.body.password, 10) // 10 - saltRounds
    // }
    // await connection.query("INSERT INTO users SET ?",user)
    // .then(_=>{
    //     res.send("Seccesfull registration")
    // })
    // .catch(error =>{
    //     if(error.code == "ER_DUP_ENTRY"){
    //         res.status(400).send("rent login name")
    //     }else res.status(500).send(error.message)
    // })
  }
});

router.post("/check", (req, res) => {
  auth
    .auth(req)
    .then((u) => {
      res.json(u.login);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
module.exports = router;
