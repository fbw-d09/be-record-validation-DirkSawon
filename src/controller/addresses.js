const Address = require('../models/Address.js');
const { connect, closeConnection } = require('../configs/db.js');
const validator = require('express-validator');

exports.createNewAddress = async (req, res) => {
    console.log(req.body);

    const { street, city } = req.body;

    try {
        connect().then(async (db) => {
            const newAddress = new Address({
                street,
                city
            });

            console.log(newAddress);

            newAddress
            .save()
            .then(doc => {
                res.status(201).json({
                    success: true,
                    data: doc
                })
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    message: err.message
                });
            })

        })
        
    } catch (error) {
        console.log(error.message);
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        connect().then(async (db) => {
            Address
            .find({})
            .then(docs => {
                res.status(200).json({
                    success: true,
                    data: docs
                })
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: err.message
                })
            })
        })
    } catch (error) {
        console.log(error.message);
    }
};

exports.getAddress = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async, (db) => {
            Address
            .findOne({ id: id}) // .findOne({ _id: id})
            .then(doc => {
                res.status(200).json({
                    success: true,
                    data: doc
                });
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: err.message
                })
            })
        })
    } catch (error) {
        console.log(error.message);
    }
};

exports.updateAddress = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            Address
            .findOne({ id: id}) // eigentlich .findOne({ _id: id })
            .then(doc => {
                doc.street = req.body.street || doc.street;
                doc.city = req.body.city || doc.city;

                doc.save()
                .then(doc => res.status(200).json({
                    success: true,
                    newData: doc
                }))
                .catch(err => res.status(400).json({
                    success: true,
                    message: err.message
                }));
            })
            .catch(err => console.log(err))
        });
    } catch (error) {
        
    }
};

exports.deleteAddress = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            Address
            .deleteOne({ id: id }) // .deleteOne({ _id: id })
            .then(doc => {
                res.status(200).json({
                    success: false,
                    message: "Adresse wurde gelöscht"
                })
            })
            .catch(err => {
                res.status(404).json({
                    success: false,
                    message: err.messsage
                })
            })
        })
    } catch (error) {
        console.log(error.message);
    }
};