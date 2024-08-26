const Express = require('express');
const { userWithdrawals, userDetails } = require('../controller/user/userFetchController');
const { payment, withdrawalRequest } = require('../controller/user/userRequestController');
const upload = require('../middlewares/upload');
const { userFileUpload } = require('../controller/user/userUploadController');

const userRoute = Express.Router();


//user fetch apis
userRoute.post('/withdrawals', userWithdrawals);
userRoute.get('/userdetails', userDetails);


//user request apis
userRoute.post('/payment', upload.single('file'), payment);
userRoute.post('/withdrawalrequest', withdrawalRequest);


//user file upload apis
userRoute.post('/upload', upload.single('file'), userFileUpload);



module.exports = userRoute