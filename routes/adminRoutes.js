const Express = require('express')
const { addProduct } = require('../controller/adminController')
const approveOrder = require('../controller/buyProductController')


const adminRoute = Express.Router()
 
//adding product
adminRoute.post('/addproduct', addProduct)

//buy product or approve payment 
adminRoute.post('/buyproduct', approveOrder)


module.exports = adminRoute