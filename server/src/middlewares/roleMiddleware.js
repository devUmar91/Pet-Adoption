// // Middleware to verify if the user is an admin
// export const verifyAdmin = (req, res, next) => {
//     const user = req.user;  // Assuming user is authenticated and req.user is populated
  
//     if (user && user.role === 'admin') {
//       next();  // If user is admin, proceed to the next middleware
//     } else {
//       res.status(403).json({ message: 'Access denied! Admins only.' });
//     }
//   };
  