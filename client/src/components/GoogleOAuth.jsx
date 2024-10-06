import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from "@firebase/auth"
import {app} from "../GoogleFirebase"
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function GoogleOAuth() {

    const dispatch= useDispatch();
    const navigate=useNavigate();

    const handleGoogleAuth=async()=>{
      
        try {
            const provider= new GoogleAuthProvider();
            const auth = getAuth(app);

            const result= await signInWithPopup(auth,provider);
           
            
            
            const res= await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
            });
            const data= await res.json();
            dispatch(signInSuccess(data));
            console.log("data-> ",data);
            toast.success(data.message);

            console.log(result);
            navigate('/');
            

            
        } catch (error) {
            console.log("Error in Singing in with google")
            toast.error("Failed")
            console.log(Error);
            

            
        }
    }
  return (
    <button onClick={handleGoogleAuth} type='button' className='bg-richblack-900 text-white p-3 rounded-lg uppercase hover:opacity-50'>Continue With Google</button>
  )
}
