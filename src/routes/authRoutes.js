const Express = require('express')
const { adminLogin, userLogin } = require('../controller/authController')
const authRoute = Express.Router()

authRoute.post('/admin/login',adminLogin)
authRoute.post('/user/login',userLogin)

module.exports = authRoute