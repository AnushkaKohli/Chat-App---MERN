const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const authorizeUser = asyncHandler(async (req, res, next) => {
  let token;

  //Token looks something like: Bearer jkhcsdhch...
  // Check if token is sent and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split the token and get the second part
      token = req.headers.authorization.split(" ")[1];

      // Decode the token and get the user id
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the database and remove the password
      req.user = await User.findById(decodedToken.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If token is not sent
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = authorizeUser;
