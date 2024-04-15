import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/api-task-controller";

import express from "express";

export const apiTaskRoutes: Router = express.Router();

// Add New Task
apiTaskRoutes.post("/api/tasks", createTask);
// Get All Tasks
apiTaskRoutes.get("/api/tasks", getTasks);
// Get Task by ID
apiTaskRoutes.get("/api/tasks/:id", getTask);
// Update Task by ID
apiTaskRoutes.patch("/api/tasks/:id", updateTask);
// Delete Task by ID
apiTaskRoutes.delete("/api/tasks/:id", deleteTask);
