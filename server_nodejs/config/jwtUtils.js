const jwt = require('jsonwebtoken');
const secret_config = require('./secret');
const { response } = require("./response")
const { errResponse } = require("./response")
const baseResponse = require("./baseResponseStatus");


const jwtMiddleware = (req, res, next) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token;
    // token does not exist
    if(!token) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY))
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE))
    };
    // process the promise
    p.then((verifiedToken)=>{
        //비밀 번호 바뀌었을 때 검증 부분 추가 할 곳
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

const makeAccessToken = (Object) => {
    let token = jwt.sign(
        {
            userId: Object,
        }, //토큰의 내용(payload)
        secret_config.jwtsecret, //비밀키
        {
            expiresIn: "2m",
            subject: "userInfo",
        } // 유효 기간 2분
    );
    return token;
};

const makeRefreshToken = () => {
    let token = jwt.sign(
        {},
        secret_config.jwtsecret,//비밀키
        {
            expiresIn: "10d",
            subject: "userInfo"
        } // 유효 기간 10일
    );
    return token;
};

module.exports = {
    jwtMiddleware,
    makeAccessToken,
    makeRefreshToken
};