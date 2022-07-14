const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // console.log(req)
    const token = req.cookies.token
    // console.log(token)
    // Check for token
    if(!token){
        const refreshtoken=req.cookies.refreshtoken;
        if(!refreshtoken)
        return res.status(400).json("No token!")

        try {
            const decoded = jwt.verify(token, process.env.jwtsecret);
            //Add user from payload

            req.user = decoded;

            next();
        } catch (error) {
            
        }
    }
    

    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.jwtsecret);
        //Add user from payload
        req.user = decoded;
        // console.log(decoded)
        next();
        // console.log("here")
    } catch(e){
        res.status(400).json({ msg:'Token is not valid'});
    }
    
}

module.exports = auth;