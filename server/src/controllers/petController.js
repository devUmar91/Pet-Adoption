// const Pet = require('../models/Pet');
import admin from "../models/admin.js";
import Pet from "../models/Pet.js";

export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pets' });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pet' });
  }
};

export const createPet = async (req, res) => {
  const { name, breed, age, description, image, adoptionStatus, adminEmail } = req.body;

  try {
    const admin = await admin.findOne({ email: adminEmail });
    console.log(admin)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const pendingPost = { name, breed, age, description, image, adoptionStatus };

    // Add post to admin's pendingPosts
    admin.pendingPosts.push(pendingPost);

    await admin.save();

    res.status(201).json({ message: 'Post sent to admin for approval' });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pet);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


export const deletePet = async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pet' });
  }
};
