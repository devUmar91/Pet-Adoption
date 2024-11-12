import jwt from 'jsonwebtoken';

// Middleware to protect routes (for both users and admins)
export const protect = (req, res, next) => {
  // Check for token in cookies or in the Authorization header
  let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  // console.log('Token:', token);
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "5347");
    req.user = decoded;
    console.log('User:', req.user);
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "5347");
    //  console.log(decoded);

    req.user = decoded;

    
    if (decoded.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
