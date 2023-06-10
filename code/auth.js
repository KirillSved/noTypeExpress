const jwt = require('jsonwebtoken')
const connection = require('./db_con').con
const bcrypt = require('bcryptjs')
// const add_user_log_post = require('../code/logs').add_user_log_post;

module.exports.getToken = function getToken(passhash, email, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passhash, function (err, res) {
      if (res) {
        let token = jwt.sign({ username: email },
          process.env.SITE_JSONWEBTOKENKEY, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // expires in 24 hours default        
        );
        resolve(token);
      } else reject("Логін і пароль не збігаються");
    })
  })
}
module.exports.getFaceToken = function getFaceToken(email) {
  return new Promise((resolve, reject) => {
   
     
        let token = jwt.sign({ username: email },
          process.env.SITE_JSONWEBTOKENKEY, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // expires in 24 hours default        
        );

        if(token){
          resolve(token);
        }
      reject("Логін і пароль не збігаються");
    })
 
}
module.exports.Vtry = function getToken(passhash, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passhash, function (err, res) {
      if (res) {
     
        resolve(true);
      } else resolve(false);
    })
  })
}
module.exports.auth = (req,roles) => {
  return new Promise((resolve, reject) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.authorization; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) { token = token.slice(7, token.length) }
    } else {
      reject('Не авторизований')
      return;
    }

    //is token good?
    jwt.verify(token, process.env.SITE_JSONWEBTOKENKEY, async (err, decodedToken) => {
      if (err) { reject(err); return }
      if (!decodedToken) { reject('Недійсний токен'); return }
      //need return user
      connection.query(`SELECT * FROM users where login = ?;`, [decodedToken.username])
        .then(results => {
          if (results.length === 0) { reject("Логін і пароль не збігаються"); return }
          let user = results[0]
          //add_user_log_post(req, user)
          if (roles && !roles.includes(user.role)) { reject('Bad role'); return }
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })     
    })
  })
}
