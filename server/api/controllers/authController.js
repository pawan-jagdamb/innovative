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
    console.log('2');
    if(!userName||!email ||!password){
        next(errorHandler(400,"All Field are mendatory"));
    }

    const imageUrl=`https://api.dicebear.com/9.x/initials/svg?seed=${userName}&backgroundColor=ffcc00&size=128`;

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
        userName, email, password:hashedPassword,avatar:imageUrl
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
                                        // expiresIn:"session",
                                    });
        //
        const options={
            // expires: new Date(Date.now() + 1*60*60*1000),
            httpOnly:true,
        }
        validUser.password=null; 

        res.cookie('access_token',token,options).status(200).json({
            success:true,
           
           user: validUser,
            message:"User logged in successfully",

        })

    }catch(error){
        next(error);
    }
};

export const google = async(req,res,next)=>{
    try{
        const user= await User.findOne({email:req.body.email});
        if(user){
            const token=jwt.sign({id:user._id}, process.env.JWT_SECRET);

            const options={
                httpOnly:true,
            }
            user.password=null; 
    
           return res.cookie("access_token",token,options).status(200).json({
                success:true,
               
                user,
                message:"User logged in successfully",
    
            })

        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8); // 16 character password generating for google authentication

            const hashedPassword= bcrypt.hashSync(generatedPassword,saltRounds);
            // since we are creating user so 
            // we will concatenate user name and add extra random number  to make it unique;


            const username=req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-6);

            const newUser= new User({userName:username,password:hashedPassword,email:req.body.email,avatar:req.body.photo});
            await newUser.save();
            const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const options={
                httpOnly:true,
            }
            newUser.password=null; 
            return res.cookie("access_token",token,options).status(200).json({
                success:true,
           
                user:newUser,
                message:"User logged in successfully",
    
            })
    
        }

    }catch(error){

        next(error);

    }
}

