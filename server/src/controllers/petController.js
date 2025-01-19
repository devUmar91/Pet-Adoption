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
    const { name, breed, age, description, images, contact, city, category } = req.body; // Ensure city and category are included
    const userId = req.user.id;
     console.log(userId);
     
    if (!name || !breed || !age || !description || !images || !contact || !city || !category) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newPet = {
            name,
            breed,
            age,
            description,
            images: images.length ? images : ["https://via.placeholder.com/150"],
            contact: Number(contact),  // Ensure this is a number
            city,                      // This should be defined
            category,                  // This should be defined
            adoptionStatus: 'pending',
            userId,
        };

        console.log("New Pet Object:", newPet);

        const admin = await Admin.findOne();
        if (admin) {
            console.log("Admin Before Adding Pet:", admin);

            // Push the newPet object directly
            admin.pendingPosts.push(newPet);

            await admin.save();
            console.log("Admin After Save:", admin);
            res.status(201).json({ message: 'Pet submitted for approval' });
        } else {
            return res.status(404).json({ message: 'Admin not found' });
        }

    } catch (err) {
        console.error("Error in createPet:", err);
        res.status(500).json({ message: 'Error creating pet', error: err.message });
    }
};

  
  export const getFilteredPets = async (req, res) => {
    const { city } = req.body;
    console.log(city);
      
  
    // const filter = {};
    // if (city) filter.city = city;
    // if (category) filter.category = category;
  
    // try {
    //   const pets = await Pet.find(filter);
    //   res.status(200).json(pets);
    // } catch (err) {
    //   res.status(500).json({ message: 'Error fetching filtered pets', error: err.message });
    // }
  };
  

 
  

// Route
// router.post('/filteredByCity', getByCity);

// Controller
export const getByCity = async (req, res) => {
  const { city } = req.body; // Get city from the body
  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    const pets = await Pet.find({ city: new RegExp(`^${city}$`, "i") }); // Case-insensitive match
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets by city:", error);
    res.status(500).json({ message: 'Error fetching pets by city' });
  }
};


export const getAllCitiesAndCategories = async (req, res) => {
  try {
    const cities = await Pet.aggregate([
      { $group: { _id: "$city" } },
      { $sort: { _id: 1 } }, // Sort alphabetically, optional
    ]);

    const categories = await Pet.aggregate([
      { $group: { _id: "$category" } },
      { $sort: { _id: 1 } },
    ]);

    // Map the result to return only the values in a cleaner format
    const cityList = cities.map((item) => item._id);
    const categoryList = categories.map((item) => item._id);

    res.status(200).json({ cities: cityList, categories: categoryList });
  } catch (error) {
    console.error("Error fetching cities and categories:", error);
    res.status(500).json({ message: "Error fetching cities and categories" });
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


