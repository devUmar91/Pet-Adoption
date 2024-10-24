import express from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/post', protect, createPet);  // Protected so only logged-in users can post
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);

export default router;
