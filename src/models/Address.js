const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const schema = new Schema({
    street: String,
    city: String
}, { timestamps: true});

const addressModel = new model('Address', schema, 'addresses');

module.exports = addressModel;

/* alternativ in Verbindung mit User:
const schema = new Schema({
    users: {[
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    ]}
}, { timestamps: true});

oder:
const schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true});
 */
