const { Schema, model } = require('mongoose');

const imageSchema = new Schema ({
    name: String,
    data: Buffer,
    contentType: String
}, {
    timestamps: true
});

const schema = new Schema({
    id: Number,
    title: String,
    artist: String,
    year: Number,
    cover: { type: imageSchema, ref: "Image" },
    price: Number
}, { timestamps: true});

const recordModel = new model('Record', schema, 'records');

module.exports = recordModel;
