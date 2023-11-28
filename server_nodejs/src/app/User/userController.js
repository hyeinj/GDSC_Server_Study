const jwtMiddleware = require("../../../config/jwtUtils");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
 exports.getTest = async function (req, res) {
     return res.send(response(baseResponse.SUCCESS))
 };

 /**
 * API No. 1
 * API Name : 유저 조회 API (+검색)
 * [GET] /app/users
 */
exports.getUsers = async function(req, res){
    // Query String: email

    const email = req.query.email;

    if(!email){
        //유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else{
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

 /**
 * API No. 2
 * API Name : 유저 생성 API
 * [POST] /app/users
 */
exports.postUsers = async function(req, res){
    // Body : username, userID, password, email
    const {username, userID, password, email} = req.body;

    // 빈 값 체크
    if(!email){
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    }
    // 길이 체크
    if(email.length > 30){
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    }
    // 형식 체크(by 정규표현식)
    if(!regexEmail.test(email)){
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    }

    const signUpResponse = await userService.createUser(
        username,
        userID,
        password,
        email
    );

    return res.send(signUpResponse);

};

 /**
 * API No. 3
 * API Name : 로그인 API
 * [POST] /app/login
 */

 exports.login = async function(req, res) {
    const {email, password} = req.body;

    //email, password 형식적 Validation
    const loginResponse = await userService.postLogin(email, password);

    return res.send(loginResponse);
 };