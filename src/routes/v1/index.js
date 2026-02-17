const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/health', require('./health.routes'));
// router.use('/attacks', require('./attack.routes'));  // à développer Phase 1
// router.use('/targets', require('./target.routes')); // à développer Phase 1

module.exports = router;
