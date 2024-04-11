import {
  addDept,
  deleteDept,
  editDept,
  getDept,
} from "../controllers/api-dept-controller";
import { Router } from "express";

import express from "express";

export const apiDeptRoutes: Router = express.Router();

// Add New Dept
apiDeptRoutes.post("/api/dept", addDept);
// Get Dept
apiDeptRoutes.get("/api/dept", getDept);
// Update Dept
apiDeptRoutes.put("/api/dept", editDept);
// Delete Dept
apiDeptRoutes.delete("/api/dept", deleteDept);
