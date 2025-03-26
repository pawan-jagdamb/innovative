import express from 'express'
import { errorHandler, successHandler } from '../utils/error.js';
import User from '../model/useModel.js'
import Listing from '../model/listingModel.js';
export const test=(req,res)=>{
    res.json({
        message:"Api router form controller"
    })} ;

export const updateUserInfo= async(req, res, next)=>{
    const saltRounds=10;
    if(req.user.id != req.params.id){
        return next(errorHandler(401,"You can only update own account"));
    }
    try {
        const findUser=await User.findOne({userName:req.body.userName});
        if(findUser){
            return res.status(409).json({
                status:false,
                message:"User Name Already exist"
            })
        }
        if(!req.body.userName &&!req.body.password && !req.body.avatar){
            return res.status(400).json({
                success:false,
                message:"Atleast one thing are mendatory"
            })
        }
        const user= await User.findById({_id:req.params.id});

        
        if(req.body.password){
           user.password =  bcrypt.hashSync(req.body.password, saltRounds);

        }
        if(req.body.userName){
            user.userName=req.body.userName;
        }
        if(req.body.avatar){
            user.avatar=req.body.avatar;
        }

        const updatedUser= await User.findByIdAndUpdate(req.params.id,{
            $set:{
                userName:user.userName,
                
                password:user.password,
                avatar:user.avatar,
            }
        },{new:true});

        // req.body.password= null;
        const {password, ...rest}= updatedUser._doc;
        console.log(rest);
        // console.log("here is notprog")
       
       return res.status(200).json({
        success:true,
        message:"User updated Successfully",
        data: rest,
       });
        
    } catch (error) {
        return next(errorHandler(500,"Error in updating user"))
        
    }

};

export const deleteUser= async(req,res, next)=>{

    console.log("1");
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,'You can delete you own account'))
    }

    try {

    await User.findByIdAndDelete(req.params.id);
     
        // res.clearCookie('access_token');
      res.status(200).json({
            success:true,
            message:"User has been deleted" 
        })
  

        
    } catch (error) {
     return res.status(404).json({
        success:false,
        message:"unable to delete user"
     })
    }

}

export const getUserListings= async(req,res)=>{
    console.log("first")
    console.log(req.user.id)
    console.log("first")

    if(req.user.id===req.params.id){

        try {
            console.log("thrir")

            const listings= await Listing.find({userRef:req.params.id})

             res.status(200).json({
                success:true, 
                listings
            })
            
        } catch (error) {
            console.log("errorn in Get useer listings",error)
            
        }
        
    }
    else{
        return next(errorHandler(401,'You can only view your own listings'))
    }
}

export const getUser= async(req,res)=>{
    try {
        console.log("get user")
        const user= await User.findById(req.params.id);
        if(!user){
            return next(errorHandler(404,"User not found"))
        }
        const {password:pass,...rest}=user._doc;
        return res.status(200).json({
            success:true,
            rest,
        })
    } catch (error) {
        console.log("Error in get User")
        next(error);
       
        
    }
}