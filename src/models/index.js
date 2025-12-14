const mongoose = require("mongoose");
const UserSchema = require("./User.model")
module.exports = mongoose.model('User', UserSchema);
