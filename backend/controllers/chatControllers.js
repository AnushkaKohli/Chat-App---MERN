const asyncHandler = require("express-async-handler");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  //fetching the user id who is currently chatting with the logged in user
  const { userId } = req.body;

  /* This code block is checking if the `userId` parameter is missing or not sent with the request. */
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    //to find both the users ie the user that is currently logged in (req.user._id) and the user whose id has been given (userId)
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    /* This is used to populate the `users` field in the `Chat` model with the user data, excluding the `password` field. */
    .populate("users", "-password")
    /* This is used to populate the `latestMessage` field in the `Chat` model with the actual message data. */
    .populate("latestMessage");

  //We are trying to populate the semder field of the messageModel with the user data such as name, displayPicture and email
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name displayPicture email",
  });

  /* This is checking if there is an existing chat between the logged-in user and the user with the given `userId`. */
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

module.exports = { accessChat };
