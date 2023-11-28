const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const jwtMake = require("../../../config/jwtUtils");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service.js : Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function(username, userID, password, email){
    try{
        //이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if(emailRows.length > 0){
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        }

        //비밀번호 암호화
        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

        console.log(hashedPassword);

        const insertUserInfoParams = [username, userID, hashedPassword, email];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//로그인 인증 방법(JWT)
exports.postLogin = async function (email, password){
    try{
        //이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex")

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if(passwordRows[0].password !== hashedPassword){
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        //계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        // state == 1 : 활동중인 상태
        if(userInfoRows[0].status == 0){ // 정지상태
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if(userInfoRows[0].status == 2){ // 보류 상태
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        let uid = userInfoRows[0].uid;
        
        let token = jwtMake.makeAccessToken(uid);
        console.log("access token :" + token);

        let refreshToken = jwtMake.makeRefreshToken();
        console.log("refresh token : " + refreshToken);

        const updateRefreshTokenParams = [refreshToken, uid];

        const connection = await pool.getConnection(async (conn) => conn);

        const refreshTokenResult = await userDao.updateRefreshToken(connection, updateRefreshTokenParams);
        console.log(`refresh token 입력 : ${uid}`);
        connection.release();

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].uid, 'jwt-accessToken': token, 'jwt-refreshToken': refreshToken});

    } catch(err){
        logger.error(`App - postLogin Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};