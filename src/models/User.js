const crypto = require('crypto');
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
//const address = require('./Address.js');
const secret = "EinGeheimerSchlüssel";

const addressSchema = new Schema({
    street: String,
    city: String
}, { timestamps: true});

const userSchema = new Schema({
    id: Number,
    firstname: String,
    lastname: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    address: addressSchema
}, { timestamps: true});

userSchema.methods.hashPassword = (password) => {
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
};

userSchema.methods.comparePassword = function (loginPassword) {
    if(this.password !== this.hashPassword(loginPassword)) {
        return false;
    }
    return true;
};

const userModel = new model('User', userSchema, 'users');

module.exports = userModel;

/* 
const schema = new Schema({
    id: Number,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }
}, { timestamps: true});
*/

/* 
const schema = new Schema({
    id: Number,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    address: {
        street: String,
        city: String
    }
}, { timestamps: true});
*/
