const express = require("express");
const {
  getTasks,
  addTask,
  getTask,
  deleteTask,
  editTask,
} = require("../controllers/api-task-controller");

const router = express.Router();

// Get All Tasks
router.get("/api/tasks", getTasks);
// Add New Task
router.post("/api/task", addTask);
// Get Task by ID
router.get("/api/task/:id", getTask);
// Delete Task by ID
router.delete("/api/task/:id", deleteTask);
// Update Task by ID
router.put("/api/task/:id", editTask);

module.exports = router;
