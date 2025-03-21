import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const verifyToken =(req, res, next)=>{
    const token= req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    // console.log("verify token",req)

    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET,(error,user)=>{
        if(error)
            return next(errorHandler(403,"Forbidden"));

        req.user=user;
        next(); 
    });
}  