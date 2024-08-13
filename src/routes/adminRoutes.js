const Express = require('express')
const approveOrder = require('../controller/buyProductController');
const { addProduct } = require('../controller/admin/productController');
const { paidAcknowledgement, withdrawalRequests, completedWithdrawal } = require('../controller/admin/withdrawalController');
const { paymentRequests } = require('../controller/admin/paymentController');



const adminRoute = Express.Router()
 
adminRoute.post('/addproduct', addProduct);
adminRoute.post('/buyproduct', approveOrder);
adminRoute.post('/paidAcknowledgement', paidAcknowledgement);

//Product Buy Payment 
adminRoute.get('/paymentrequests', paymentRequests);


//Balance Withdrawal routes
adminRoute.get('/withdrawalrequests', withdrawalRequests);
adminRoute.get('/completedwithdrawal',completedWithdrawal)

module.exports = adminRoute