const express = require("express");
const router = express.Router();

//Importing the controllers
const authorizeUser = require("../middlewares/authMiddleware");
const {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
} = require("../controllers/chatControllers");

router.route("/").post(authorizeUser, accessChat);
router.route("/").get(authorizeUser, getChats);
router.route("/group").post(authorizeUser, createGroupChat);
router.route("/group/rename").put(authorizeUser, renameGroupChat);
// router.route("group/remove").put(authorizeUser, removeFromGroup);
// router.route("group/add").put(authorizeUser, addToGroup);

module.exports = router;
