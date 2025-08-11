const express = require("express");
const router = express.Router();
const { addDocument, getAllDocuments, downloadDocument, updateDocumentStatus} = require("../controllers/documentController");
const {verifyToken} = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024  
  }
}) 

router.post(
  "/:customerEmail/:uploadName",
  upload.single('file'),  
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