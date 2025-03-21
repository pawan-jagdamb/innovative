import User from "../model/useModel.js"
import OTP from '../model/OTP.js';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorHandler, successHandler } from "../utils/error.js";

; // define we want to hash in how many rounds
 

export const sendOTP = async (req, res, next) => {
    try {
        // Fetch email from request body
        const { email } = req.body;

        // Check if user already exists
        console.log("Checking user existence...");
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP generated:", otp);

        // Ensure the OTP is unique
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // Create OTP payload
        const otpPayload = { email, otp };

        // Create an entry for OTP in the database
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP entry created:", otpBody);

        // Send response back to client
        return res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        });

    } catch (error) {
        console.log("Error in sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const signup= async(req,res,next)=>{ 

    try{

        // console.log(req.body); 
        console.log("1")
    const {userName, email, password,confirmPassword,otp}= req.body; 
    console.log('2');
    if(!userName||!email ||!password||!confirmPassword){
        next(errorHandler(400,"All Field are mendatory"));
    }
    if(password!=confirmPassword){
        return res.status(403).json({
            success:false,
            message:"Password Not Matched"
        })
    }


    // find is there is already user
    const existingUser=await User.findOne({email});
    console.log('3')
    const existingUserName= await User.findOne({userName})
    console.log('4')

    if(existingUser || existingUserName ){
      
        next(errorHandler(400,"User already Exist"));

    } 
    const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    if(recentOtp.length===0){
        //OTP not found

        return res.status(403).json({
            success:false,
            message:"Incorrect OTP"
        })
        
    }
    if(otp!==recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    }

    let hashedPassword;

// hash password

    try {
         hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
    } catch (error) {

          
            next(errorHandler(400,"Error in Hashing Password"));
          
    }
    console.log("name, email, password,OTP", userName, email, password,otp);
    console.log('5')
    const imageUrl=`https://api.dicebear.com/9.x/initials/svg?seed=${userName}&backgroundColor=ffcc00&size=128`;
      
    const user= await User.create({
        userName, email, password:hashedPassword,avatar:imageUrl
    })

 console.log("User created")
   return res.json(successHandler(201,"Account registered Successfully" )); 

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
        const user= await User.findOne({email});
        if(!user){
           return next(errorHandler(404,"User Not Exist"));

        }
        console.log("Here riched")
        
        const validPassword= bcrypt.compareSync(password,user.password);

        if(!validPassword){
            return next(errorHandler(401,"Password is Incorrect"));
        }
        const payload={
            email:user.email,
        id:user._id,}
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
        user.token= token;
        user.password= undefined;
        const options={
            expired: new Date (Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in Successfully"
        })
        

      
    

    }catch(error){
        next(errorHandler(500, "Login failure , please try again"));
    }
};

export const google = async(req,res,next)=>{
    try{
        const user= await User.findOne({email:req.body.email});
        if(user){
            const payload={
                email:user.email,
                id:user._id,

            }
            const token=jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2h"
            });

            user.token= token;
        
            user.password=null; 
            const options={
                expires:new Date (Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }
    
           return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
               
                user,
                message:"User logged in successfully",
    
            })

        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8); // 16 character password generating for google authentication

            const hashedPassword= bcrypt.hashSync(generatedPassword,10);
            // since we are creating user so 
            // we will concatenate user name and add extra random number  to make it unique;


            const username=req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-6);

            const user= new User({userName:username,password:hashedPassword,email:req.body.email,avatar:req.body.photo});
            await user.save();
            const payload={
                email:user.email,
                id:user._id
            }
            const token= jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
          user.token= token;
            user.password=null; 
            const options={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
           
                user,
                message:"User Sign Up successfully",
    
            })
    
        }

    }catch(error){

        next(error);

    }
}

export const signOut=(req,res,next)=>{
    try{
        // res.clearCookie('access_token');
      res.clearCookie('token');
        return res.status(200).json({
            success:true,
            message:"Logout Successfully"
        })
         
    }
    catch(error){
        next(error);
    }

}

