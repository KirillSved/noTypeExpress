'use strict'
const mysql = require('mysql2')
// let sql_config = {
//    host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DATABASE,
//   multipleStatements: true,
//   connectionLimit: 100,
// }
let sql_config = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Vfkbyrf98",
  database: "mysitedb",
  multipleStatements: true,
  connectionLimit: 100,
}
console.log(sql_config)
module.exports.con = mysql.createPool(sql_config).promise()