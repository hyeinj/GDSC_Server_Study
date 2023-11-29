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
    // Body : username, password, email
    const {username, password, email} = req.body;

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

 /**
 * API No. 4
 * API Name : 메뉴 조회 API
 * [GET] /app/menu
 */
 exports.getMenu = async function(req, res){
    // Query String: name
    const name = req.query.name;

    if(!name){
        // 메뉴 전체 조회
        const menuListResult = await userProvider.searchMenuList();
        return res.send(response(baseResponse.SUCCESS, menuListResult));
    } else{
        // 메뉴 검색 조회
        const menuResultByName = await userProvider.searchMenuList(name);
        return res.send(response(baseResponse.SUCCESS, menuResultByName));
    }
 };

 /**
 * API No. 5
 * API Name : 메뉴 추가 API
 * [POST] /app/menu
 */
exports.postMenu = async function(req, res){
    // Body : name, price
    const {name, price} = req.body;

    // 빈 값 체크
    if(!name){
        return res.send(response(baseResponse.MENU_NAME_EMPTY));
    }
    if(!price){
        return res.send(response(baseResponse.MENU_PRICE_EMPTY));
    }

    const menuRegisterResponse = await userService.registerMenu(
        name,
        price
    );

    return res.send(menuRegisterResponse);
};