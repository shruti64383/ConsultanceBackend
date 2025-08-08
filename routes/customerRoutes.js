const express = require("express");
const router = express.Router();
const { addCustomer, getCustomerByEmail, getAllCustomers, updateCustomerPriority, deleteCustomerById, getCustomerById, updateCustomerStatus} = require("../controllers/customerController");
const {verifyToken} = require("../middleware/authMiddleware");

router.post("/", addCustomer);
router.get("/", getAllCustomers);
router.patch("/priority/:customerId", updateCustomerPriority);
router.delete("/:customerId", deleteCustomerById);
router.get("/:customerId", getCustomerById);
router.get("/details/:email", getCustomerByEmail);
router.patch("/status/:customerId", updateCustomerStatus);

//router.patch("/:leadId", updateLeadPriority);

module.exports = router;