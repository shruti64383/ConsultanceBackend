const User = require("../models/User");
const Leads = require("../models/Leads")
const Customers = require("../models/Customers");
const Documents = require("../models/Documents");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const multer = require("multer");

// // Multer in-memory storage
// const upload = multer({ 
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5 MB limit
//   }
// })

// const express = require('express');
// const multer = require('multer');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');

// const app = express();
// const upload = multer({ dest: 'uploads/' }); // Temporary storage

// // Connect to MongoDB
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri);
// const db = client.db("documentDB");
// const documents = db.collection("documents");

// // Upload Endpoint
// app.post('/upload', upload.single('pdf'), async (req, res) => {
//   try {
//     const { originalname, mimetype, path, size } = req.file;
//     const pdfBuffer = fs.readFileSync(path); // Read temp file

//     await documents.insertOne({
//       userId: req.user._id, // From auth middleware
//       name: originalname,
//       data: pdfBuffer,
//       contentType: mimetype,
//       size: size,
//       uploadDate: new Date(),
//       metadata: req.body // Optional: { category, description }
//     });

//     fs.unlinkSync(path); // Delete temp file
//     res.status(201).send("PDF uploaded successfully!");
//   } catch (err) {
//     res.status(500).send("Error uploading PDF");
//   }
// });

// const Document = require('../models/documentModel'); // Assuming you have a Document model
//const fs = require('fs');

// exports.addDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: "No file uploaded" });
//     }

//     const { originalname, mimetype, path, size } = req.file;
//     //const {  path } = req.file;
//     const { customerEmail, uploadName } = req.params;
//     const pdfBuffer = fs.readFileSync(path);

//     // Save to MongoDB
//     const newDocument = await Documents.create({
//       customerEmail: customerEmail,
//       name: uploadName,
//       data: pdfBuffer,
//       contentType: mimetype,
//       size: size
//     //   uploadDate: new Date(),
//     //   metadata: req.body // Optional fields (e.g., service, category)
//     });

//     fs.unlinkSync(path); // Delete temp file

//     // const user = await User.findOne({ email: customerEmail });

//     // const updatedUser = await User.findOneAndUpdate(
//     //     { email: customerEmail },
//     //     { $push: { UploadedDocuments: uploadName } },  
//     //     { new: true }  
//     // );
                
//     // if (!updatedUser) {
//     //   return res.status(404).json({ msg: "User not found" });
//     // }

//     res.status(201).json({ 
//       msg: "Document uploaded successfully",
//       document: newDocument 
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ msg: "Error uploading document", error: error.message });
//   }
// };

// exports.addDocument = [
//   upload.single('pdf'),
//   async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: "No file uploaded" });
//     }

//     const { originalname, mimetype, path, size, buffer } = req.file;
//     const { customerEmail, uploadName } = req.params;

//     const newDocument = await Documents.create({
//       customerEmail: customerEmail,
//       name: uploadName,
//       data: buffer,
//       contentType: mimetype,
//       size: size
//     });

//     res.status(201).json({ 
//       msg: "Document uploaded successfully",
//       document: newDocument 
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ msg: "Error uploading document", error: error.message });
//   }
// }
// ]

exports.addDocument = async (req, res) => {
  try {
    if (!req.file) {
      console.log("Incoming file: not obtained"); 
      return res.status(400).json({ msg: "No file uploaded" });
    }

    console.log("Incoming file:", req.file); 

    const { originalname, mimetype, size, buffer } = req.file;
    const { customerEmail, uploadName } = req.params;

    const newDocument = await Documents.create({
      customerEmail: customerEmail,
      name: uploadName,
      data: buffer,
      contentType: mimetype,
      size: size
    });

    console.log("Saved document:", newDocument);

    res.status(201).json({ 
      msg: "Document uploaded successfully",
      document: newDocument 
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ msg: "Error uploading document", error: error.message });
  }
};


exports.downloadDocument = async (req, res) => {
  try {

    const documentId = Number(req.params.documentId); // ✅ Just convert

    if (isNaN(documentId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid document ID",
      });
    }


    // Find document in MongoDB
    const doc = await Documents.findOne({documentId});

    if (!doc) {
      return res.status(404).json({ 
        success: false,
        msg: "Document not found" 
      });
    }

    // Set headers for PDF download
    // res.setHeader('Content-Type', doc.contentType);
    // res.setHeader('Content-Disposition', `attachment; filename="${doc.name}.pdf"`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="document-${doc._id}.pdf"`,
    });
    
    // Send the binary data
    res.send(doc.data);

  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ 
      success: false,
      msg: "Error downloading document",
      error: error.message 
    });
  }
};

// exports.addDocument = async (req, res) => {
//     const { name, data } = req.body; 
//     //const servicesArray = typeof service === 'string' ? [service] : Array.isArray(service) ? service : [];
//     try {

//         // const user = await Customers.create({ name, email, phone, services: servicesArray, priority }); // no hashing here
//         const user = await Customers.create({ name, email, phone, priority }); // no hashing here
//         res.status(201).json({ msg: "Customer Created Successfully" });
//     } catch (error) {
//         console.error("Register Error:", error);
//         res.status(500).json({ msg: "Error registering user", error: error.message });
//     }
// };

exports.getAllDocuments = async (req, res) => {
    try {

        // Extract customerEmail from request parameters
        const customerEmail = req.params.customerEmail;

        // Fetch all documents for the specific customer
        const documents = await Documents.find({ customerEmail: customerEmail });

        // Explicitly ensure we're working with an array
        const docsArray = Array.isArray(documents) ? documents : [documents];

        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Documents fetched successfully",
            count: docsArray.length,
            data: docsArray  // Explicit array of documents
        });
        
    } catch (error) {
        console.error("Fetch Documents Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching documents",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

// exports.updateCustomerPriority = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { priority } = req.body; // Expecting { priority: "high" }

//     const updatedCustomer = await Customers.findOneAndUpdate(
//       { customerId },
//       { priority },
//       { new: true}
//     );

//     if (!updatedCustomer) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Priority updated successfully",
//       data: updatedCustomer
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating priority",
//       error: error.message
//     });
//   }
// };

// exports.deleteCustomerById = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const customer = await Customers.findOne({ customerId: customerId });

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found"
//       });
//     }

//     await Customers.deleteOne({ customerId: customerId });

//     res.status(200).json({
//       success: true,
//       message: "Customer deleted successfully"
//     });
//   } catch (error) {
//     console.error("Delete Customer Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting customer",
//       error: error.message
//     });
//   }
// };

// exports.getCustomerById = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const customer = await Customers.findOne({ customerId: customerId });

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Customer fetched successfully",
//       data: customer
//     });
//   } catch (error) {
//     console.error("Fetch Customer Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching customer",
//       error: error.message
//     });
//   }
// };

exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentId } = req.body;
    const { status } = req.body; // Expecting { priority: "high" }

    const updatedDocument = await Documents.findOneAndUpdate(
      { documentId },
      { status },
      { new: true}
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    if(status === 'approved') {
      // Update the user's UploadedDocuments array
      const customerEmail = updatedDocument.customerEmail;
      const uploadName = updatedDocument.name; // Assuming 'name' is the document name

      const user = await User.findOne({ email: customerEmail });

    const updatedUser = await User.findOneAndUpdate(
        { email: customerEmail },
        { $push: { UploadedDocuments: uploadName } },  
        { new: true }  
    );
                
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
  }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedDocument
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: error.message
    });
  }
};
