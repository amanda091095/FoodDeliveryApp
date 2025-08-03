const Task = require("../models/taskModel");

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a task
const addTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
