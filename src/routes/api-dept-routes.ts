import {
  addDept,
  deleteDept,
  editDept,
  getDept,
} from "../controllers/api-dept-controller";
import { Router } from "express";

import express from "express";

export const apiDeptRoutes: Router = express.Router();

// Get Dept
apiDeptRoutes.get("/api/dept", getDept);
// Add New Dept
apiDeptRoutes.post("/api/dept", addDept);
// Delete Dept
apiDeptRoutes.delete("/api/dept", deleteDept);
// Update Dept
apiDeptRoutes.put("/api/dept", editDept);
