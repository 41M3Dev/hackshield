const express = require('express');
const router = express.Router();

// Controllers
const { register, login, logout,refreshToken } = require('../../controllers/auth.controller');

// Validators
const validate = require('../../middlewares/validate.middleware');
const { register: registerValidator, login: loginValidator } = require('../../validators/Auth.validator');

/**
 * Public authentication routes
 */
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.post('/refresh',refreshToken);
router.post('/logout',logout);
module.exports = router;

