const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'gdsctest.cyjbxny3t4fl.ap-northeast-2.rds.amazonaws.com',
    user: 'hyeinj',
    port: '3306',
    password: 'hihl1004',
    database: 'gdsctest'
});

module.exports = {
    pool: pool
};