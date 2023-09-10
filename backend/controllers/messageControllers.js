const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  // chatId to send the message at, the message itself and the sender of the message
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("No message content or chat id");
    return res.sendStatus(400);
  }
  // These are the fields that will be saved in the database as they are required in the message model we created
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    // Query the database to create a new message
    var message = await Message.create(newMessage);
    // Populate the sender with name and display picture
    // So we are populating the instance of the mongoose class "message" with the "sender" field, and we are specifying the fields we want to populate it with, which are "name" and "displayPicture". The "execPopulate()" method is used to populate the document's specified path with the referenced document(s) from other collections. In this case, it is used to populate the "sender" field of the message document with the corresponding user's name and display picture.
    message = await message.populate("sender", "name, displayPicture");
    // message = await message.populate("chat").execPopulate();
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name displayPicture email",
    });

    // Find the chat by id and update the chat with latest message
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Invalid message data");
  }
});

const getAllMessagesOfChat = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name displayPicture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Invalid message data");
  }
});

module.exports = {
  sendMessage,
  getAllMessagesOfChat,
};
