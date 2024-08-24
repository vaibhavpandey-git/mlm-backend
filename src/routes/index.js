const express = require('express');
const authRoute = require('./authRoutes');
const adminRoute = require('./adminRoutes');
const userRoute = require('./userRoutes');
const requireLogin = require('../middlewares/requireLogin');
const commonRoute = require('./commonRoutes');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', requireLogin(['admin']) ,adminRoute);
router.use('/user', requireLogin(['user']),userRoute);
router.use('/common',requireLogin(['admin', 'user']) ,commonRoute);

module.exports = router