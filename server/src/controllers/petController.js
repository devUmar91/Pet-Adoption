// const Pet = require('../models/Pet');
import Admin from "../models/admin.js";
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

  //  old code
// export const createPet = async (req, res) => {
//   const { name, breed, age, description, image, adoptionStatus, adminEmail } = req.body;

//   try {
//     const admin = await admin.findOne({ email: adminEmail });
//     console.log(admin)
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     const pendingPost = { name, breed, age, description, image, adoptionStatus };

//     // Add post to admin's pendingPosts
//     admin.pendingPosts.push(pendingPost);

//     await admin.save();

//     res.status(201).json({ message: 'Post sent to admin for approval' });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// }

  // new code

  export const createPet = async (req, res) => {
    const { name, breed, age, description, image,contact } = req.body;
    
    if (!name || !breed || !age || !description || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const newPet = ({
        name,
        breed,
        age,
        description,
        image,
        contact,
        adoptionStatus: 'pending',
      });
  
      const admin = await Admin.findOne(); // Get the admin document
      if (admin) {
        admin.pendingPosts.push({
          name: newPet.name,
          breed: newPet.breed,
          age: newPet.age,
          description: newPet.description,
          image: newPet.image,
          contact: newPet.contact, // Make sure to include contact if required
          adoptionStatus: newPet.adoptionStatus,
        });
        await admin.save();
      } else {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(201).json({ message: 'Pet submitted for approval' });
    } catch (err) {
      console.error(err); // Log the actual error for debugging
      res.status(500).json({ message: 'Error creating pet', error: err.message });
    }
  };
  
  
  

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


// Controller to get pets of the logged-in user
export const getMyPets = async (req, res) => {
  try {
    // Assuming the user's contact information is available in the request (from JWT token or session)
    const userEmail = req.user?.email; // Assuming the contact is in req.user, adjust as necessary

    if (!userEmail) {
      return res.status(400).json({ message: 'User contact is required' });
    }

    // Find all pets associated with the user's contact
    const userPets = await Pet.find({ email: userEmail });

    // Check if any pets were found
    if (!userPets.length) {
      return res.status(404).json({ message: 'No pets found for this user' });
    }

    // Return the pets associated with the user
    res.json(userPets);
  } catch (err) {
    console.error('Error fetching user pets:', err);
    res.status(500).json({ message: 'Error fetching user pets', error: err.message });
  }
};
