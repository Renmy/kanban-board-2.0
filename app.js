const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongoose.config.js");
const boardRouter = require("./routes/board.routes.js");
const taskRouter = require("./routes/task.routes.js");
const authRouter = require("./routes/auth.routes.js");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
//Defining the routes
app.use("/api/boards", boardRouter);
app.use("/api/tasks", taskRouter);
app.use("/auth", authRouter);

//All code before this point
app.listen(process.env.PORT, () => {
  console.clear();
  connectDB();
  console.log(`Server listening on port ${process.env.PORT}`);
});
