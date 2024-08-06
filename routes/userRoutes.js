const Express = require('express')
const payment = require('../controller/userController')

const userRoute = Express.Router()

userRoute.post('/payment', payment)

module.exports = userRoute