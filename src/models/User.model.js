const mongoose = require('mongoose');
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
        trim:true,
        minlength: [3, 'Username trop court (min 3)'],
        maxlength: [30, 'Username trop long (max 30)']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password:{
        type: String, 
        required: [true, 'Mot de passe requis'],
        minlength: [8, 'Mot de passe trop court (min 8)'],
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
    }

},
{
    timestamps:true 
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ apiKey: 1 }, {sparse: true });
UserSchema.index({ uuid: 1 }, { unique: true });
