const express = require("express");
const router = express.Router();
//const { addCustomer, getAllCustomers, updateCustomerPriority, deleteCustomerById, getCustomerById, updateCustomerStatus} = require("../controllers/customerController");
const { addDocument, getAllDocuments, downloadDocument, updateDocumentStatus} = require("../controllers/documentController");
const {verifyToken} = require("../middleware/authMiddleware");
// In documentRoutes.js
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const multer = require("multer");

// Multer in-memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
})

// router.post(
//   "/:customerEmail/:uploadName", 
//   upload.single('pdf'), // <-- This processes the file upload
//   addDocument
// );

router.post(
  "/:customerEmail/:uploadName", 
  upload.single("file"), // <-- This processes the file upload
  (req, res, next) => {
        console.log('Multer processed file:', req.file);
        if (!req.file) {
      console.log("No file received in Multer");
    }
        next();
      },
  addDocument
);

// router.post(
//   "/:customerEmail/:uploadName", 
//   addDocument
// );

// router.post("/:customerEmail/:uploadName", addDocument);
router.get("/:customerEmail", getAllDocuments);
// router.patch("/priority/:customerId", updateCustomerPriority);
// router.delete("/:customerId", deleteCustomerById);
// router.get("/:customerId", getCustomerById);
router.patch("/status/:documentId", updateDocumentStatus);

//router.patch("/:leadId", updateLeadPriority);

router.get("/download/:documentId", downloadDocument);

module.exports = router;