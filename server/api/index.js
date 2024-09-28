import express from "express";
import mongoose from 'mongoose'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
const PORT= process.env.PORT;
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connection to database is successfull");
})
.catch((error)=>{  
    console.log("Error in Connecting database");
})

const app=express(); 
app.listen(PORT||5000||6000,()=>{   


    console.log('Server is running on port!!! ',PORT)
})    

app.use(express.json());
 
app.use('/api/user',userRouter);    
app.use('/api/auth',authRouter); 

app.use((error,req,res,next)=>{

    const statusCode=error.statusCode ||5000;

    const message= error.message || "Internal Server Error";

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })

});
