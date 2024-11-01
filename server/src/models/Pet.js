import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  name: { type: String, },
  breed: { type: String,  },
  age: { type: String, },
  description: { type: String,  },
  images: { 
    type: [String],  // Array of strings
    // required: true 
},  // Array for multiple images
  contact: { type: Number,  },
  adoptionStatus: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available',
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Automatically reference the User model
  city: { type: String,  },
  category: { type: String, }
});

const Pet = mongoose.model('Pet', PetSchema);
export default Pet;
