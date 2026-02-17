const express = require('express');
const router = express.Router();

// Controllers
const {
    createUser,
    getUsers,
    getUserById,
    getMe,
    updateUser,
    deleteUser,
    updatePassword,
    generateUserApiKey,
    revokeApiKey,
    logoutAll,
    adminUpdateUser
} = require('../../controllers/user.controller');

// Middlewares
const auth = require('../../middlewares/auth.middleware');
const isAdmin = require('../../middlewares/isAdmin.middleware');
const isSelf = require('../../middlewares/isSelf.middleware');

// Validators
const validate = require('../../middlewares/validate.middleware');
const {
    createUserValidator,
    updateUserValidator,
    updatePassword: updatePasswordValidator,
    adminUpdateUser: adminUpdateUserValidator
} = require('../../validators/User.validator');

/**
 * Admin routes
 */
router.post('/', auth, isAdmin, validate(createUserValidator), createUser);
router.get('/', auth, isAdmin, getUsers);
router.put('/:id/admin', auth, isAdmin, validate(adminUpdateUserValidator), adminUpdateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

/**
 * Current user routes (/me)
 */
router.get('/me', auth, getMe);
router.put('/me/password', auth, validate(updatePasswordValidator), updatePassword);
router.post('/me/api-key', auth, generateUserApiKey);
router.delete('/me/api-key', auth, revokeApiKey);
router.post('/me/logout-all', auth, logoutAll);

/**
 * User routes (by ID)
 */
router.get('/:id', auth, isSelf, getUserById);
router.put('/:id', auth, isSelf, validate(updateUserValidator), updateUser);

module.exports = router;
