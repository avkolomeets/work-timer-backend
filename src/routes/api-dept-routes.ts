import { Router } from "express";
import {
  createDept,
  deleteDept,
  getDept,
  updateOrCreateDept,
} from "../controllers/api-dept-controller";

import express from "express";

export const apiDeptRoutes: Router = express.Router();

// Add New Dept
apiDeptRoutes.post("/api/dept", createDept);
// Get Dept
apiDeptRoutes.get("/api/dept", getDept);
// Update Dept
apiDeptRoutes.patch("/api/dept", updateOrCreateDept);
// Delete Dept
apiDeptRoutes.delete("/api/dept", deleteDept);
