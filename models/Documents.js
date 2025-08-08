const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // documentType: { type: String, required: true }, // Aadhar, PAN, etc.
  // filename: String,
  // filePath: String,
  // uploadedAt: { type: Date, default: Date.now },
 
  // documentId: ObjectId,           // Reference to the user who uploaded
  // name: String,               // Original filename (e.g., "contract.pdf")
  // customerEmail: String,      // Email of the customer
  // data: Binary,               // PDF binary data (Buffer in Node.js)
  // contentType: String,        // MIME type (e.g., "application/pdf")
  // size: Number,               // File size in bytes (e.g., 2048000)
  // uploadDate: Date,           // Timestamp of upload
  // metadata: {                 // Optional extra fields
  //   category: String,         // e.g., "Invoice", "Contract"
  //   description: String
  // } 

  documentId: {
    type: Number,
    unique: true
  },
  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  customerEmail: {
    type: String,
    required: [true, 'Email is required'],
    
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },

  // PDF binary data (Buffer in Node.js)
  data: {
    type: Buffer
  },   

  // MIME type (e.g., "application/pdf")
  contentType: {
    type: String
  },
  
  // File size in bytes (e.g., 2048000)
  size: {
    type: Number
  },

  //status tracking
  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending'
  },

  // Automatic timestamp
  date: {
    type: Date,
    default: Date.now
  }

});

documentSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const result = await Documents.findOne()
      .sort('-documentId') // Sort in descending order
      .select('documentId') // Only select the documentId field
      .lean(); // Convert to plain JS object

    this.documentId = result ? result.documentId + 1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});

const Documents = mongoose.model("Documents", documentSchema);
module.exports = Documents;

//module.exports = mongoose.model('Document', documentSchema);
