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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//If any of the url is not found then this function is invoked
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started at port 5000");
});
