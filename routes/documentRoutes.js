const express = require("express");
const router = express.Router();
//const { addCustomer, getAllCustomers, updateCustomerPriority, deleteCustomerById, getCustomerById, updateCustomerStatus} = require("../controllers/customerController");
const { addDocument, getAllDocuments, downloadDocument, updateDocumentStatus} = require("../controllers/documentController");
const {verifyToken} = require("../middleware/authMiddleware");
// In documentRoutes.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post(
  "/:customerEmail/:uploadName", 
  upload.single('pdf'), // <-- This processes the file upload
  addDocument
);

// router.post("/:customerEmail/:uploadName", addDocument);
router.get("/:customerEmail", getAllDocuments);
// router.patch("/priority/:customerId", updateCustomerPriority);
// router.delete("/:customerId", deleteCustomerById);
// router.get("/:customerId", getCustomerById);
router.patch("/status/:documentId", updateDocumentStatus);

//router.patch("/:leadId", updateLeadPriority);

router.get("/download/:documentId", downloadDocument);

module.exports = router;