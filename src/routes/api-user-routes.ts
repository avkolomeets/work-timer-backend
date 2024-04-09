import {
  addUser,
  deleteUser,
  editUser,
  getUser,
} from "../controllers/api-user-controller";
import { Router } from "express";

import express from "express";

export const apiUserRoutes: Router = express.Router();

// Get User
apiUserRoutes.get("/api/user", getUser);
// Add New User
apiUserRoutes.post("/api/user", addUser);
// Delete User
apiUserRoutes.delete("/api/user", deleteUser);
// Update User
apiUserRoutes.put("/api/user", editUser);
