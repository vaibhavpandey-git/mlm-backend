const Express = require('express');
const {payment, withdrawalRequest, updateUserDetails, userDetails } = require('../controller/userController');
const upload = require('../middlewares/upload');
const userFileUpload = require('../controller/user/userUploadController');

const userRoute = Express.Router();

userRoute.post('/payment', payment);
userRoute.post('/withdrawalrequest', withdrawalRequest);
userRoute.post('/update/userdetails', updateUserDetails);
userRoute.get('/userdetails', userDetails);

userRoute.post('/upload', upload.single('file'), userFileUpload);

module.exports = userRoute