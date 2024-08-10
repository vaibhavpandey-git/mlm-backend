const Express = require('express')
const {payment, withdrawalRequest } = require('../controller/userController')

const userRoute = Express.Router()

userRoute.post('/payment', payment)
userRoute.post('/withdrawalrequest', withdrawalRequest)

module.exports = userRoute