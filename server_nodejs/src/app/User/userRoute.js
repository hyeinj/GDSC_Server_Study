module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
     app.get('/app/test', user.getTest)

     // 1. 유저 조회 API (+검색)
     app.get('/app/users',  user.getUsers);

     // 2. 유저 생성 API
     app.post('/app/users', user.postUsers);

     // 3. 로그인 API
     app.post('/app/login', user.login);

};
