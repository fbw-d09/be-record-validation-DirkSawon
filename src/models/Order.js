const { Schema, model, mongoose } = require('mongoose');

const schema = new Schema({
    id: Number,
    qty: Number,
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    }
}, { timestamps: true});

/* const schema = new Schema({
    id: Number,
    record: {[
        [ // {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Record",
            qty: Number
        ] // }
    ]}
}, { timestamps: true}); */

const orderModel = new model('Order', schema, 'orders');

module.exports = orderModel;
