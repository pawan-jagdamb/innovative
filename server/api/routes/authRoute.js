import express from 'express'
import { signup ,signin, google, signOut} from '../controllers/authController.js';
import { resetPasswordToken } from '../controllers/ResetPassword.js';
import { resetPassword } from '../controllers/ResetPassword.js';
import { sendOTP } from '../controllers/authController.js';
const router= express.Router();
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get("/signout",signOut);
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);
router.post("/sendotp",sendOTP);

export default router;