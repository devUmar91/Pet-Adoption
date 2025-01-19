  // import Admin from '../models/adminModel.js';
  import Admin from '../models/admin.js';
  // import Pet from '../models/petModel.js';
  import Pet from '../models/Pet.js';

  export const getPendingPosts = async (req, res) => {
    //  const {name}=req.body;

    // try{

    //   const Admin=await Admin.fine(user.name)
    // }catch{
    //   res.json(Admin)
    // }
    try {

      const admin = await Admin.findOne({}, 'pendingPosts'); // Find the admin and get only the pendingPosts field
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json(admin.pendingPosts); // Send only the pending posts
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending posts' });
    }
  };
    // Working logic
    // export const approvePet = async (req, res) => {
    //   const { postId } = req.params;
    
    //   try {
    //     // Find the admin to get the pending post
    //     const admin = await Admin.findOne();
    //     if (!admin) {
    //       return res.status(404).json({ message: 'Admin not found' });
    //     }
    
    //     // Find the post in the admin's pending posts
    //     const postIndex = admin.pendingPosts.findIndex(post => post._id.toString() === postId);
    //     if (postIndex === -1) {
    //       return res.status(404).json({ message: 'Post not found in pending posts' });
    //     }
    
    //     // Extract the post details
    //     const petDetails = admin.pendingPosts[postIndex];
    //     console.log("In Admin controller, User ID:", petDetails);
    
    //     // Create a new Pet document with the approved details
    //     const newPet = await Pet.create({
    //       name: petDetails.name,
    //       breed: petDetails.breed,
    //       age: petDetails.age,
    //       description: petDetails.description,
    //       image: petDetails.image,
    //       contact: petDetails.contact,
    //       adoptionStatus: 'available',
    //       // userId: petDetails.userId,
    //     });
    
    //     // Find the user and add pet ID to their posts array
    //     const user = await User.findById(petDetails.userId);
    //     if (!user) {
    //       return res.status(404).json({ message: 'User not found' });
    //     }
    
    //     user.pets.push(newPet); // Add the new pet to the user's pets array
    //     await user.save();
    
    //     // Remove the post from the admin's pending posts
    //     admin.pendingPosts.splice(postIndex, 1);
    //     await admin.save();
    
    //     res.status(200).json({ message: 'Pet approved and is now available for adoption', pet: newPet });
    //   } catch (error) {
    //     console.error(error); // Log the error for debugging
    //     res.status(500).json({ message: 'Error approving the pet', error: error.message });
    //   }
    // };


    // New code
    export const approvePet = async (req, res) => {
      const { postId } = req.params;
      console.log('Post ID:', postId); // Log the postId for debugging

      try {
        const admin = await Admin.findOne();
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        const postIndex = admin.pendingPosts.findIndex(post => post._id.toString() === postId);
        if (postIndex === -1) {
          return res.status(404).json({ message: 'Post not found in pending posts' });
        }
    
        const petDetails = admin.pendingPosts[postIndex];
        console.log('Pet Details to Approve:', petDetails); // Log the pet details for debugging
    
        // Ensure all required fields are present
        if (!petDetails.name || !petDetails.breed || !petDetails.age || !petDetails.description || 
            !petDetails.images || !petDetails.contact || !petDetails.city || !petDetails.category) {
          return res.status(400).json({ message: 'Missing required pet details' });
        }
    
        // Create the pet in the Pet collection
        const newPet = await Pet.create({
          name: petDetails.name,
          breed: petDetails.breed,
          age: petDetails.age,
          description: petDetails.description,
          images: petDetails.images,  // Ensure images is an array of strings
          contact: petDetails.contact,
          city: petDetails.city,
          category: petDetails.category,
          adoptionStatus: 'available',
          userId: petDetails.userId,
        });
        
        // console.log('New Pet Created:', newPet); // Log the newly created pet
            
        // Find the user and add the new pet to the user's pets array
        const user = await User.findById(petDetails.userId);
        if (user) {
         user.pets.push(newPet); // Use _id of newPet created in Pet collection
        await user.save();
      } else {
       console.warn('User not found to update pets array', petDetails.userId); // Log userId if user is not found
}
    
        // Remove the pet from the admin's pending posts
        admin.pendingPosts.splice(postIndex, 1);
        await admin.save();
    
        res.status(200).json({ message: 'Pet approved and now available for adoption', pet: newPet });
      } catch (error) {
        console.error('Error in approvePet:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error approving the pet', error: error.message });
      }
    };
    
    
    




  // Optional: To reject a post
  
  // export const approvePet = async (req, res) => {
  //   const { postId } = req.params;
  
  //   try {
  //     // Find the admin to get the pending post
  //     const admin = await Admin.findOne();
  //     if (!admin) {
  //       return res.status(404).json({ message: 'Admin not found' });
  //     }
  
  //     // Find the post in the admin's pending posts
  //     const postIndex = admin.pendingPosts.findIndex(post => post._id.toString() === postId);
  //     if (postIndex === -1) {
  //       return res.status(404).json({ message: 'Post not found in pending posts' });
  //     }
  
  //     // Extract the post details
  //     const petDetails = admin.pendingPosts[postIndex];
  
  //     // Find the user who submitted this post (assuming you are storing user reference in pendingPosts)
  //     const user = await User.findById(petDetails._id); // Assuming you have userId stored in pendingPosts
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     // Create a new Pet document with the approved details
  //     const newPet = await Pet.create({
  //       name: petDetails.name,
  //       breed: petDetails.breed,
  //       age: petDetails.age,
  //       description: petDetails.description,
  //       image: petDetails.image,
  //       contact: petDetails.contact, // Ensure this is included
  //       adoptionStatus: 'available', // Approve pet
  //     });
  
  //     // Add the new pet to the user's posts array
  //     user.posts.push(newPet._id);
  //     await user.save();
  
  //     // Remove the post from the admin's pending posts
  //     admin.pendingPosts.splice(postIndex, 1); // Remove the post from the array
  //     await admin.save();
  
  //     res.status(200).json({ message: 'Pet approved and is now available for adoption', pet: newPet });
  //   } catch (error) {
  //     console.error(error); // Log the error for debugging
  //     res.status(500).json({ message: 'Error approving the pet', error: error.message });
  //   }
  // };
  


  export const rejectPet = async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Fetch the admin
      const admin = await Admin.findOne();
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      // Remove the pet from pending posts
      admin.pendingPosts = admin.pendingPosts.filter(
        (post) => post._id.toString() !== postId.toString()
      );
      
      await admin.save(); // Save the updated admin document
  
      res.status(200).json({ message: "Pet rejected and removed from pending posts" });
    } catch (error) {
      console.error("Error rejecting the pet:", error);
      res.status(500).json({ message: "Error rejecting the pet" });
    }
  };
  

  
  

  import User from '../models/User.js'; // Import your User model

  // Function to get all users
  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };


  // Import necessary models


// Delete a pet by ID, only accessible to admin
export const deletePet = async (req, res) => {
  const { postId } = req.params; // ID of the pet to delete
  console.log(postId);
  try {
    // Find the pet by its ID
    const pet = await Pet.findByIdAndDelete(postId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Delete the pet from the database
    // await pet.remove();

    // Notify the pet's owner (if applicable)
    // const owner = await User.findById(pet._id); // Assuming `ownerId` is stored in the `Pet` model
    // if (owner) {
    //   await owner.notifications.push({
    //     message: `Your pet "${pet.name}" has been deleted by an admin.`,
    //   });
    //   await owner.save();
    // }

    res.status(200).json({ message: 'Pet successfully deleted' });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: 'Error deleting pet', error: error.message });
  }
};
