const Express = require('express');
const {payment, withdrawalRequest, updateUserDetails, userDetails } = require('../controller/userController');
const upload = require('../middlewares/upload');

const userRoute = Express.Router();

userRoute.post('/payment', payment);
userRoute.post('/withdrawalrequest', withdrawalRequest);
userRoute.post('/update/userdetails', updateUserDetails);
userRoute.get('/userdetails', userDetails);

userRoute.post('/upload', upload.single('file'),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
});

module.exports = userRoute