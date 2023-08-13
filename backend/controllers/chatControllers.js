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

const getChats = asyncHandler(async (req, res) => {
  try {
    //Go through the entire Chat collection and find the chats where the logged in user is present or is a part of
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name displayPicture email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      message: "Please enter a chat name and select atleast one user",
    });
  }

  /* This is parsing the `users` property from the request body, which is expected to be a JSON string. It converts the JSON string into a JavaScript object and assigns it to the `users` variable. This allows you to access and manipulate the user data as an object instead of a string. */
  var users = JSON.parse(req.body.users);

  //To make sure that there are atleast 2 users in the group chat
  if (users.length < 2) {
    return res.status(400).send({
      message: "At least two users are required for group chat",
    });
  }

  //To automatically add the logged in user to the group chat
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    res.status(400);
    throw new Error("User not added to group");
  } else {
    res.json(addedUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    res.status(400);
    throw new Error("User not removed from group");
  } else {
    res.json(removedUser);
  }
});

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
