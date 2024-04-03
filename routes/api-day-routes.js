const express = require("express");
const {
  getDays,
  addDay,
  getDay,
  deleteDay,
  editDay,
} = require("../controllers/api-day-controller");

const router = express.Router();

// Get All Days
router.get("/api/days", getDays);
// Add New Day
router.post("/api/day", addDay);
// Get Day
router.get("/api/day", getDay);
// Delete Day
router.delete("/api/day", deleteDay);
// Update Day
router.put("/api/day", editDay);

module.exports = router;
