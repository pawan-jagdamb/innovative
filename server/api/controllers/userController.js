import express from 'express'
import { errorHandler, successHandler } from '../utils/error.js';
import User from '../model/useModel.js'
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

}