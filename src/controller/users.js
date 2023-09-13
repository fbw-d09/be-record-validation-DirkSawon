const User = require('../models/User.js');
const { connect, closeConnection } = require('../configs/db.js');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');
const secret = process.env.TOKEN_SECRET;

const authorize = (req, res, next) => {
    const token = req.cookies.access_token;

    console.log(token);

    if(!token) {
        return res.sendStatus(403);
    }

    try {
        const data = jwt.verify(token, secret);
        req.email = data.email;
        req.password = data.password;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};



const signAccessToken = data => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split (' ')[1];

        const decodedData = jwt.verify(token, process.env.TOKEN_SECRET);

        next();
    } catch (error) {
        res.status(401).json({ message: "NOT AUTHORIZED!"});
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const token = jwt.sign({ email, password }, secret);

    return res.cookie('access_token', 
        token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 Tag  // 30 Minuten: 30 * 60 * 1000
            httpOnly: true
        })
        .status(200)
        .json({
            success: true,
            message: `User mit der Email-Addresse ${ email } eingeloggt`
        });
};

exports.testLoggedInUser = (authorize, async (req, res) => {
    const { email, password } = req;

    res.status(200).json({
        success: true,
        email,
        message: "User is allowed to visit this resource"
    });
});

exports.logoutUser = (authorize, async (req, res) => {
    return res.clearCookie('access_token').status(200).json({
        success: true,
        message: 'User wurde erfolgreich ausgeloggt'
    });
});

exports.createNewUser = /* validator.body('email').isEmail().trim(), validator.body('password').isLength({ min: 8, max: 16 }), */ async (req, res) => {
    console.log(req.body);

    const { id, firstname, lastname, email, password, address } = req.body;

    /* const errors = validator.validationResult(req).errors;

    if(errors.length > 0) {
        return res.status(400).json({ errors });
    }
    else { */

        try {
            connect().then(async (db) => {
                const newUser = new User();

                newUser.id = id;
                newUser.firstname = firstname;
                newUser.lastname = lastname;
                newUser.email = email;
                newUser.password = newUser.hashPassword(password);
                newUser.address = address;
                
            
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
    /* } */
};

exports.authUser = async (req, res) => {
    const { id, password } = req.body;

    User.findOne({ id }).then(foundUser => {
        if(foundUser) {
            if(foundUser.comparePassword(password)) {
                res.status(200).json({ success: true, token: signAccessToken({ id })
                })
            }
            else {
                res.status(401).json({
                    success: false,
                    message: "Incorrect login data"
                })
            }
        }
        else {
            res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
    })
}

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


// per Authentifizierung absichern
exports.getUser = verifyToken, async (req, res) => {
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

// per Authentifizierung absichern
exports.updateUser = verifyToken, async (req, res) => {
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
                    success: false,
                    message: err.message
                }));
            })
            .catch(err => console.log(err))
        });
    } catch (error) {
        
    }
};

// per Authentifizierung absichern
exports.deleteUser = verifyToken, async (req, res) => {
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
