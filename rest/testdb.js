// 'use strict'
// const mysql = require('mysql2')

// let sql_config = {
//   host: "127.0.0.1",
//   port: 3306,
//   user: "root",
//   password: "Vfkbyrf98",
//   database: "mysitedb",
//   multipleStatements: true,
//   connectionLimit: 100,
// }
// console.log(sql_config)
// const con = mysql.createPool(sql_config).promise()

const con  = require("../code/db_con.js").con

async function testAsyncQuery(user){

    await con.query("INSERT INTO users SET ?",user)
   .then(_=>{
       console.log("Seccesfull registration")
   })
   .catch(error =>{
       if(error.code == "ER_DUP_ENTRY"){
        console.log("rent login name")
       }else console.log(error.message)
   })
}
const changeOne = (el, query) =>
  new Promise((resolve, reject) => {
    con.query(query, el, function (err, results, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  const user = {
    name:"User",
    login:"some",
    role:"User",
    password_hash:"some" // 10 - saltRounds
}

testAsyncQuery(user)

//changeOne(user,"INSERT INTO users SET ?")

