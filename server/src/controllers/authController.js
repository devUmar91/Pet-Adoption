import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Admin from '../models/admin.js';

    const  customError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const register = async (req, res) => {
    const { name, email, password, contact ,role} = req.body;
  
    try {
      // Hash password before saving
  
      const hashedPassword = await bcrypt.hash(password, 10);

        // Register as normal user
       const newUser = await User.create({
          name,
          email,
          password:hashedPassword,
          contact,
          role,  // Set role as user
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
    // Check if the user exists
    let user = await User.findOne({ email });
    // console.log(user);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Check if the password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Logic for admin users
    if (user.role === "admin") {
      // Check if the admin already exists
      let admin = await Admin.findOne({ email: user.email });
    //  res.status(200).json(admin)
      // If admin does not exist, create one
      

      const age = 1000 * 60 * 60 * 24 * 7; // 7 days
      const token = jwt.sign(
        {
          email: user.email,
          name: user.name,
          _id: user._id,
          role: user.role,  // Admin check for JWT
        },
        process.env.JWT_SECRET || "5347",  // Use environment variable for secret
        { expiresIn: age }
      );

      // Remove password from user info
      const { password: userPassword, ...userInfo } = user._doc;

      // Send token as a cookie and return user info
      return res
        .cookie("token", token, {
          maxAge: age,
          sameSite: 'Lax',
        })
        .status(200)
        .json(userInfo);
    }

    // If user is not admin (regular user logic)
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role // Regular user
      },
      process.env.JWT_SECRET || "5347",  // Use environment variable for secret
      { expiresIn: age }
    );

    // Remove password from user info
    const { password: userPassword, ...userInfo } = user._doc;

    // Send token as a cookie and return user info
    res
      .cookie("token", token, {
        maxAge: age,
        sameSite: 'Lax',
      })
      .status(200)
      .json(userInfo);
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
