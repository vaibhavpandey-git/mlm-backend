const Express = require('express')
const approveOrder = require('../controller/buyProductController');
const { addProduct } = require('../controller/admin/productController');
const { paidAcknowledgement, withdrawalRequests, completedWithdrawal } = require('../controller/admin/withdrawalController');
const { paymentRequests } = require('../controller/admin/paymentController');
const { deleteUser } = require('../controller/admin/deleteController');
const { fetchActiveUsers } = require('../controller/admin/userController');



const adminRoute = Express.Router()
 
adminRoute.post('/addproduct', addProduct);
adminRoute.post('/buyproduct', approveOrder);
adminRoute.post('/paidAcknowledgement', paidAcknowledgement);

//Product Buy Payment 
adminRoute.get('/paymentrequests', paymentRequests);


//Balance Withdrawal routes
adminRoute.get('/withdrawalrequests', withdrawalRequests);
adminRoute.get('/completedwithdrawal',completedWithdrawal);

//user Delete
adminRoute.delete('/userdelete', deleteUser);

//fetch users
adminRoute.get('/activeusers', fetchActiveUsers);

module.exports = adminRoute