const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    ;const connection = await mongoose.connect(process.env.MONGODB_URI, {
  family: 4,
});

    console.log(
      `✅ MongoDB Connected and live: ${connection.connection.host}`
    );
  }  catch (error) {
  console.error(error.name);
  console.error(error.message);
  console.error(error);
}
};

module.exports = connectDB;