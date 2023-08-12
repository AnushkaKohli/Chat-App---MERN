const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `MongoDB Database connected with server: ${data.connection.host}`
      );
    })
    .catch((error) => {
      console.log(`Error: ${error.message}`);
      process.exit();
    });
};

module.exports = connectDatabase;
