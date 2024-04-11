import {
  addUser,
  checkToken,
  checkUserName,
  deleteUser,
  editUser,
  getToken,
  getUser,
} from "../controllers/api-user-controller";
import { Router } from "express";

import express from "express";

export const apiUserRoutes: Router = express.Router();

// Add New User - creates a new user by passing login, password and other info
apiUserRoutes.post("/api/user", addUser);
// Check User Name - checks if the name already exists
apiUserRoutes.get("/api/checkUserName", checkUserName);
// Get Token
apiUserRoutes.get("/api/getToken", getToken);
// Check Token
apiUserRoutes.get("/api/checkToken", checkToken);
// Get User
apiUserRoutes.get("/api/user", getUser);
// Update User
apiUserRoutes.put("/api/user", editUser);
// Delete User
apiUserRoutes.delete("/api/user", deleteUser);
