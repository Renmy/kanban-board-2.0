const router = require("express").Router();
const Board = require("../models/board.model.js");
const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

router.post("/", async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const newBoard = await Board.create({ title, description, user: userId });

    res.status(201).json({
      message: `New Board for Project ${newBoard.title} created successfully.`,
      board: newBoard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    //need to be by userId once logged in
    const getAllBoards = await Board.find();
    res.json(getAllBoards);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const singleBoard = await Board.findById(boardId).populate("tasks");
    res.json(singleBoard);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const updatedBoard = await Board.findByIdAndUpdate(boardId, req.body, {
      new: true,
    });
    res.json({
      message: `Board for Project ${updatedBoard.title} updated successfully.`,
      board: updatedBoard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const deletedBoard = await Board.findByIdAndDelete(boardId);
    //Need to delete all tasks associated with this board
    for (const task of deletedBoard.tasks) {
      await Task.findByIdAndDelete(task);
    }
    res.json({
      message: `Board for Project ${deletedBoard.title} and all its Tasks deleted successfully.`,
      board: deletedBoard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
