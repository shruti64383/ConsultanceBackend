const express = require("express");
const router = express.Router();
//const { getAllServices, getServiceById, deleteServiceById, updateServicePriority, updateServiceStatus} = require("../controllers/serviceController");
const{addService, updateServiceStatus, deleteServiceById, getAllServices, getAllServicesByEmail, getAllServiceDocsByEmail, getAllServicesForDashboard} = require("../controllers/serviceController");
const {verifyToken} = require("../middleware/authMiddleware");


router.get("/", getAllServicesForDashboard);
router.post("/:customerId", addService);
router.get("/email/:customerEmail", getAllServicesByEmail);
router.get("/docs/:customerEmail", getAllServiceDocsByEmail); // For fetching documents by customer email
router.get("/:customerId", getAllServices);
// router.get("/:serviceId", getServiceById);
router.delete("/:customerId/delete/:serviceId", deleteServiceById);
// router.patch("/priority/:serviceId", updateServicePriority);
router.patch("/status/:serviceId", updateServiceStatus);

module.exports = router;