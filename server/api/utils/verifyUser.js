import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const verifyToken =(req, res, next)=>{
    // console.log("first",req.params.id)
    // console.log("1verify token",localStorage.getItem("token"))
    const token= req.cookies.token || req.body.token|| localStorage.getItem('token')||  req.header("Authorization").replace("Bearer ","") ;
    // console.log("verify token",req)
    // console.log("token",token)
    console.log("2 verify token")

    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET,(error,user)=>{
        if(error){
              console.log("error",error);
            return next(errorHandler(403,"Forbidden"));
        }
          

        req.user=user; 
        next(); 
    });
}  