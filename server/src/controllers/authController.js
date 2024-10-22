import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import admin from '../models/admin.js';

    const  customError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const register = async (req, res) => {
    const { name, email, password, whatsappNumber } = req.body;
  
    try {
      // Hash password before saving
  
     
        // Register as normal user
       const newUser = await User.create({
          name,
          email,
          password,
          whatsappNumber,
          role: 'user',  // Set role as user
        });
      
  
      res.status(201).json({ message: "Registration successful!", user: newUser });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the normal User schema
    let user = await User.findOne({ email });

    // If not found in User schema, check Admin schema
    if (!user) {
      user = await admin.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Check if the password is correct
  

    // Generate JWT Token
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        isAdmin: user.role === 'admin',  // Check if user is admin
      },
      process.env.JWT_SECRET || "5347",  // Use environment variable for secret
      { expiresIn: age }
    );

    // Remove password from user info
    const { password: userPassword, ...userInfo } = user._doc;

    // Send the token as a cookie and return user info
    res.cookie("token", token, {
      maxAge: age,
 
      sameSite: 'Lax',
    }).status(200).json(userInfo);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};
// @desc Get user data
export const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = req.user;
    res.status(200).json({
        id: _id,
        name,
        email
    });
});

 const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const getUsers= async (req,res) => {
    const response = await User.find();
    res.status(200).json(response)
}

// @desc Logout user
export const logout = (req, res) => {
  // Clear the token cookie using clearCookie
  res.clearCookie("token", {
    // httpOnly: true,    // Ensure it's an httpOnly cookie
    sameSite: 'Lax',   // Ensure the sameSite policy is maintained
  });

  res.status(200).json({ message: "Logout successful!" });
};
