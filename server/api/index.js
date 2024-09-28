import express from "express";
import mongoose from 'mongoose'
import 'dotenv/config'
const PORT= process.env.PORT;
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connection to database is successfull");
})
.catch((error)=>{  
    console.log("Error in Connecting database");
})

const app=express();
app.listen(PORT,()=>{
    console.log('Server is running on port!!! ',PORT)
})    