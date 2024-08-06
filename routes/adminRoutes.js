const Express = require('express')
const { addProduct, buyProduct, commissionDistribution, cycleCkeck } = require('../controller/adminController')


const adminRoute = Express.Router()
 
//adding product
adminRoute.post('/addproduct', addProduct)

//buy product or approve payment 
adminRoute.post('/approvepayment', buyProduct) // to be called

// automatic redirected
adminRoute.post('/commissiondistribution', commissionDistribution) 
adminRoute.post('/checkCycle', cycleCkeck)


module.exports = adminRoute