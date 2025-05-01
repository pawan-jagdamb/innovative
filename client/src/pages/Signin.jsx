import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/operations/authAPI";
import { toast } from "react-hot-toast";
import GoogleOAuth from "../components/GoogleOAuth";
import signInPhoto from "../assets/group1.png"; // updated to match the first code

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-richblack-900 px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-xl p-6 lg:p-10 flex flex-col lg:flex-row gap-8 max-w-5xl w-full rounded-xl">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Login
          </h2>
          <p className="text-center text-lg text-white mb-6">
          Log in to access your accoun
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-white mb-1 block">
                Email Address <sup className="text-red-500">*</sup>
              </label>
              <input
                type="email"
                required
                id="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="text-sm text-white mb-1 block">
                Password <sup className="text-red-500">*</sup>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="border-b bg-richblack-800 rounded-md text-richblack-5 w-full p-3 placeholder:text-richblack-300 focus:ring-2 focus:ring-yellow-500"
              />
              <span
                className="absolute right-3 top-9 text-richblack-100 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            {/* Forgot Password */}
            {/* <div className="text-right text-sm">
              <Link to="/forgot-password" className="text-white-100 hover:underline">
                Forgot Password?
              </Link>
            </div> */}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-richblack-900 font-semibold py-2 rounded transition duration-200"
            >
              {loading ? "Signing In..." : "Login Now"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-center mt-5 text-white">
            Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-red-500 font-semibold hover:underline"
            >
              Sign Up Now
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/30"></div>
            <span className="mx-2 text-sm text-white">or</span>
            <div className="flex-grow border-t border-white/30"></div>
          </div>

          {/* Google OAuth */}
          <div className="flex justify-center">
            <GoogleOAuth />
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src={signInPhoto}
            alt="Sign In Visual"
            className="rounded-xl shadow-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
