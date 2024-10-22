import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  let token = req.cookies.token;
  console.log(token)
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token not valid' });
  }
};
