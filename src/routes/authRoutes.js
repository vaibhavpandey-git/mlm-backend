const Express = require('express')
const { adminLogin, userRegister, generateOtp } = require('../controller/authController')
const authRoute = Express.Router()

authRoute.post('/admin/login',adminLogin)
// authRoute.post('/user/login',userLogin)
authRoute.post('/user/userregister', userRegister);
//generate otp
authRoute.post('/user/generateotp', generateOtp);

module.exports = authRoute