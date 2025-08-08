const express = require("express");
const router = express.Router();
const { getUserTasks } = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET /api/tasks - returns all tasks for the logged-in user
router.get("/", verifyToken, getUserTasks);

module.exports = router;
