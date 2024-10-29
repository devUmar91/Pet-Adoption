import express from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet, getMyPets, getFilteredPets, getByCity } from '../controllers/petController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPets);
router.get('/myPets',protect,getMyPets)
router.get('/:id', getPetById);
router.post('/post', protect, createPet);  // Protected so only logged-in users can post
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);
router.get('/filter', getFilteredPets); // New route for filtering by city and category
router.get('/city',getByCity)


export default router;
