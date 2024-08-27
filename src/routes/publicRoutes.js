const Express = require('express');
const { publicProduct } = require('../controller/public/publicController');
const publicRoute = Express.Router();

publicRoute.get('/product', publicProduct);

module.exports = publicRoute