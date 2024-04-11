import {
  addTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
} from "../controllers/api-task-controller";
import { Router } from "express";

import express from "express";

export const apiTaskRoutes: Router = express.Router();

// Add New Task
apiTaskRoutes.post("/api/task", addTask);
// Get All Tasks
apiTaskRoutes.get("/api/tasks", getTasks);
// Get Task by ID
apiTaskRoutes.get("/api/task/:id", getTask);
// Update Task by ID
apiTaskRoutes.put("/api/task/:id", editTask);
// Delete Task by ID
apiTaskRoutes.delete("/api/task/:id", deleteTask);
