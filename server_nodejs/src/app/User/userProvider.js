const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

exports.retrieveUserList = async function(email){
    if(!email){
        const connection = await pool.getConnection(async (conn) => conn);
        const userListResult = await userDao.selectUser(connection);
        connection.release();

        return userListResult;
    } else{
        const connection = await pool.getConnection(async (conn) => conn);
        const userListResult = await userDao.selectUserEmail(connection, email);
        connection.release();

        return userListResult;
    }
};

exports.emailCheck = async function(email){
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return emailCheckResult;
};

exports.passwordCheck = async function(selectUserPasswordParams){
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
    connection.release();
    return passwordCheckResult[0];
};

exports.accountCheck = async function(email){
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, email);
    connection.release();

    return userAccountResult;
};

exports.searchMenuList = async function(name){
    if(!name){
        const connection = await pool.getConnection(async (conn) => conn);
        const menuListResult = await userDao.selectMenu(connection);
        connection.release();

        return menuListResult;
    } else{
        const connection = await pool.getConnection(async (conn) => conn);
        const menuListResult = await userDao.selectMenuByName(connection, name);
        connection.release();

        return menuListResult;
    }
};