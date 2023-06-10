const { Router } = require("express");
const connection = require("../code/db_con.js").con;
const auth = require("../code/auth.js");
const bcrypt = require("bcryptjs");
const path = require("path");
const { sendEmail, check4Email } = require("../code/mailer.js");

const loginAttempts = {}; // Хранение информации о попытках входа
const MAX_LOGIN_ATTEMPTS = 5; // Максимальное количество попыток входа
const LOCK_TIME = 2 * 60 * 1000; // Время блокировки аккаунта после превышения попыток входа (в данном случае 2 минут)


async function blockUser(id_user) {
  return new Promise(async(resolve, reject) => {
     await connection.query('UPDATE `users` SET `locked` = 1 WHERE `id_user` =?',[id_user] )
     .then(([results]) => {
    
      if (results.affectedRows === 0) {
        console.log('User not found');
        reject('User not found');
        return;
      }
      resolve('You had been blocked, use to many attemt');
    }).catch((err)=>{
      console.log(err);
      reject(err);
      return;
    });
  });
}
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
      if(results[0].password_end)
      if (new Date (results[0].password_end.split('.').reverse().join('-')) < new Date()) {throw new Error("Password has expired,reset password");  }
      if (results[0].locked) {
        throw new Error("User has been locked");
        
      }
      if (loginAttempts[login] && loginAttempts[login].count >= MAX_LOGIN_ATTEMPTS) {
        const now = Date.now();
        if (loginAttempts[login].time + LOCK_TIME > now) {
         return blockUser(results[0].id_user)
          .then((data)=>{
            check4Email(req.body.login)
            .then((login) => {
              let conCode = randz();
              let message = `
            Это сообщение сгенерировано из-за превышения лимита попыток ввода пароля 
            для аккаунта на тестовомм сайте Шведа Кирила , 
            если ее осуществили не вы пожалуйста игнорируйте это сообщение
            ------------------------------------
            Воможно ваш аккаунт был атакован , для защиты ваших данных нам пришлось заблокировать акаунт 
            для востановления  доступа требуеться сменить пароль с помощью елементов управления на странице авторизации 
         
            `;
              sendEmail(login.login, message, res);
   
           
            })
            .catch((error) => {
              if (typeof error === "object" && "message" in error) {
                return new Error(error.message);
              } else {
                return new Error(error);
              }
            });
            delete loginAttempts[login];
            throw new Error(`Too many login attempts. Please try reset password tour.\n 
            reset password code sended on your email`);
          })
        
        } else {
          // Сброс информации о попытках входа после блокировки
          delete loginAttempts[login];
        }
      }
      if (auth.Vtry( results[0].password_hash,password)!=true) {
        // Увеличение счетчика неудачных попыток входа
        if (!loginAttempts[login]) {
          loginAttempts[login] = {
            count: 1,
            time: Date.now()
          };
        } else {
          loginAttempts[login].count++;
        }
        
        // throw new Error("Invalid password.");
      }
      return auth.getToken(results[0].password_hash, login, password);
    })
    .then((token) => {
      
      delete loginAttempts[login];
      
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

router.post("/loginFaceId", async (req, res, next) => {
  
  const { face_id } = req.body;
  await connection
    .query("SELECT * FROM users WHERE face_id = ?", [face_id])
    .then(([results]) => {
      if (results.length == 0) {
        throw new Error("check correctnes data");
      }
      return auth.getFaceToken(results[0].login);
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
router.post("/createFaceId", async (req, res) => {
  const face_id =req.body.faceID
  const [{ id_user }] = await auth.auth(req);
  await connection
    .query("UPDATE users SET face_id =  ? where id_user = ?", [face_id,id_user])
    .then((_) => {
      res.send("Seccesfull registration");
    })
    .catch((error) => {
      if (error.code == "ER_DUP_ENTRY") {
        res.status(400).send("rent login name");
      } else res.status(500).send(error.message);
    });
});
router.post("/register", async (req, res) => {
  const user = {
    face_id:req.body.face_id||"0",
    name: req.body.userName || "USER",
    login: req.body.login,
    role: req.body.role || "USER",
    password_hash: bcrypt.hashSync(req.body.password, 10), // 10 - saltRounds
    password_end: req.body.password_end || new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString().split('.').reverse().join('-')
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
    .then((user) => {
      let conCode = randz();
      let message = `
    Это сообщение сгенерировано попыткой смены пароля 
    для аккаунта на тестом сайте Шведа Кирила , 
    если ее осуществили не вы пожалуйста игнорируйте это сообщение
    ------------------------------------
    
    RESET PASSWORD CODE : ${conCode}
    `;
      sendEmail(user.login, message, res);
      allconCode.push({ login: user.login, conCode: conCode });
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


async function getLastPassword(user_id) {
  return await connection.query('SELECT * FROM bad_pass WHERE id_user = ?', [user_id])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);
      // reject(err)
      return;
    });
}
async function getUserByLogin(login) {
  return await connection
    .query("Select id_user, name, password_hash, role from users where login = ?", [login])
    .then(([results]) => {
      return results;
    })
    .catch((err) => {
      console.log(err);
      // reject(err)
      return;
    });
}
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
    let user = await getUserByLogin(login)
    const LastPassword = await getLastPassword(user[0].id_user)
    if (LastPassword){
        if (LastPassword.find((file) => bcrypt.compareSync(req.body.password, user[0].password_hash))) {
        res.status(500).send('Password was already used' );
        return;}
      await connection
      .query("UPDATE users SET password_hash = ?,locked = 0 where login = ?;", [
        password_hash,
        login,
      ])
      .then((_) => {
        delete loginAttempts[login];
        res.send("Seccesfull reset");
      })
      .catch((error) => {
        if (error.code == "ER_DUP_ENTRY") {
          res.status(400).send("rent login name");
        } else res.status(500).send(error.message);
      });
    } 
    

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
