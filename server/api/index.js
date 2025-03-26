import express from "express";
// import mongoose from 'mongoose'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
import listingRoute from './routes/listingRoute.js'
import cookieParser from "cookie-parser";
// import database from "./config/database.js"
// const database= require("./config/database")
import  connect  from "./config/database.js"; // Ensure you're importing correctly
import  mailSender  from "./utils/mailSender.js";
import cors from 'cors'

connect();
const PORT= process.env.PORT;
// database.connect();
// mailSender("pawankumar9534078@gmail.com", "First mail", "aaHellow world");
const app=express(); 

const corsOptions = {
    origin:'http://localhost:5173',// Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],// Allowed methods
    credentials: true, // Allow cookies
};  

app.use(cors(corsOptions));
 

app.use(express.json());
app. use(cookieParser());
console.log("first")
 
app.use('/api/user',userRouter);   

app.use('/api/auth',authRouter);  
app.use('/api/listing',listingRoute);

app.use((error,req,res,next)=>{

    const statusCode=error.statusCode ||500;

    const message= error.message || "Internal Server Error";

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })

});
app.listen(PORT,()=>{   


    console.log('Server is running on port!!! ',PORT)
})    
