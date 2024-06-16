const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      maxLength: 36,
      required: true,
    },
    email: { type: String, unique: true, trim: true, required: true },
    password: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
