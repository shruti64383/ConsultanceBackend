const express = require("express");
const router = express.Router();
const { getUserDashboard } = require("../controllers/dashboardController");
const {verifyToken} = require("../middleware/authMiddleware");

router.get("/", verifyToken, getUserDashboard);

module.exports = router;
