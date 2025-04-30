import express from 'express'
import { createListing, deleteListing,updateListing ,getListing,getAllListings} from '../controllers/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getOtherUsers } from '../controllers/chatController.js';

const router= express.Router();

router.post('/create',verifyToken,createListing); 
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing);
router.get('/get/:id',getListing);
router.get('/get',getAllListings);
router.get('/users',getOtherUsers);
export default router; 