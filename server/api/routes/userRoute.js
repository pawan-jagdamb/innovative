import express from 'express'
import {deleteUser, test, updateUserInfo} from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyUser.js';
import { resetPasswordToken } from '../controllers/ResetPassword.js';
const router= express.Router();


router.get('/test',test);
// router.post('/reset-password-token',resetPasswordToken)

router.post('/update/:id',verifyToken,updateUserInfo);
router.delete('/delete/:id',verifyToken,deleteUser);


export default router; 