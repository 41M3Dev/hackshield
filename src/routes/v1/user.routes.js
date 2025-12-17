const express = require('express');
const router = express.Router();

// Middlewares
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const isSelf = require('../middlewares/isSelf.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

// Validators
const UserValidators = require('../validators/User.validators');

// Controllers
const userController = require('../controllers/user.controller');

/*
|--------------------------------------------------------------------------
| USER — routes utilisateur connecté
|--------------------------------------------------------------------------
*/

// Récupérer son profil
router.get('/me',auth,userController.getMe
);

// Mettre à jour son profil
router.patch(
    '/me',
    auth,
    validate(UserValidators.updateProfile),
    userController.updateMe
);

// Changer son mot de passe
router.patch(
    '/me/password',
    auth,
    validate(UserValidators.updatePassword),
    userController.updatePassword
);

/*
|--------------------------------------------------------------------------
| ADMIN — gestion utilisateurs
|--------------------------------------------------------------------------
*/

// Récupérer un utilisateur par UUID
router.get(
    '/admin/users/:uuid',
    auth,
    isAdmin,
    validate(UserValidators.paramsUuid, 'params'),
    userController.getUserByUuid
);

// Modifier un utilisateur (admin)
router.patch(
    '/admin/users/:uuid',
    auth,
    isAdmin,
    validate(UserValidators.adminUpdateUser),
    validate(UserValidators.paramsUuid, 'params'),
    userController.adminUpdateUser
);
