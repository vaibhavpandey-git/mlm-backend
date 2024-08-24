const express = require('express');
const { getProduct, updateDetails } = require('../controller/common/commonController');
const { memberTree } = require('../controller/common/treeController');

const commonRoute = express.Router();

commonRoute.get('products',getProduct);
commonRoute.get('/membertree', memberTree);
commonRoute.post('/updateuser', updateDetails);

module.exports = commonRoute