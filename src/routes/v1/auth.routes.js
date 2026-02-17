const express = require('express');
const router = express.Router();

// Middlewares
const { authenticate } = require('../../middlewares/auth.middleware');

// Controllers
const {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    enableTwoFactor,
    verifyTwoFactorSetup,
    verifyTwoFactorLogin,
    disableTwoFactor
} = require('../../controllers/auth.controller');

// Validators
const validate = require('../../middlewares/validate.middleware');
const {
    register: registerValidator,
    login: loginValidator,
    verifyEmail: verifyEmailValidator,
    resendVerification: resendVerificationValidator,
    forgotPassword: forgotPasswordValidator,
    resetPassword: resetPasswordValidator,
    refreshToken: refreshTokenValidator,
    logout: logoutValidator,
    enableTwoFactor: enableTwoFactorValidator,
    verifyTwoFactorSetup: verifyTwoFactorSetupValidator,
    verifyTwoFactorLogin: verifyTwoFactorLoginValidator,
    disableTwoFactor: disableTwoFactorValidator
} = require('../../validators/Auth.validator');

/**
 * Public authentication routes
 */
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.post('/refresh', validate(refreshTokenValidator), refreshToken);
router.post('/logout', validate(logoutValidator), logout);

/**
 * Email verification routes
 */
router.post('/verify-email', validate(verifyEmailValidator), verifyEmail);
router.post('/resend-verification', validate(resendVerificationValidator), resendVerificationEmail);

/**
 * Password reset routes
 */
router.post('/forgot-password', validate(forgotPasswordValidator), forgotPassword);
router.post('/reset-password', validate(resetPasswordValidator), resetPassword);

/**
 * Two-Factor Authentication routes
 */
// Routes protégées (nécessitent authentification)
router.post('/2fa/enable', authenticate, validate(enableTwoFactorValidator), enableTwoFactor);
router.post('/2fa/verify-setup', authenticate, validate(verifyTwoFactorSetupValidator), verifyTwoFactorSetup);
router.post('/2fa/disable', authenticate, validate(disableTwoFactorValidator), disableTwoFactor);

// Route publique (pendant le login)
router.post('/2fa/verify-login', validate(verifyTwoFactorLoginValidator), verifyTwoFactorLogin);

module.exports = router;

