// const Pet = require('../models/Pet');
import Admin from "../models/admin.js";
import Pet from "../models/Pet.js";

export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    // const pets = await Pet.find({ city: /^lahore$/i }); // Hard-coded to find pets in Lahore, case-insensitive

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

  // Working code

  // export const createPet = async (req, res) => {
  //   const { name, breed, age, description, image, contact, city, category } = req.body;
  //   const userId = req.user.id; // Ensure your token includes the user ID
  
  //   if (!name || !breed || !age || !description || !image || !city || !category) {
  //     return res.status(400).json({ message: 'All fields are required' });
  //   }
  
  //   try {
  //     const newPet = {
  //       name,
  //       breed,
  //       age,
  //       description,
  //       image,
  //       contact,
  //       city,
  //       category,
  //       adoptionStatus: 'pending',
  //       userId,
  //     };
  
  //     const admin = await Admin.findOne(); // Get the admin document
  //     if (admin) {
  //       admin.pendingPosts.push(newPet);
  //       await admin.save();
  //       res.status(201).json({ message: 'Pet submitted for approval' });
  //     } else {
  //       res.status(404).json({ message: 'Admin not found' });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Error creating pet', error: err.message });
  //   }
  // };
  

  // new Code 

  export const createPet = async (req, res) => {
    const { name, breed, age, description, images, contact, city, category } = req.body; // Ensure city and category are included
    const userId = req.user.id;

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
    const { city, category } = req.query;
  console.log(city);
      
  
    const filter = {};
    if (city) filter.city = city;
    if (category) filter.category = category;
  
    try {
      const pets = await Pet.find(filter);
      res.status(200).json(pets);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching filtered pets', error: err.message });
    }
  };
  

 
  
 // controllers/petsController.js
// import Pet from "../models/Pet.js";

// export const getByCity = async (req, res) => {
//   const { city } = req.query;
//    console.log(city);
   
//   try {
//     const pets = await Pet.find({ city: new RegExp(`^${city}$`, "i") }); // Case-insensitive match
//     res.status(200).json(pets);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching pets by city'});
//   }
// };


export const getByCity = async (req, res) => {
  const { city } = req.query; // Get the city parameter from the query string

  try {
    let query = {}; // Initialize an empty query

    // If a city is provided, add it to the query (case-insensitive)
    if (city) {
      query.city = new RegExp(`^${city}$`, "i"); // Using a regex for case-insensitivity
    }

    const pets = await Pet.find({ city: query.city}); // Hard-coded to find pets in Lahore, case-insensitive
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: 'Error fetching pets' });
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
