import express from 'express';
// import { getPendingPosts, approvePet, rejectPet } from '../controllers/adminController.js';
import {getPendingPosts,approvePet,rejectPet, getAllUsers ,deletePet} from '../controllers/adminController.js'
import { verifyAdmin } from '../middlewares/authMiddleware.js';
// import { deletePet } from '../controllers/petController.js';

const router = express.Router();

// Route to get all pending posts for admin
router.get('/pending-posts', verifyAdmin, getPendingPosts);


// Route to approve a pending post
router.put('/approve/:postId', verifyAdmin, approvePet);

// Route to reject a pending post
router.delete('/reject/:postId', verifyAdmin, rejectPet);

router.delete('/deletePet/:postId',verifyAdmin,deletePet);

// Route to get all users
router.get('/users', verifyAdmin, getAllUsers); // New route to fetch all users


export default router;
