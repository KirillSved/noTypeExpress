
module.exports.wait = async function (onsuccess) {
    let db_online = false
    while (db_online == false) {
      try {
        const mysql = require('mysql2/promise')
        const connection = await mysql.createConnection({
          "host": process.env.DB_HOST,
          "port": process.env.DB_PORT,
          "user": process.env.DB_USER,
          "password": process.env.DB_PASS,
          "database": process.env.DB_DATABASE,
          "insecureAuth": true
        });
        const [rows, fields] = await connection.query('SELECT 1');
        if (rows && rows[0]) {
          db_online = true
        }
      } catch (ex) {
        console.log("NO DB CONNECTION / " + ex.message)
      }
      await sleep(5000)
    }
    onsuccess()
  }
  
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }