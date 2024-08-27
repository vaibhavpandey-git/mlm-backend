const express = require('express');
const authRoute = require('./authRoutes');
const adminRoute = require('./adminRoutes');
const userRoute = require('./userRoutes');
const requireLogin = require('../middlewares/requireLogin');
const commonRoute = require('./commonRoutes');
const publicRoute = require('./publicRoutes');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', requireLogin(['admin']) ,adminRoute);
router.use('/user', requireLogin(['user']),userRoute);
router.use('/common',requireLogin(['admin', 'user']) ,commonRoute);
router.use('/public', publicRoute);

module.exports = router