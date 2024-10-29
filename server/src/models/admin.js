import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    description: { type: String, required: true },
    images: { 
        type: [String],  // Array of strings
        // required: true 
    },    
       // Array for multiple images
    contact: { type: Number, required: true },
    city: { type: String, }, // New field for city
    category: { type: String,  }, // New field for category
    adoptionStatus: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    }
  });


   const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    pendingPosts: [postSchema] // Reference to the post schema
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;