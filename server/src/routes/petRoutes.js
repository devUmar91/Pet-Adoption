import express from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet, getMyPets, getByCity, getAllCitiesAndCategories } from '../controllers/petController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPets);
router.get('/myPets',protect,getMyPets)
router.get('/:id', getPetById);
router.post('/post', protect, createPet);  // Protected so only logged-in users can post
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);
router.post('/filteredByCity',getByCity)// Route to get all unique cities and categories
router.get('/citiesAndCategories', getAllCitiesAndCategories);



export default router;
