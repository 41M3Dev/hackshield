const express = require('express');
const router = express.Router();

// Controllers
const {
    createUser,
    getUsers,
    getUserById,
    getMe,
    updateUser,
    deleteUser
} = require('../../controllers/user.controller');

// Middlewares
const auth = require('../../middlewares/auth.middleware');
const isAdmin = require('../../middlewares/isAdmin.middleware');
const isSelf = require('../../middlewares/isSelf.middleware');

// Validators
const validate = require('../../middlewares/validate.middleware');
const { createUserValidator, updateUserValidator } = require('../../validators/user.validator');

/**
 * Admin routes
 */
router.post('/', auth, isAdmin, validate(createUserValidator), createUser);
router.get('/', auth, isAdmin, getUsers);

/**
 * User routes
 */
router.get('/me', auth, getMe);
router.get('/:id', auth, isSelf, getUserById);
router.put('/:id', auth, isSelf, validate(updateUserValidator), updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
