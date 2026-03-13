const jwt = require("jsonwebtoken");

const authMiddleware = (req) => {

 const token = req.headers.authorization;

 if (!token) {
  throw new Error("No token provided");
 }

 const decoded = jwt.verify(token, process.env.JWT_SECRET);

 return decoded;

};

module.exports = authMiddleware;