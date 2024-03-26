const jwt = require('jsonwebtoken');
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const cookieParser = require("cookie-parser");
const Authenticate = async(req,res,next) =>{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const rootUser = await User.findOne({_id: verifyToken._id,"tokens.token":token});
        
        if(!rootUser){
            throw new Error("User not found");
        }
       // console.log("Token verified successfully");
        //console.log("Root user:", rootUser);
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    }catch(err){
        res.status(401).send("Unauthorized :no token provided");
        console.log("error in authetication, ",err);
    }
}
module.exports = Authenticate;