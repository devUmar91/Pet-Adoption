// const express = require('express');
import express from 'express';
// const { getPets, getPetById, createPet, updatePet, deletePet } = require('../controllers/petController');
import { getPets,getPetById,createPet,updatePet,deletePet } from '../controllers/petController.js';
// const { protect } = require('../middlewares/authMiddleware');
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/',protect, getPets);
router.get('/:id', getPetById);
router.post('/post', createPet);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);


export default router;
