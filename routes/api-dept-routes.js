const express = require("express");
const {
  addDept,
  getDept,
  deleteDept,
  editDept,
} = require("../controllers/api-dept-controller");

const router = express.Router();

// Get Dept
router.get("/api/dept", getDept);
// Add New Dept
router.post("/api/dept", addDept);
// Delete Dept
router.delete("/api/dept", deleteDept);
// Update Dept
router.put("/api/dept", editDept);

module.exports = router;
