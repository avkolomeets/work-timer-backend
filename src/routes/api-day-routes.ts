import {
  addDay,
  deleteDay,
  editDay,
  getDays,
} from "controllers/api-day-controller";
import { Router } from "express";

import express from "express";

export const apiDayRoutes: Router = express.Router();

// Get All Days
apiDayRoutes.get("/api/days", getDays);
// Add New Day
apiDayRoutes.post("/api/day", addDay);
// Get Day
apiDayRoutes.get("/api/day", getDays);
// Delete Day
apiDayRoutes.delete("/api/day", deleteDay);
// Update Day
apiDayRoutes.put("/api/day", editDay);
