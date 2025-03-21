import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { toast } from 'react-hot-toast';
import GoogleOAuth from '../components/GoogleOAuth';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../services/operations/authAPI';
import { setSignupData } from '../redux/user/authSlice';


export default function SignUp() {
  const [formData,setFormData]=useState({}) 
  const [error,setError] =useState(null);
  const [loading,setLoading]=useState(false);
  const navigate= useNavigate();
  const dispatch= useDispatch();

  const [showPassword, setShowPassword]=useState(false);
  const [showConfirmPassword, setShowConfirmPassword]=useState(false);

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();  // prevent refreshing the page
    
      // console.log(formData.password);
      if(formData.password!=formData.confirmPassword){
        toast.error("Password Not matched")
        return;
      }
      
      // setLoading(true);
      dispatch(setSignupData(formData));
      dispatch(sendOtp(formData.email, navigate))

    //  
  };
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center text-richblack-100 font-semibold my-7'>Sign Up</h1>

      <form action="" onSubmit={handleSubmit}  className=' flex flex-col gap-4' >

        <input  type="text" placeholder='username' className=' border p-3 rounded-lg text-richblack-900' id='userName' onChange={handleChange} />
        <input  type="email" placeholder='email' className=' border p-3 rounded-lg text-richblack-900' id='email' onChange={handleChange} />

        

        <input    type={showPassword?("text"):("password")} placeholder='Password' className=' border p-3 rounded-lg text-richblack-900' id='password' onChange={handleChange} />
        <input    type={showPassword?("text"):("password")} placeholder='Confirm Password' className=' border p-3 rounded-lg text-richblack-900' id='confirmPassword' onChange={handleChange} />




        <button disabled={loading} className='bg-richblack-900 text-richblack-25 p-3 rounded-lg
        uppercase hover:opacity-50' >
        {loading?'Loading ...':'Sign Up'}
         </button>
         <GoogleOAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p className='text-richblack-5'>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-yellow-700   hover:opacity-80'> Sign In</span>
        </Link>
      </div>
      
    </div>
  );
};
