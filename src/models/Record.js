const { Schema, model } = require('mongoose');

const schema = new Schema({
    id: Number,
    title: String,
    artist: String,
    year: Number,
    cover: String,
    price: Number
}, { timestamps: true});

const recordModel = new model('Record', schema, 'records');

module.exports = recordModel;
