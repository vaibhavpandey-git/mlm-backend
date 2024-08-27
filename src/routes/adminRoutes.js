const Express = require('express');
const { approveOrder, paidAcknowledgement, approveKyc } = require('../controller/admin/adminApproveController');
const { fetchUsers, approvedOrders, paymentRequests, withdrawals, viewSupport } = require('../controller/admin/adminFetchController');
const { addProduct, getProduct } = require('../controller/admin/adminProductController');
const { rejectKyc, rejectPayment, rejectWithdrawal } = require('../controller/admin/adminRejectController');
const { deleteUser } = require('../controller/admin/adminDeleteController');
const upload = require('../middlewares/upload');

const adminRoute = Express.Router()

//approve apis for admin
adminRoute.post('/approveorder', approveOrder);
adminRoute.post('/approvewithdrawal', paidAcknowledgement);
adminRoute.put('/approvekyc', approveKyc);


//fetch apis for admin
adminRoute.get('/users', fetchUsers);
adminRoute.get('/approvedorders', approvedOrders);
adminRoute.get('/paymentrequests', paymentRequests);
adminRoute.get('/withdrawals', withdrawals);
adminRoute.get('/queries', viewSupport);


//product apis for admin
adminRoute.post('/addproduct', upload.single('file'), addProduct);
adminRoute.get('/getproduct', getProduct);


//reject apis for admin
adminRoute.put('/rejectkyc', rejectKyc);
adminRoute.post('/rejectpayment',rejectPayment);
adminRoute.put('/rejectwithdrawal',rejectWithdrawal);


//user apis for admin
adminRoute.delete('/user', deleteUser);


module.exports = adminRoute