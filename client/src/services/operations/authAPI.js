import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../redux/user/authSlice"
// import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../redux/user/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"
import { signInSuccess } from "../../redux/user/userSlice"
import { signOutUserStart,signOutUserFailure,signOutUserSuccess } from "../../redux/user/userSlice"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  LOGOUT_API
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
        console.log("1");
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("2");
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  
 userName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
      userName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.dismiss(toastId)
      toast.success("Signup Successful")
      navigate("/sign-in")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error.response.data.message)
      console.log(error);
      toast.error(error.response.data.message)
      navigate("/sign-up")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true)) 
   
    try { 
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })
      console.log(response);
      console.log("1");
     
      console.log("2");

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      console.log(response);
      dispatch(signInSuccess(response.data.user))
      dispatch(setUser(response.data));
      
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      navigate("/")
    } catch (error) { 
       dispatch(setLoading(false))
    toast.dismiss(toastId)
    console.log(error);
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed")
    }  
  
  }
}

export function logout(navigate) {
  return async(dispatch) => {
    console.log("1");

    try {
      dispatch(signOutUserStart());
      console.log("22");
      const res= await apiConnector("GET",LOGOUT_API);
      const data= res.data;
      console.log("in logout function", res);
      if(data.success==false){
        toast.error(data.message);
        dispatch(signOutUserFailure(data.message));
        return;
      }
      console.log("3");
      toast.success(data.message);
      dispatch(setToken(null))
    dispatch(setUser(null))
    // dispatch(resetCart())
    localStorage.removeItem("persist:root")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
      dispatch(signOutUserSuccess(data));
      
    navigate("/")
      
    } catch (error) {
        toast.error("Logout Failure");
        console.log(error);
      dispatch(signOutUserFailure(error.message));
      
    }





    
  
  }
}

export function getPasswordResetToken( email, setEmailSent){
  return async (dispatch)=>{
    // loading= true;
    dispatch(setLoading(true));
    try {
      const response= await apiConnector("POST",RESETPASSTOKEN_API,{email});

      console.log("Reset password respnse callded",response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      dispatch(setLoading(false));

      toast.success("Reset Email Sent");
      setEmailSent(true);
      
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
      
    }

  }

}

export function resetPassword(password, confirmPassword,token){

 return async(dispatch)=>{
  dispatch(setLoading(true));
  try {

    const response= await apiConnector("POST",RESETPASSWORD_API,{
      password,
      confirmPassword,
      token
    });
    console.log("REset password response",response);
    if(!response.data.success){
      toast.error(response.data.message);
      // navigate("/login")
      throw new Error(response.data.message);
    }
    dispatch(setLoading(false))
    toast.success(response.data.message);
    // navigate("/login")
    
    
  } catch (error) {
    dispatch(setLoading(false));
    console.log("Error in reseting password",error.response);
   
    toast.error(error.message)
    //  navigate("/login")
    
  }
 }

}

