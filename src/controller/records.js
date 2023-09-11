const Record = require('../models/Record.js');
const { connect, closeConnection } = require('../configs/db.js');
const validator = require('express-validator');

exports.createNewRecord = async (req, res) => {
    console.log(req.body);

    const { id, title, artist, year, cover, price } = req.body;

    try {
        connect().then(async (db) => {
            const newRecord = new Record({
                id,
                title,
                artist,
                year,
                cover,
                price
            });

            console.log(newRecord);

            newRecord
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

exports.getAllRecords = async (req, res) => {
    try {
        connect().then(async (db) => {
            Record
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

exports.getRecord = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async, (db) => {
            Record
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

exports.filterRecords = async (req, res) => {
    console.log(req.body);
};

exports.updateRecord = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            Record
            .findOne({ id: id}) // .findOne({ _id: id})
            .then(doc => {
                doc.id = req.body.id || doc.id;
                doc.title = req.body.title || doc.title;
                doc.artist = req.body.artist || doc.artist;
                doc.year = req.body.year || doc.year;
                doc.cover = req.body.cover || doc.cover;
                doc.price = req.body.price || doc.price;

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

exports.deleteRecord = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            Record
            .deleteOne({ id: id }) // .deleteOne({ _id: id })
            .then(doc => {
                res.status(200).json({
                    success: false,
                    message: "Schallplatte wurde gelöscht"
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
