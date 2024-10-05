import User from "../model/useModel.js"

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorHandler, successHandler } from "../utils/error.js";

const saltRounds = 10; // define we want to hash in how many rounds
 

export const signup= async(req,res,next)=>{ 

    try{

        // console.log(req.body); 
        console.log("1")
    const {userName, email, password}= req.body; 
    console.log('2')
    if(!userName||!email ||!password){
        next(errorHandler(400,"All Field are mendatory"))
    }

    // find is there is already user
    const existingUser=await User.findOne({email});
    console.log('3')
    const existingUserName= await User.findOne({userName})
    console.log('4')

    if(existingUser || existingUserName ){
      
        next(errorHandler(400,"User already Exist"));

    } 
    let hashedPassword;

// hash password

    try {
         hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
    } catch (error) {

          
            next(errorHandler(400,"Error in Hashing Password"));
          
    }
    console.log("name, email, password", userName, email, password);
    console.log('5')
      
    const user= await User.create({
        userName, email, password:hashedPassword
    })

 console.log("User created")
   return res.json(successHandler(201,"Account Created Successfully" )); 

    } 
    catch(error){

            next(errorHandler(500,"User cannot be registered"))

    }


};
export const signin=async(req,res,next)=>{

    const {email, password}=req.body;
    if(!email || !password){
        return next(errorHandler(400,"All Field are mandatory"));
    }

    try{
        const validUser= await User.findOne({email});
        if(!validUser){
           return next(errorHandler(404,"User Not Exist"));

        }
        console.log("Here riched")
        
        const validPassword= bcrypt.compareSync(password,validUser.password);

        if(!validPassword){
            return next(errorHandler(401,"Invalid Password"));
        }

            const token= jwt.sign({id:validUser._id}, process.env.JWT_SECRET,{
                                        expiresIn:"2h",
                                    });
        //
        const options={
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly:true,
        }
        validUser.password=null; 

        res.cookie("access_token",token,options).status(200).json({
            success:true,
            token,
            validUser,
            message:"User logged in successfully",

        })

    }catch(error){
        next(error);
    }
};
