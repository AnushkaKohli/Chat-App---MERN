const express = require("express");
const router = express.Router();

//Importing the controllers
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userControllers");
const authorizeUser = require("../middlewares/authMiddleware");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(authorizeUser, allUsers);

module.exports = router;
