const { mongoose } = require("mongoose");

module.exports = connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB: " + connection.connections[0].name);
  } catch (error) {
    console.log(error);
  }
};
