import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import signInPhoto from '../assets/signInPhoto.jpg'
import frame from '../assets/frame.png'
import GoogleOAuth from "../components/GoogleOAuth";
import { login } from "../services/operations/authAPI";
export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword]=useState(false);
  // const [showConfirmPassword, setShowConfirmPassword]=useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    dispatch(login(formData.email, formData.password, navigate))
    // console.log(data)
  };
  console.log(formData);
  return (
    <div className="flex flex-col w-11/12 max-w-[1160px] py-12 mx-auto gap-y-0 gap-x-12 justify-between text-richblack-100 md:flex-row" >
     <div className="w-11/12 max-w-[450px] flex flex-col">
     <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
        Welcome Back
      </h1>
      <p className="text-[1.125rem] mt-4 leading-[1.625rem]">
          <span className="text-richblack-100">Lets Look for the</span>
          <span className="text-blue-100 italic"> new in the old</span>
        </p>
     

      <form action="" onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className=" w-full relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Email Address
              <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              placeholder="email"
              className='border-b bg-richblack-800 rounded-[.5rem] text-richblack-5 w-full p-[12px]'
              id="email"
              onChange={handleChange}
            />
        </div>
         <div className=" w-full relative">
               <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                    Password
                    <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className='border-b bg-richblack-800 rounded-[.5rem] text-richblack-5 w-full p-[12px]'
                  id="password"
                  onChange={handleChange}
                  />
                     <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] cursor-pointer "
                >
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )}
                </span>

         </div>
      

        <button
          disabled={loading}
          className="bg-yellow-50 py-[8px] px-[12px] rounded-[8px] mt-6 font-semibold text-richblack-900"
        >
          {loading ? "Loading ..." : "Sign In"}
        
        </button>

        <div className="flex w-full items-center gap-x-2 my-4">
          <div className="h-[1px] bg-richblack-700 w-full"></div>
          <p className="uppercase text-richblack-700 font-medium leading-[1.375rem]">
            or
          </p>
          <div className="h-[1px] bg-richblack-700 w-full"></div>
        </div>
        
          <GoogleOAuth />
     
      </form>

      <div className="flex gap-2 mt-3">
        <p className="text-richblack-5">Dont have account</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-100 italic   hover:opacity-80"> Sign Up</span>
        </Link>
      </div>

     </div>
     <div className="relative w-11/12 max-w-[450px] hidden md:block">
     <img src={frame} alt="patter" width={558} height={504} loading="lazy" />
     <img
          src={signInPhoto}
          alt="patter"
          width={458}
          height={34}
          loading="lazy"
          className="absolute -top-4 right-4 "
        />
     </div>
     
    </div>
  );
}
