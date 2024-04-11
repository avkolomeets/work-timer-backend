import {
  addDay,
  deleteDay,
  editDay,
  getDay,
  getDays,
} from "../controllers/api-day-controller";
import { Router } from "express";

import express from "express";

export const apiDayRoutes: Router = express.Router();

// Add New Day
apiDayRoutes.post("/api/day", addDay);
// Get All Days
apiDayRoutes.get("/api/days", getDays);
// Get Day
apiDayRoutes.get("/api/day", getDay);
// Update Day
apiDayRoutes.put("/api/day", editDay);
// Delete Day
apiDayRoutes.delete("/api/day", deleteDay);
