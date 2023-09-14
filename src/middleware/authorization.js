const jwt = require('jsonwebtoken');    
const secret = process.env.TOKEN_SECRET;

exports.authorize = async (req, res, next) => {
    //console.log("authorization.authorize accessed");
    //console.log("req.cookies:", req.cookies);
    
    const token = req.cookies.access_token;
    //console.log(token);    
 

    if(!token) {
        return res.sendStatus(403);
    }

    try {
        const data = jwt.verify(token, secret);
        //console.log("token", token, "verified");
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};
