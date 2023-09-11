const express = require("express");
const dotenv = require("dotenv");

const chats = require("./data/data");
const connectDatabase = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

/* It is creating an instance of the Express application. It initializes the app variable with the Express module, allowing us to use the various functionalities provided by Express to build our web application. */
const app = express();

/* dotenv.config(); is a function provided by the `dotenv` module in Node.js. It loads the environment variables from a `.env` file into the `process.env` object. The `.env` file contains key-value pairs of environment variables that are specific to the application. By calling `dotenv.config()`, the application can access these environment variables throughout its code. */
dotenv.config();

/* cors module is a middleware for enabling Cross-Origin Resource Sharing (CORS) in the Express application. */
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

connectDatabase();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//If any of the url is not found then this function is invoked
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  // It will wait for 60 seconds before disconnecting the user to save the bandwidth
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

/* This is setting up a listener for the "connection" event in the Socket.IO library. */
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  /* This sets up a listener for the "setup" event in the Socket.IO library. */
  socket.on("setup", (userData) => {
    /* This is joining the socket to a specific room identified by the `userData._id`. */
    socket.join(userData._id);
    console.log(userData._id);
    /* This is emitting a "connected" event to the client that is connected to the socket. This event can be listened to on the client-side to perform certain actions or update the UI when the socket connection is established. */
    socket.emit("connected");
  });

  /* This is setting up a listener for the "join chat" event in the Socket.IO library. */
  socket.on("join chat", (room) => {
    /* The `socket.join(room)` function is used to make the socket join a specific room in Socket.IO. */
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    // to check which chat does this message belong to
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    // the chat should go to rest of the users except me
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      // emit the message recevived socket. This is received by the client side
      /* This is emitting a "message received" event to a specific user identified by their `_id` in the Socket.IO room. */
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected from socket.io");
    socket.leave(userData._id);
  });
});
