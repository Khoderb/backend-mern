//on this middleware : precheck user before request profile funct on userRoutes
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async ( req, res, next ) =>{
    if(
        req.headers?.authorization  && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
           const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select(
                "-password -confirmed -token -__v -createdAt -updatedAt "
            );

            return next();
        }catch(err){   
                return res.status(401).json({ msg: err.message });
            }
        }
    if(!req.headers.authorization){
        return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
}

export default checkAuth;