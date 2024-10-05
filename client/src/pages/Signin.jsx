import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { toast } from 'react-hot-toast'

export default function Signin() {
  const [formData,setFormData]=useState({})
  const [error,setError] =useState(null);
  const [loading,setLoading]=useState(false);
  const navigate= useNavigate();

  const [showPassword, setShowPassword]=useState(false);
  // const [showConfirmPassword, setShowConfirmPassword]=useState(false);

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();  // prevent refreshing the page
    try {
      // console.log(formData.password);
     
      
      setLoading(true);
      const res= await fetch('/api/auth/signin',
        { 
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
  
        });
      const data= await res.json();
      console.log("Data ->",data);
      if(data.success===false){
        setLoading(false);
        toast.error(data.message);

        setError(data.message);
        return;
      }
        toast.success("Logged In");
  
      
      setLoading(false);
      setError(null);
    navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message);

      
    }
    // console.log(data)
  };
  console.log(formData);
  return (
    <div className='p-3  max-w-lg mx-auto items-center justify-center'>
    <h1 className='text-3xl text-center text-richblack-100 font-semibold my-7'>Welcome Back</h1>
      <h1 className='text-3xl text-center text-richblack-100 font-semibold my-7'>Sign In</h1>

      <form action="" onSubmit={handleSubmit}  className=' flex flex-col gap-4' >

        <input required type="text" placeholder='email' className=' border p-3 rounded-lg text-richblack-900' id='email' onChange={handleChange} />

        

        <input required   type={showPassword?("text"):("password")} placeholder='Password' className=' border p-3 rounded-lg text-richblack-900' id='password' onChange={handleChange} />




        <button disabled={loading} className='bg-richblack-900 text-richblack-25 p-3 rounded-lg
        uppercase hover:opacity-80' >
        {loading?'Loading ...':'Sign In'}
         </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p className='text-richblack-5'>Don't have account</p>
        <Link to={"/sign-up"}>
          <span className='text-yellow-700   hover:opacity-80'> Sign Up</span>
        </Link>
      </div>
      
    </div>
  );
};
