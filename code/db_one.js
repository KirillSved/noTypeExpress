'use strict';
const mysql = require('mysql');

let sql_config = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "Vfkbyrf98",
    database: "mysitedb",
    multipleStatements: true,
    connectionLimit: 100,
}

const connection = mysql.createPool(sql_config);
connection.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) {
        connection.release();
        console.log('Database is connected ... nn')
    }
    return
})
module.exports.con = connection