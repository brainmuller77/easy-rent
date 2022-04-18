const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    email: { type: String, required: true, trim: true, unique: true },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});


var Token = mongoose.model('Token', tokenSchema);
module.exports = Token;