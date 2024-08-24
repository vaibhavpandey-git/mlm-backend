const express = require('express');
const { getProduct, updateDetails, updatePassword, setPassword } = require('../controller/common/commonController');
const { memberTree } = require('../controller/common/treeController');

const commonRoute = express.Router();

commonRoute.get('/products',getProduct);
commonRoute.get('/membertree', memberTree);
commonRoute.post('/updateuser', updateDetails);
commonRoute.put('/updatepassword', updatePassword);
commonRoute.put('/setpassword', setPassword);

module.exports = commonRoute