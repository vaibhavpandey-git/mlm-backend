const Express = require('express')
const { addProduct, paidAcknowledgement } = require('../controller/adminController')
const approveOrder = require('../controller/buyProductController')


const adminRoute = Express.Router()
 
adminRoute.post('/addproduct', addProduct);
adminRoute.post('/buyproduct', approveOrder);
adminRoute.post('/paidAcknowledgement', paidAcknowledgement);


module.exports = adminRoute