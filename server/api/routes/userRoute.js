import express from 'express'
import {deleteUser, test, updateUserInfo,getUserListings} from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyUser.js';
import { resetPasswordToken } from '../controllers/ResetPassword.js';
const router= express.Router();


router.get('/test',test);
// router.post('/reset-password-token',resetPasswordToken)
console.log("second")
router.post('/update/:id',verifyToken,updateUserInfo);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListings)


export default router; 