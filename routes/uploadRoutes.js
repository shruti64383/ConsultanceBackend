const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const Document = require('../models/Documents');

// ✅ Safer folder creation (guaranteed in backend root)
const uploadPath = path.join(process.cwd(), 'uploads', 'documents');


// 📦 Setup Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 🔐 Protected Upload Route
router.post('/', verifyToken, upload.single('document'), async (req, res) => {
  try {
    const documentType = req.body.documentType;
    const userId = req.user.id;

    const newDoc = new Document({
      userId,
      documentType,
      filename: req.file.filename,
      filePath: req.file.path,
    });

    await newDoc.save();

    // 🌐 Add file URL for frontend preview
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;

    console.log('📥 Upload received:', {
      userId,
      documentType,
      filename: req.file.filename,
    });

    res.status(200).json({
      message: 'Upload successful',
      document: {
        ...newDoc._doc,
        fileUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
