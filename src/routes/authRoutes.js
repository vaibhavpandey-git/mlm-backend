const Express = require('express');
const { userRegister, generateOtp } = require('../controller/auth/authController');
const authRoute = Express.Router();


authRoute.post('/registration', userRegister);
//generate otp
authRoute.post('/user/generateotp', generateOtp);

module.exports = authRoute