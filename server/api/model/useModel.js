import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    }, 
    password:{
        type:String,  
        required:true,
        // unique:true,

    },
    avatar:{
        type:String,
        // default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBh1Bjt2U5K-53Kwx7SFwwxwlCH_ihN0wvEQ&s"
        
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
 

},{timestamps:true});  


export default mongoose.model("User",userSchema);
 