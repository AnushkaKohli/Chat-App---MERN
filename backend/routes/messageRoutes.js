const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessagesOfChat,
} = require("../controllers/messageControllers");
const authorizeUser = require("../middlewares/authMiddleware");

router.route("/").post(authorizeUser, sendMessage);
router.route("/:chatId").get(authorizeUser, getAllMessagesOfChat);

module.exports = router;
