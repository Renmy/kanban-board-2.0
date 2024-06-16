const { Schema, model } = require("mongoose");

const boardSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Board", boardSchema);
