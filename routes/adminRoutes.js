const Express = require('express')
const { addProduct, buyProduct } = require('../controller/adminController')


const adminRoute = Express.Router()

//adding product
adminRoute.post('/addproduct', addProduct)

//buy product or approve payment 
adminRoute.post('/approvepayment', buyProduct)


module.exports = adminRoute