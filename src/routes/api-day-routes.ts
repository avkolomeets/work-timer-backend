import { Router } from "express";
import {
  createDay,
  deleteDay,
  getDay,
  getDays,
  updateOrCreateDay,
} from "../controllers/api-day-controller";

import express from "express";

export const apiDayRoutes: Router = express.Router();

// Add New Day
apiDayRoutes.post("/api/day", createDay);
// Get All Days
apiDayRoutes.get("/api/days", getDays);
// Get Day
apiDayRoutes.get("/api/day", getDay);
// Update Day
apiDayRoutes.patch("/api/day", updateOrCreateDay);
// Delete Day
apiDayRoutes.delete("/api/day", deleteDay);
