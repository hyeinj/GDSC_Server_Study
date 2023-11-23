// 모든 유저 조회
async function selectUser(connection) {
    const selectUserListQuery = `SELECT username, userID, email FROM User;`;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email){
    const selectUserEmailQuery = `SELECT username, userID, email FROM User where email = ? ;`;
    const [emailRows] = await connection.query(selectUserEmailQuery, email);
    return emailRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams){
    const inserUser = ``;
}

module.exports = {
    selectUser,
    selectUserEmail,
    insertUserInfo,
};