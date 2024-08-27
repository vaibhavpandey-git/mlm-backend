const Express = require('express');
const { updateDetails, updatePassword, setPassword } = require('../controller/common/commonController');
const { memberTree } = require('../controller/common/treeController');

const commonRoute = Express.Router();


commonRoute.get('/membertree', memberTree);
commonRoute.post('/updateuser', updateDetails);
commonRoute.put('/updatepassword', updatePassword);
commonRoute.put('/setpassword', setPassword);

module.exports = commonRoute