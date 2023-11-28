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
    const insertUserInfoQuery = `INSERT INTO User(username, userID, password, email) 
    VALUES (?, ?, ?, ?);`;
    const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
    return insertUserInfoRow;
}

//password 체크
async function selectUserPassword(connection,selectUserPasswordParams) {
    const selectUserPasswordQuery = `SELECT username, email, password FROM User WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );
    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다)
async function selectUserAccount(connection, email){
    const selectUserAccountQuery = `SELECT uid FROM User WHERE email = ?;`;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, email);
    return selectUserAccountRow[0];
}

//refresh token DB 저장
async function updateRefreshToken(connection, updateRefreshTokenParams) {
    const updateRefreshTokenQuery = `UPDATE User Set token = ? WHERE uid = ?;`;
    const udpateRefreshTokenRow = await connection.query(updateRefreshTokenQuery, updateRefreshTokenParams);
    return udpateRefreshTokenRow;
}

module.exports = {
    selectUser,
    selectUserEmail,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    updateRefreshToken
};