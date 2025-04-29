import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../services/operations/authAPI';
import { setSignupData } from '../redux/user/authSlice';
import GoogleOAuth from '../components/GoogleOAuth';
import photo from '../assets/loginn.png';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password Not matched');
      return;
    }

    dispatch(setSignupData(formData));
    dispatch(sendOtp(formData.email, navigate));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-richblack-700 p-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-8 max-w-5xl w-full rounded-2xl">
        {/* Left Side: Sign Up Form */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-semibold my-7 text-yellow-50">
            Create Your Account
          </h1>
          <p className="mb-4 text-lg text-yellow-500 italic">
            Join us and unlock your potential.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label
                htmlFor="userName"
                className="text-base text-richblack-5 mb-1 block"
              >
                Username <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="text"
                required
                placeholder="Username"
                className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
                id="userName"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-base text-richblack-5 mb-1 block"
              >
                Email <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="email"
                required
                placeholder="Email"
                className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
                id="email"
                onChange={handleChange}
              />
            </div>

            {/* Password and Confirm Password */}
            <div className="flex gap-3">
              {/* Password */}
              <div className="relative w-1/2">
                <label
                  htmlFor="password"
                  className="text-base text-richblack-5 mb-1 block"
                >
                  Password <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
                  id="password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-12 right-3 text-richblack-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="text-base text-richblack-5 mb-1 block"
                >
                  Confirm Password <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
                  id="confirmPassword"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-12 right-3 text-richblack-5"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="bg-yellow-50 py-2 px-4 rounded-md mt-6 font-semibold text-richblack-900 hover:opacity-90"
            >
              {loading ? 'Loading ...' : 'Sign Up'}
            </button>

            <GoogleOAuth />
          </form>

          {/* Or Divider */}
          <div className="flex items-center gap-x-2 my-4">
            <div className="h-[1px] bg-richblack-800 flex-grow"></div>
            <p className="uppercase text-richblack-800 font-medium text-sm">
              or
            </p>
            <div className="h-[1px] bg-richblack-800 flex-grow"></div>
          </div>

          {/* Sign In Link */}
          <div className="flex items-center gap-x-2 mt-4">
            <p className="text-richblack-5">Have an account?</p>
            <Link to="/sign-in">
              <span className="text-yellow-700 hover:underline">Sign In</span>
            </Link>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <img
            src={photo}
            alt="Sign Up"
            className="rounded-md w-full max-w-md object-cover shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
