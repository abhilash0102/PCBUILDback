// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Add user from payload to req object
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };




// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    // For bypass: Just set a default user ID instead of returning an error
    req.user = { id: 'bypass-auth-user' };
    return next();
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // For bypass: Don't return error, just set a default user
    req.user = { id: 'bypass-auth-user' };
    next();
  }
};