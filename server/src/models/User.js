import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema definition
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default:true,
    enum: ['user', 'admin'],
   
  },
});

// Hash the password before saving a user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Method to compare passwords for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
