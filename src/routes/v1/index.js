const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
//router.use('/attacks', require('./attack.routes'));
//router.use('/targets', require('./target.routes'));
//router.use('/health', require('./health.routes'));

module.exports = router;
