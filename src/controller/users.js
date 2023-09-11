const User = require('../models/User.js');
const { connect, closeConnection } = require('../configs/db.js');

exports.createNewUser = async (req, res) => {
    console.log(req.body);

    const { id, firstname, lastname, email, password, address } = req.body;

    try {
        connect().then(async (db) => {
            const newUser = new User({
                id,
                firstname,
                lastname,
                email,
                password,
                address
            });

            console.log(newUser);

            newUser
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

exports.getAllUsers = async (req, res) => {
    try {
        connect().then(async (db) => {
            User
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


// Brain-Stormen wie eine Filterfunktion via GET Anfrage realisiert werden kann (z.B. über Routen, welche Parameter übergeben werden, usw.)
exports.filterUser = async (req, res) => {
    //console.log(req.body);

    const { criteria, filter1, filter2, filter3 } = req.body;

    let f1 = false;
    let f2 = false;
    let f3 = false;

    let key1 = "";
    let key2 = "";
    let key3 = "";

    let rel1 = "";
    let rel2 = "";
    let rel3 = "";

    let val1 = ""
    let val2 = "";
    let val3 = "";

    if(filter1 !== undefined) {
        const filter1WordArray = filter1.split(' ');
        key1 = filter1WordArray[0];
        rel1 = filter1WordArray[1];
        val1 = filter1WordArray[2];
        f1 = true;
    }
    
    if(filter2 !== undefined) {
        const filter2WordArray = filter2.split(' ');
        key2 = filter2WordArray[0];
        rel2 = filter2WordArray[1];
        val2 = filter2WordArray[2];
        f2 = true
    }
    
    if(filter3 !== undefined) {
        const filter3WordArray = filter3.split(' ');
        key3 = filter3WordArray[0];
        rel3 = filter3WordArray[1];
        val3 = filter3WordArray[2];
        f3 = true;
    }
    


    //console.log(key1, rel1, val1);
    //console.log(key2, rel2, val2);
    //console.log(key3, rel3, val3);

    // Filternamen/Methoden definieren:
    /**  
    /* Grundschema: 
    /*  Ein Suchkriterium: .where(Schlüssel)."filter(Wert)"
    /*  Mehrere Kritierien: .where(Schlüssel_1)."filter_1(Wert_1)".where(Schlüssel_2)."filter_2(Wert2).[...].where(Schlüssel_n)."filter_n(Wert_n)"
    /* z.B. schlüssel, filter, wert
    /* Alle Variationen abdecken: 3 * 2^n Fälle
    **/
    
    // if()
    switch ( criteria ) {
        case '1':
            try {
                connect().then(async (db) => {
                    if(rel1 === "=") {
                        User
                        .where(key1)
                        .equals(val1)
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
                    }
                    else if(rel1 = "!=") {
                        User
                        .where(key1)
                        .ne(val1)
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
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            message: "operation not available"
                        })
                    }
                })
            } catch (error) {
                console.log(error.message);
            }
        break;

        case '2':
            try {
                connect().then(async (db) => {
                    if(rel1 === "=" && rel2 === "=") {                    
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .equals(val2)
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
                    }
                    else if(rel1 === "=" && rel2 === "!=") {
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .ne(val2)
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
                    }
                    else if(rel1 === "!=" && rel2 === "=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .equals(val2)
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
                    }
                    else if(rel1 === "!=" && rel2 === "!=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .ne(val2)
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
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            message: "operation not available"
                        })
                    }
                })
            } catch (error) {
                console.log(error.message);
            }
        break;

        case '3':
            try {
                connect().then(async (db) => {
                    if(rel1 === "=" && rel2 === "=" && rel3 === "=") {
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .equals(val2)
                        .where(key3)
                        .equals(val3)
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
                    }
                    else if(rel1 === "=" && rel2 === "=" && rel3 === "!=") {
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .equals(val2)
                        .where(key3)
                        .ne(val3)
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
                    }
                    else if(rel1 === "=" && rel2 === "!=" && rel3 === "=") {
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .ne(val2)
                        .where(key3)
                        .equals(val3)
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
                    }
                    else if(rel1 === "!=" && rel2 === "=" && rel3 === "=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .equals(val2)
                        .where(key3)
                        .equals(val3)
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
                    }
                    else if(rel1 === "=" && rel2 === "!=" && rel3 === "!=") {
                        User
                        .where(key1)
                        .equals(val1)
                        .where(key2)
                        .ne(val2)
                        .where(key3)
                        .ne(val3)
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
                    }
                    else if(rel1 === "!=" && rel2 === "=" && rel3 === "!=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .equals(val2)
                        .where(key3)
                        .ne(val3)
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
                    }
                    else if(rel1 === "!=" && rel2 === "!=" && rel3 === "=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .ne(val2)
                        .where(key3)
                        .equals(val3)
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
                    }
                    else if(rel1 === "!=" && rel2 === "!=" && rel3 === "!=") {
                        User
                        .where(key1)
                        .ne(val1)
                        .where(key2)
                        .ne(val2)
                        .where(key3)
                        .ne(val3)
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
                    }
                    else {
                            res.status(404).json({
                                success: false,
                                message: "operation not available"
                            })
                    
                    }
                })
            } catch (error) {
                console.log(error.message);
            }
        break;
    }

    //console.log(filters);

    //res.status(200).json({ success: true, criteria: criteria, filter1: filter1, filter2: filter2, filter3: filter3 });
};

exports.getUser = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            User
            .findOne({ id: id}).populate("address", "-_id") // .findOne({ _id: id})
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

exports.updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            User
            .findOne({ id: id}) // .findOne({ _id: id})
            .then(doc => {
                doc.firstname = req.body.firstname || doc.firstname;
                doc.lastname = req.body.lastname || doc.lastname;
                doc.email = req.body.email || doc.email;
                doc.password = req.body.password || doc.password;
                doc.address = req.body.address || doc.address

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

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        connect().then(async (db) => {
            User
            .deleteOne({ _id: id }) // .deleteOne({ _id: id })
            .then(doc => {
                res.status(200).json({
                    success: false,
                    message: "User wurde gelöscht"
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
