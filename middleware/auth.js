const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
    if (!req.header("Authorization")) {
        return res.status(401).json({message: "Auth Error"});
        
    }
    const token = req.header("Authorization").split(" ")[1];
    // console.log(token)
    if(!token)
    return res.status(401).json({message: "Auth Error"});

    try{
        const decoded = await jwt.verify(token, "MYNAMEISTARUNSINGHCHAUDHARYANDILIVESINGHAZIABAD");
        // console.log(decoded)
        req.user = decoded;
        next();
    } catch(err){
        console.log(err)
        res.status(500).send({ message: "Invalid Token"});
    }
}

const restrictTo =  (role) => {
    return async (req,res,next) => {
        console.log(req.user)
        const user = await User.findById(req.user._id)
        console.log(user)
        console.log(role)

        if((role !== user.role)) {
            return res.status(403).json({ error: "You dont have permission to access this." })
        }
        next();
    }
}

module.exports = {auth , restrictTo};