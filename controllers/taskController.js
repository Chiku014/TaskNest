const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const task = new Task({
      title: req.body.title,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (error) {
    console.error("UPDATE TASK ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE TASK ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};
