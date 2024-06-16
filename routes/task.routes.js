const router = require("express").Router();
const Board = require("../models/board.model.js");
const Task = require("../models/task.model.js");

router.post("/", async (req, res) => {
  try {
    const { title, description, assigne, status, priority, dueDate, board } =
      req.body;
    const newTask = await Task.create({
      title,
      description,
      assigne,
      status,
      priority,
      dueDate,
      board,
    });
    //Need to add the task to the board tasks list
    await Board.findByIdAndUpdate(newTask.board, {
      $push: { tasks: newTask._id },
    });
    res.status(201).json({
      message: `New Task Added successfully.`,
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const getAllTasks = await Task.find();
    res.json(getAllTasks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const singleTask = await Task.findById(taskId);
    res.json(singleTask);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    res.json({
      message: `Task updated successfully.`,
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    //Need to delete the task from the board tasks list
    await Board.findByIdAndUpdate(deletedTask.board, {
      $pull: { tasks: deletedTask._id },
    });
    res.json({
      message: `Task ${deletedTask.title} deleted successfully.`,
      task: deletedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
