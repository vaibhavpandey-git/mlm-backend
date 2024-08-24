const Express = require('express');
const { userRegister, generateOtp, login, resetPassword } = require('../controller/auth/authController');
const authRoute = Express.Router();

authRoute.post('/login', login);
authRoute.post('/registration', userRegister);
authRoute.post('/resetpassword', resetPassword);
authRoute.post('/generateotp', generateOtp);

module.exports = authRoute