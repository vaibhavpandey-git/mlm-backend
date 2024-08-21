const Express = require('express')
const { addProduct } = require('../controller/admin/productController');
const { paidAcknowledgement, withdrawalRequests } = require('../controller/admin/withdrawalController');
const { deleteUser, deleteKyc } = require('../controller/admin/deleteController');
const fetchUsers = require('../controller/admin/adminController');
const { approveOrder, paymentRequests, approvedOrders } = require('../controller/admin/orderController');


const adminRoute = Express.Router()

adminRoute.post('/addproduct', addProduct);
adminRoute.post('/buyproduct', approveOrder);
adminRoute.post('/paidAcknowledgement', paidAcknowledgement);

//Product Buy Payment 
adminRoute.get('/paymentrequests', paymentRequests);
adminRoute.get('/approvedorders', approvedOrders);


//Balance Withdrawal routes
adminRoute.get('/withdrawalrequests', withdrawalRequests);

//user Delete
adminRoute.delete('/user', deleteUser);
adminRoute.delete('/user/kyc', deleteKyc);

//fetch users (all, one, active & inactive)
adminRoute.get('/users', fetchUsers);

module.exports = adminRoute