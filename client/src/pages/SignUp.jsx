import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  const [formData,setFormData]=useState({})
  const [error,setError] =useState(null);
  const [loading,setLoading]=useState(false);

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();  // prevent refreshing the page
    try {
      
      setLoading(true);
      const res= await fetch('/api/auth/signup',
        { 
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
  
        });
      const data= await res.json();
      if(data.success===false){
        setError(data.messate);
        setLoading(false);
        return 
        
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);

      
    }
    // console.log(data)
  };
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center text-richblack-100 font-semibold my-7'>Sign Up</h1>

      <form action="" onSubmit={handleSubmit}  className=' flex flex-col gap-4' >

        <input type="text" placeholder='username' className=' border p-3 rounded-lg text-richblack-900' id='userName' onChange={handleChange} />
        <input type="text" placeholder='email' className=' border p-3 rounded-lg text-richblack-900' id='email' onChange={handleChange} />

        <input type="text" placeholder='password' className=' border p-3 rounded-lg text-richblack-900' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-richblack-900 text-richblack-25 p-3 rounded-lg
        uppercase hover:opacity-80' >
        {loading?'Loading ...':'Sign Up'}
         </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p className='text-richblack-5'>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-yellow-700   hover:opacity-80'> Sign In</span>
        </Link>
      </div>
    </div>
  )
}
