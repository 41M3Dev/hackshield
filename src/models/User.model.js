const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const UserSchema = new mongoose.Schema({
    uuid:{
        type:String,
        default: uuidv4,
        unique: true,
        immutable: true
    },
    firstName:{
        type:String,
        trim:true,
    },
    lastName: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type: String, 
        required:true,
        select: false
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    apiKey: { 
        type: String, 
        unique: true,
        select: false 
    },
    apiKeyScopes: {
        type: [String],
        enum: ['scan:create', 'scan:read', 'scan:delete', 'admin'],
        default: ['scan:create', 'scan:read']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    lastLogin:{
        type:Date
    },
    plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free'
    },
    rateLimit: {
        type: Number,
        default: 1000
    },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },
        deletedAt: {
            type: Date,
            default: null
        },
        refreshTokens: [{
            token: String,
            createdAt: Date
        }],
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: String,
        emailVerificationExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        // Brute Force Protection
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: {
            type: Date,
            default: null
        },

        // Two-Factor Authentication (2FA)
        phoneNumber: {
            type: String,
            default: null,
            trim: true
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorCode: {
            type: String,
            select: false
        },
        twoFactorExpires: {
            type: Date,
            select: false
        },
        twoFactorVerified: {
            type: Boolean,
            default: false
        }

    },
{
    timestamps:true 
});

// Avant de sauvegarder, hasher le mot de passe si modifié
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Pour vérifier le mot de passe lors du login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual pour vérifier si le compte est verrouillé
UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Incrémenter les tentatives de login
UserSchema.methods.incrementLoginAttempts = async function() {
    // Si le verrouillage a expiré, réinitialiser
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = 5; // Nombre maximum de tentatives
    const lockTime = 15 * 60 * 1000; // 15 minutes en millisecondes

    // Verrouiller le compte après maxAttempts tentatives
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }

    return this.updateOne(updates);
};

// Réinitialiser les tentatives après un login réussi
UserSchema.methods.resetLoginAttempts = async function() {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ apiKey: 1 }, {sparse: true });
UserSchema.index({ uuid: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
