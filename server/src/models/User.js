import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// // User Schema definition
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // Email must be unique
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default:true,
//     enum: ['user', 'admin'],
   
//   },
// });

// // Hash the password before saving a user
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });


// // Method to compare passwords for login
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', UserSchema);
// export default User;


// new code
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



const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // contact: { type: Number, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }], // Reference to the Pet model
pendingPosts: [postSchema]
});

// Hash the password before saving a user
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare passwords for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
