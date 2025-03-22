const BASE_URL= "http://localhost:5000/api"
  

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/signin",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    LOGOUT_API: BASE_URL+"/auth/signout",
    CREATE_LISTING:BASE_URL+ '/listing/create',
    SHOW_LISTING:BASE_URL+ '/user/listings/'
  }
