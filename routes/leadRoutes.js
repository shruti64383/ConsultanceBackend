const express = require("express");
const router = express.Router();
const { getAllLeads, getLeadById, deleteLeadById, updateLeadPriority, updateLeadStatus} = require("../controllers/leadController");
const {verifyToken} = require("../middleware/authMiddleware");

router.get("/", getAllLeads);
router.get("/:leadId", getLeadById);
router.delete("/:leadId", deleteLeadById);
router.patch("/priority/:leadId", updateLeadPriority);
router.patch("/status/:leadId", updateLeadStatus);

module.exports = router;