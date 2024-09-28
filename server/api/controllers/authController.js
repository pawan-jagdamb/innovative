import User from "../model/useModel.js"

import bcrypt from 'bcrypt'
import { errorHandler, successHandler } from "../utils/error.js";
const saltRounds = 10; // define we want to hash in how many rounds
 

export const signup= async(req,res,next)=>{ 

    try{

        // console.log(req.body); 
    const {userName, email, password}= req.body; 

    // find is there is already user
    const existingUser=await User.findOne({email});
    const existingUserName= await User.findOne({userName})

    if(existingUser || existingUserName ){
         res.status(400).json({
            success:false,
            
             
            message:"User already Exist",
        })
    }
    let hashedPassword;

// hash password

    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
       console.log(hashedPassword)
    } catch (error) {

          
            next(errorHandler(400,"Error in Hashing Password"));
          
    }
      
    const user= await User.create({
        userName, email, password:hashedPassword
    })
console.log("User created")
   res.json(successHandler(201,"User Created Successfully" ));



    } 
    catch(error){

            next(errorHandler(500,"User cannot be registered"))
     
           
     
    

    }


}
