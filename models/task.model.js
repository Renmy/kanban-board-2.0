const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    assigne: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["TO DO", "In Progress", "In Review", "Done"],
    },
    priority: { type: String, required: true, enum: ["High", "Low", "Medium"] },
    dueDate: { type: Date, required: true, default: Date.now },
    board: { type: Schema.Types.ObjectId, required: true, ref: "Board" },
  },
  { timestamps: true }
);

module.exports = model("Task", taskSchema);
